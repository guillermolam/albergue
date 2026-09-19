/**
 * Payment Routes
 */
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import { authMiddleware } from '../lib/middleware.js';
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByBooking,
  getPaymentByTransactionId,
  getPendingPayments,
  getOverduePayments,
  getPaidPayments,
  getPaymentStats,
  getRecentPayments,
  searchPayments,
} from '../queries/payments.js';
import { getBookingByReference } from '../queries/bookings.js';
import {
  createPayment,
  markPaymentAsPaid,
  markPaymentAsFailed,
  recordGatewayResponse,
} from '../commands/payments.js';
import {
  getRedsysConfig,
  buildPaymentRequest,
  verifyNotification,
  isApproved,
} from '../lib/redsys.js';
import type { CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '@albergue/api-contract';
import type { Payment, ApiResponse, PaginatedResponse } from '../types/index.js';

const payments = new Hono();

// Payment read endpoints expose sensitive financial data and require admin
// auth. /intent and /redsys/notification stay public (guest payment-creation
// step and the external gateway webhook respectively) — see below.
payments.get('/', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { page, pageSize, orderBy, orderDirection } = c.req.query();
    const result = await getAllPayments({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orderBy: orderBy as string,
      orderDirection: orderDirection as 'asc' | 'desc',
    });
    return c.json<ApiResponse<PaginatedResponse<Payment>>>({
      success: true,
      data: result,
      message: 'Payments retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get payments: ${String(error)}` });
  }
});

payments.get('/booking/:bookingId', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const bookingId = Number(c.req.param('bookingId'));
    if (isNaN(bookingId)) throw new HTTPException(400, { message: 'Invalid booking ID' });
    const payments = await getPaymentsByBooking(bookingId);
    return c.json<ApiResponse<Payment[]>>({
      success: true,
      data: payments,
      message: 'Payments by booking retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get payments by booking: ${String(error)}` });
  }
});

payments.get('/pending', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const payments = await getPendingPayments();
    return c.json<ApiResponse<Payment[]>>({
      success: true,
      data: payments,
      message: 'Pending payments retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get pending payments: ${String(error)}` });
  }
});

payments.get('/overdue', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const payments = await getOverduePayments();
    return c.json<ApiResponse<Payment[]>>({
      success: true,
      data: payments,
      message: 'Overdue payments retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get overdue payments: ${String(error)}` });
  }
});

payments.get('/stats', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const stats = await getPaymentStats();
    return c.json<ApiResponse<any>>({
      success: true,
      data: stats,
      message: 'Payment statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get payment statistics: ${String(error)}` });
  }
});

/**
 * GET /payments/:id - Get payment by ID
 * Registered after every static-segment GET route above: Hono matches
 * routes in registration order, and this single-segment wildcard would
 * otherwise shadow static paths like /pending or /stats.
 */
payments.get('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid payment ID' });
    const payment = await getPaymentById(id);
    if (!payment) throw new HTTPException(404, { message: 'Payment not found' });
    return c.json<ApiResponse<Payment>>({
      success: true,
      data: payment,
      message: 'Payment retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get payment: ${String(error)}` });
  }
});

/**
 * POST /payments/intent - Redsys payment intent boundary (BOOK-004)
 *
 * The browser posts the returned params+signature straight to the Redsys
 * gateway; card data never transits this system. Returns 501 until the
 * REDSYS_* env vars are configured (fail closed).
 */
payments.post('/intent', async (c: Context) => {
  const body = await c.req.json<CreatePaymentIntentRequest>().catch(() => null);
  if (!body?.bookingReference) {
    throw new HTTPException(400, { message: 'Missing required field: bookingReference' });
  }

  const config = getRedsysConfig();
  if (!config) {
    throw new HTTPException(501, {
      message: 'Payments are not configured on this deployment (REDSYS_* env vars missing).',
    });
  }

  const booking = await getBookingByReference(body.bookingReference);
  if (!booking) throw new HTTPException(404, { message: 'Booking not found' });

  const request = buildPaymentRequest(config, {
    bookingId: booking.id,
    amount: booking.totalAmount,
    bookingReference: booking.referenceNumber,
  });

  await createPayment({
    bookingId: booking.id,
    amount: booking.totalAmount,
    paymentType: 'redsys',
    transactionId: request.orderNumber,
    paymentStatus: 'awaiting_payment',
    paymentDeadline: booking.paymentDeadline ?? new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  return c.json<ApiResponse<CreatePaymentIntentResponse>>({
    success: true,
    data: {
      provider: 'redsys',
      clientToken: request.paramsBase64,
      signature: request.signature,
      gatewayUrl: request.gatewayUrl,
      reference: request.orderNumber,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /payments/redsys/notification - Redsys webhook (BOOK-004)
 *
 * Redsys posts application/x-www-form-urlencoded with Ds_MerchantParameters,
 * Ds_Signature, Ds_SignatureVersion. Signature verified timing-safe; unknown
 * or tampered notifications are rejected without side effects.
 */
payments.post('/redsys/notification', async (c: Context) => {
  const config = getRedsysConfig();
  if (!config) throw new HTTPException(503, { message: 'Payments not configured' });

  const form = await c.req.parseBody();
  const paramsBase64 = String(form['Ds_MerchantParameters'] ?? '');
  const signature = String(form['Ds_Signature'] ?? '');
  if (!paramsBase64 || !signature) {
    throw new HTTPException(400, { message: 'Malformed notification' });
  }

  const notification = verifyNotification(config, paramsBase64, signature);
  if (!notification) throw new HTTPException(400, { message: 'Invalid signature' });

  const payment = await getPaymentByTransactionId(notification.orderNumber);
  if (!payment) throw new HTTPException(404, { message: 'Unknown order' });

  // Amount tamper check: compare against the recorded payment amount
  const expectedCents = String(Math.round(Number(payment.amount) * 100));
  if (notification.amountCents !== expectedCents) {
    await recordGatewayResponse(payment.id, {
      rejected: 'amount_mismatch',
      ...notification.raw,
    });
    throw new HTTPException(400, { message: 'Amount mismatch' });
  }

  if (isApproved(notification.responseCode)) {
    await markPaymentAsPaid(payment.id, notification.orderNumber, undefined, notification.raw);
  } else {
    await markPaymentAsFailed(payment.id, `Redsys Ds_Response ${notification.responseCode}`);
    await recordGatewayResponse(payment.id, notification.raw);
  }

  // Redsys expects a plain 200; body is ignored
  return c.text('OK');
});

export default payments;
