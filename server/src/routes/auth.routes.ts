import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getMe, login } from '../controllers/auth.controller.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi beberapa menit kemudian.',
  },
});

authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.get('/me', requireAuth, getMe);
