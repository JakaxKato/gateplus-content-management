import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/app-error.js';

type RequestPart = 'body' | 'query';

export function validate(schema: ZodType, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join('.') : part,
        message: issue.message,
      }));
      next(AppError.badRequest('Validasi gagal', errors));
      return;
    }

    if (part === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req.body = result.data;
    }

    next();
  };
}
