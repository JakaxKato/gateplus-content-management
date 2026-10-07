import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { UserModel } from '../models/user.model.js';
import type { LoginInput } from '../schemas/auth.schema.js';
import { AppError } from '../utils/app-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { signAuthToken } from '../utils/jwt.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw AppError.unauthorized('Email atau password salah.');
  }

  const token = signAuthToken({ id: String(user._id), role: user.role });

  sendSuccess(res, { token, user }, { message: 'Login berhasil.' });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    throw AppError.unauthorized();
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw AppError.notFound('User tidak ditemukan.');
  }

  sendSuccess(res, user);
}
