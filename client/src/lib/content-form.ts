import { z } from 'zod';
import { CONTENT_STATUSES, GENRES, type Content, type ContentStatus, type Genre } from '../types/content';
import { toDateInputValue, toIsoFromDateInput } from './format';

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const contentFormSchema = z
  .object({
    title: z
      .string({ required_error: 'Judul wajib diisi' })
      .trim()
      .min(1, 'Judul wajib diisi')
      .max(150, 'Judul maksimal 150 karakter'),
    description: z
      .string({ required_error: 'Deskripsi wajib diisi' })
      .trim()
      .min(1, 'Deskripsi wajib diisi')
      .max(5000, 'Deskripsi maksimal 5000 karakter'),
    genre: z.enum(GENRES, {
      required_error: 'Genre wajib dipilih',
      invalid_type_error: 'Genre tidak valid',
    }),
    thumbnail_url: z
      .string({ required_error: 'Thumbnail URL tidak boleh kosong' })
      .trim()
      .max(2048, 'Thumbnail URL maksimal 2048 karakter')
      .refine((value) => value === '' || isHttpUrl(value), 'Thumbnail URL harus berupa URL http/https yang valid'),
    status: z.enum(CONTENT_STATUSES, {
      required_error: 'Status wajib dipilih',
      invalid_type_error: 'Status harus draft atau published',
    }),
    published_at: z.string().trim().optional().default(''),
  })
  .superRefine((values, ctx) => {
    if (values.published_at && Number.isNaN(new Date(values.published_at).getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['published_at'],
        message: 'Tanggal publish tidak valid',
      });
    }

    if (values.status === 'published' && !values.published_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['published_at'],
        message: 'Tanggal publish wajib diisi jika status published',
      });
    }
  });

export type ContentFormInput = z.input<typeof contentFormSchema>;
export type ContentFormValues = z.output<typeof contentFormSchema>;

export interface ContentPayload {
  title: string;
  description: string;
  genre: Genre;
  thumbnail_url: string | null;
  status: ContentStatus;
  published_at: string | null;
}

export function toContentPayload(values: ContentFormValues): ContentPayload {
  return {
    title: values.title,
    description: values.description,
    genre: values.genre,
    thumbnail_url: values.thumbnail_url === '' ? null : values.thumbnail_url,
    status: values.status,
    published_at: values.status === 'published' ? toIsoFromDateInput(values.published_at) : null,
  };
}

export function toFormValues(content: Content): ContentFormValues {
  return {
    title: content.title,
    description: content.description,
    genre: content.genre,
    thumbnail_url: content.thumbnail_url ?? '',
    status: content.status,
    published_at: toDateInputValue(content.published_at),
  };
}

export const emptyFormValues: ContentFormValues = {
  title: '',
  description: '',
  genre: 'Action',
  thumbnail_url: '',
  status: 'draft',
  published_at: '',
};
