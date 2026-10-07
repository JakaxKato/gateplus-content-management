import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app-error.js';
import { verifyAuthToken, type AuthUser } from '../utils/jwt.js';

export interface AuthRequest<Params = Record<string, string>> extends Request<Params> {
  user?: AuthUser;
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw AppError.unauthorized(
      'Token autentikasi tidak ditemukan. Sertakan header "Authorization: Bearer <token>".',
    );
  }

  const token = header.slice('Bearer '.length).trim();
  const user = verifyAuthToken(token);

  if (!user) {
    throw AppError.unauthorized('Token tidak valid atau sudah kedaluwarsa.');
  }

  req.user = user;
  next();
}
