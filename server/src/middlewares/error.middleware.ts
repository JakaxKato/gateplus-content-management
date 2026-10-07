import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/app-error.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Format nilai "${err.value}" untuk field ${err.path} tidak valid.`,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: Object.values(err.errors).map((issue) => ({
        field: issue.path,
        message: issue.message,
      })),
    });
    return;
  }

  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Data sudah ada (duplikat).',
    });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Body request bukan JSON yang valid.',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
  });
}
