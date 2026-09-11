/**
 * Government Submission Routes
 */
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import {
  getAllGovernmentSubmissions,
  getGovernmentSubmissionById,
  getGovernmentSubmissionsByBooking,
  getPendingGovernmentSubmissions,
  getGovernmentSubmissionStats,
  getRecentGovernmentSubmissions,
} from '../queries/government_submissions';
import type { GovernmentSubmission, ApiResponse, PaginatedResponse } from '../types';

const governmentSubmissions = new Hono();

governmentSubmissions.get('/', async (c: Context) => {
  try {
    const { page, pageSize } = c.req.query();
    const result = await getAllGovernmentSubmissions({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return c.json<ApiResponse<PaginatedResponse<GovernmentSubmission>>>({
      success: true,
      data: result,
      message: 'Government submissions retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get government submissions: ${String(error)}` });
  }
});

governmentSubmissions.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid submission ID' });
    const submission = await getGovernmentSubmissionById(id);
    if (!submission) throw new HTTPException(404, { message: 'Submission not found' });
    return c.json<ApiResponse<GovernmentSubmission>>({
      success: true,
      data: submission,
      message: 'Government submission retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get government submission: ${String(error)}` });
  }
});

governmentSubmissions.get('/booking/:bookingId', async (c: Context) => {
  try {
    const bookingId = Number(c.req.param('bookingId'));
    if (isNaN(bookingId)) throw new HTTPException(400, { message: 'Invalid booking ID' });
    const submissions = await getGovernmentSubmissionsByBooking(bookingId);
    return c.json<ApiResponse<GovernmentSubmission[]>>({
      success: true,
      data: submissions,
      message: 'Government submissions by booking retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get government submissions by booking: ${String(error)}` });
  }
});

governmentSubmissions.get('/pending', async (c: Context) => {
  try {
    const submissions = await getPendingGovernmentSubmissions();
    return c.json<ApiResponse<GovernmentSubmission[]>>({
      success: true,
      data: submissions,
      message: 'Pending government submissions retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get pending submissions: ${String(error)}` });
  }
});

governmentSubmissions.get('/stats', async (c: Context) => {
  try {
    const stats = await getGovernmentSubmissionStats();
    return c.json<ApiResponse<any>>({
      success: true,
      data: stats,
      message: 'Government submission statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get government submission statistics: ${String(error)}` });
  }
});

export default governmentSubmissions;
