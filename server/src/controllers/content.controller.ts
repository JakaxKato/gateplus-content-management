import type { Request, Response } from 'express';
import type { QueryFilter } from 'mongoose';
import { ContentModel, type ContentDoc } from '../models/content.model.js';
import type { ContentBodyInput, ListContentsQuery } from '../schemas/content.schema.js';
import { AppError } from '../utils/app-error.js';
import { sendSuccess } from '../utils/api-response.js';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listContents(req: Request, res: Response): Promise<void> {
  const { search, genre, status, page, limit } = req.query as unknown as ListContentsQuery;

  const filter: QueryFilter<ContentDoc> = {};

  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: 'i' };
  }
  if (genre) {
    filter.genre = genre;
  }
  if (status) {
    filter.status = status;
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

export async function getContentById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const content = await ContentModel.findById(req.params.id);

  if (!content) {
    throw AppError.notFound('Content tidak ditemukan.');
  }

  sendSuccess(res, content);
}

export async function createContent(req: Request, res: Response): Promise<void> {
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

export async function updateContent(req: Request<{ id: string }>, res: Response): Promise<void> {
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
    { new: true, runValidators: true },
  );

  if (!content) {
    throw AppError.notFound('Content tidak ditemukan.');
  }

  sendSuccess(res, content, { message: 'Content berhasil diperbarui.' });
}

export async function deleteContent(req: Request<{ id: string }>, res: Response): Promise<void> {
  const content = await ContentModel.findByIdAndDelete(req.params.id);

  if (!content) {
    throw AppError.notFound('Content tidak ditemukan.');
  }

  sendSuccess(res, null, { message: 'Content berhasil dihapus.' });
}
