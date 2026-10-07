import type { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface SuccessOptions {
  status?: number;
  message?: string;
  meta?: PaginationMeta;
}

export function sendSuccess<T>(res: Response, data: T, options: SuccessOptions = {}): Response {
  const { status = 200, message, meta } = options;
  return res.status(status).json({
    success: true,
    ...(message ? { message } : {}),
    data,
    ...(meta ? { meta } : {}),
  });
}
