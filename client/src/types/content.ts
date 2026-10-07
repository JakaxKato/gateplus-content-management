export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Sci-Fi',
  'Thriller',
] as const;

export type Genre = (typeof GENRES)[number];

export const CONTENT_STATUSES = ['draft', 'published'] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export interface Content {
  id: string;
  title: string;
  description: string;
  genre: Genre;
  thumbnail_url: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: FieldError[];
}
