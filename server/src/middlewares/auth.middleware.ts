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

/**
 * Dipakai endpoint yang boleh diakses publik tetapi berperilaku berbeda untuk admin
 * (mis. GET /contents: anonim hanya melihat published, admin melihat semua status).
 *
 * - Tanpa header Authorization  -> lanjut sebagai anonim.
 * - Token valid                 -> req.user diisi, lanjut sebagai admin.
 * - Token ada tapi tidak valid  -> 401, agar frontend bisa membersihkan sesi yang kedaluwarsa.
 */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header) {
    next();
    return;
  }

  if (!header.startsWith('Bearer ')) {
    throw AppError.unauthorized('Format header Authorization tidak valid. Gunakan "Bearer <token>".');
  }

  const token = header.slice('Bearer '.length).trim();
  const user = verifyAuthToken(token);

  if (!user) {
    throw AppError.unauthorized('Token tidak valid atau sudah kedaluwarsa.');
  }

  req.user = user;
  next();
}
