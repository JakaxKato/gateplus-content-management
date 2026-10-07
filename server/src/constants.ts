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
