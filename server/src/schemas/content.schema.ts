import { z } from 'zod';
import { CONTENT_STATUSES, GENRES } from '../constants.js';

const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);
const emptyToNull = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? null : value);

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const thumbnailUrlSchema = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .max(2048, 'Thumbnail URL maksimal 2048 karakter')
    .refine(isHttpUrl, 'Thumbnail URL harus berupa URL http/https yang valid')
    .nullable()
    .optional(),
);

const publishedAtSchema = z
  .preprocess(emptyToNull, z.coerce.date({ error: 'Tanggal publish tidak valid' }).nullable().optional());

export const listContentsQuerySchema = z.object({
  search: z
    .preprocess(emptyToUndefined, z.string().trim().max(150, 'Pencarian maksimal 150 karakter').optional()),
  genre: z.preprocess(emptyToUndefined, z.enum(GENRES, { error: 'Genre tidak valid' }).optional()),
  status: z.preprocess(emptyToUndefined, z.enum(CONTENT_STATUSES, { error: 'Status tidak valid' }).optional()),
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1, 'Page minimal 1').default(1)),
  limit: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(50, 'Limit maksimal 50').default(9)),
});

export const contentBodySchema = z
  .object({
    title: z
      .string({ error: 'Judul wajib diisi' })
      .trim()
      .min(1, 'Judul wajib diisi')
      .max(150, 'Judul maksimal 150 karakter'),
    description: z
      .string({ error: 'Deskripsi wajib diisi' })
      .trim()
      .min(1, 'Deskripsi wajib diisi')
      .max(5000, 'Deskripsi maksimal 5000 karakter'),
    genre: z.enum(GENRES, { error: 'Genre wajib diisi dan harus salah satu genre yang tersedia' }),
    thumbnail_url: thumbnailUrlSchema,
    status: z.enum(CONTENT_STATUSES, { error: 'Status harus "draft" atau "published"' }),
    published_at: publishedAtSchema,
  })
  .superRefine((data, ctx) => {
    if (data.status === 'published' && !data.published_at) {
      ctx.addIssue({
        code: 'custom',
        path: ['published_at'],
        message: 'Tanggal publish wajib diisi jika status published',
      });
    }
  });

export type ListContentsQuery = z.infer<typeof listContentsQuerySchema>;
export type ContentBodyInput = z.infer<typeof contentBodySchema>;
