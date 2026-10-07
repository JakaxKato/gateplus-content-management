import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/api-response.js';
import { authRouter } from './auth.routes.js';
import { contentRouter } from './content.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

apiRouter.use('/contents', contentRouter);
apiRouter.use('/auth', authRouter);
