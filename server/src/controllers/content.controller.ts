import type { Response } from 'express';
import type { QueryFilter } from 'mongoose';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { ContentModel, type ContentDoc } from '../models/content.model.js';
import type { ContentBodyInput, ListContentsQuery } from '../schemas/content.schema.js';
import { AppError } from '../utils/app-error.js';
import { sendSuccess } from '../utils/api-response.js';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listContents(req: AuthRequest, res: Response): Promise<void> {
  const { search, genre, status, page, limit } = req.query as unknown as ListContentsQuery;

  const isAdmin = Boolean(req.user);

  if (!isAdmin && status && status !== 'published') {
    throw AppError.forbidden('Filter status selain "published" hanya tersedia untuk admin.');
  }

  const effectiveStatus = isAdmin ? status : 'published';

  const filter: QueryFilter<ContentDoc> = {};

  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: 'i' };
  }
  if (genre) {
    filter.genre = genre;
  }
  if (effectiveStatus) {
    filter.status = effectiveStatus;
  }

  const [items, total] = await Promise.all([
    ContentModel.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContentModel.countDocuments(filter),
  ]);

  sendSuccess(res, items, {
    meta: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  });
}

export async function getContentById(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
  const content = await ContentModel.findById(req.params.id);

  const isAdmin = Boolean(req.user);

  if (!content || (!isAdmin && content.status !== 'published')) {
    throw AppError.notFound('Content tidak ditemukan.');
  }

  sendSuccess(res, content);
}

export async function createContent(req: AuthRequest, res: Response): Promise<void> {
  const input = req.body as ContentBodyInput;

  const content = await ContentModel.create({
    title: input.title,
    description: input.description,
    genre: input.genre,
    thumbnail_url: input.thumbnail_url ?? null,
    status: input.status,
    published_at: input.status === 'published' ? (input.published_at ?? null) : null,
  });

  sendSuccess(res, content, { status: 201, message: 'Content berhasil dibuat.' });
}

export async function updateContent(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
  const input = req.body as ContentBodyInput;

  const content = await ContentModel.findByIdAndUpdate(
    req.params.id,
    {
      title: input.title,
      description: input.description,
      genre: input.genre,
      thumbnail_url: input.thumbnail_url ?? null,
      status: input.status,
      published_at: input.status === 'published' ? (input.published_at ?? null) : null,
    },
    { returnDocument: 'after', runValidators: true },
  );

  if (!content) {
    throw AppError.notFound('Content tidak ditemukan.');
  }

  sendSuccess(res, content, { message: 'Content berhasil diperbarui.' });
}

export async function deleteContent(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
  const content = await ContentModel.findByIdAndDelete(req.params.id);

  if (!content) {
    throw AppError.notFound('Content tidak ditemukan.');
  }

  sendSuccess(res, null, { message: 'Content berhasil dihapus.' });
}
