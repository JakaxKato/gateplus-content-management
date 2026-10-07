import { Router } from 'express';
import { getMe, login } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();

authRouter.post('/login', validate(loginSchema), login);
authRouter.get('/me', requireAuth, getMe);
