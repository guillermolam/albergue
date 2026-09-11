/**
 * Payment Routes
 */
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByBooking,
  getPendingPayments,
  getOverduePayments,
  getPaidPayments,
  getPaymentStats,
  getRecentPayments,
  searchPayments,
} from '../queries/payments';
import type { Payment, ApiResponse, PaginatedResponse } from '../types';

const payments = new Hono();

payments.get('/', async (c: Context) => {
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

payments.get('/:id', async (c: Context) => {
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

payments.get('/booking/:bookingId', async (c: Context) => {
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

payments.get('/pending', async (c: Context) => {
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

payments.get('/overdue', async (c: Context) => {
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

payments.get('/stats', async (c: Context) => {
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

export default payments;
