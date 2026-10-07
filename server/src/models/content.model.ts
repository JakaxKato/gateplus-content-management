import { Schema, model, type HydratedDocument } from 'mongoose';
import { CONTENT_STATUSES, GENRES, type ContentStatus, type Genre } from '../constants.js';

export interface ContentDoc {
  title: string;
  description: string;
  genre: Genre;
  thumbnail_url: string | null;
  status: ContentStatus;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

const contentSchema = new Schema<ContentDoc>(
  {
    title: {
      type: String,
      required: [true, 'Judul wajib diisi'],
      trim: true,
      maxlength: [150, 'Judul maksimal 150 karakter'],
    },
    description: {
      type: String,
      required: [true, 'Deskripsi wajib diisi'],
      trim: true,
      maxlength: [5000, 'Deskripsi maksimal 5000 karakter'],
    },
    genre: {
      type: String,
      required: [true, 'Genre wajib diisi'],
      enum: { values: [...GENRES], message: 'Genre "{VALUE}" tidak valid' },
    },
    thumbnail_url: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: { values: [...CONTENT_STATUSES], message: 'Status "{VALUE}" tidak valid' },
      default: 'draft',
    },
    published_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  },
);

contentSchema.index({ status: 1, genre: 1, created_at: -1 });

contentSchema.pre('validate', function enforcePublishedAtInvariant() {
  if (this.status === 'draft') {
    this.published_at = null;
  } else if (!this.published_at) {
    this.invalidate('published_at', 'Tanggal publish wajib diisi jika status published');
  }
});

contentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const json = ret as unknown as Record<string, unknown>;
    json.id = String(json._id);
    delete json._id;
    return json;
  },
});

export type ContentDocument = HydratedDocument<ContentDoc>;

export const ContentModel = model<ContentDoc>('Content', contentSchema);
