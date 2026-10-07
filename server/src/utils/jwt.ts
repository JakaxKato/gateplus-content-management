import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthUser {
  id: string;
  role: string;
}

export function signAuthToken(user: AuthUser): string {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function verifyAuthToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (!payload.sub) {
      return null;
    }
    return {
      id: payload.sub,
      role: typeof payload.role === 'string' ? payload.role : 'admin',
    };
  } catch {
    return null;
  }
}
