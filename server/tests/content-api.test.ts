import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import type { ContentStatus, Genre } from '../src/constants.js';
import { ContentModel } from '../src/models/content.model.js';
import { UserModel } from '../src/models/user.model.js';

const app = createApp();

const ADMIN_EMAIL = 'admin@test.local';
const ADMIN_PASSWORD = 'test-password-123';

interface ContentFixture {
  title: string;
  description: string;
  genre: Genre;
  status: ContentStatus;
  thumbnail_url?: string | null;
  published_at?: Date | null;
}

const baseContent: ContentFixture = {
  title: 'Content Uji',
  description: 'Deskripsi content untuk kebutuhan pengujian otomatis.',
  genre: 'Action',
  status: 'draft',
};

let token = '';

async function login(): Promise<string> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

  return response.body.data.token as string;
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Promise.all([ContentModel.deleteMany({}), UserModel.deleteMany({})]);
  await UserModel.create({
    name: 'Admin Test',
    email: ADMIN_EMAIL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 4),
    role: 'admin',
  });
  token = await login();
});

describe('GET /api/contents', () => {
  it('mengembalikan daftar content dengan meta pagination dan tanpa _id', async () => {
    await ContentModel.create([
      { ...baseContent, title: 'Content Pertama' },
      { ...baseContent, title: 'Content Kedua' },
    ]);

    const response = await request(app).get('/api/contents');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta).toMatchObject({ page: 1, limit: 9, total: 2, total_pages: 1 });
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).not.toHaveProperty('_id');
    expect(response.body.data[0]).not.toHaveProperty('__v');
  });

  it('memfilter berdasarkan search judul (case-insensitive) dan genre', async () => {
    await ContentModel.create([
      { ...baseContent, title: 'Neon Jakarta 2099', genre: 'Sci-Fi' },
      { ...baseContent, title: 'Misteri Rumah Tua', genre: 'Horror' },
    ]);

    const searchResponse = await request(app).get('/api/contents').query({ search: 'neon' });
    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.meta.total).toBe(1);
    expect(searchResponse.body.data[0].title).toBe('Neon Jakarta 2099');

    const genreResponse = await request(app).get('/api/contents').query({ genre: 'Horror' });
    expect(genreResponse.body.meta.total).toBe(1);
    expect(genreResponse.body.data[0].genre).toBe('Horror');
  });

  it('membatasi jumlah item per halaman lewat query limit', async () => {
    await ContentModel.create(
      Array.from({ length: 5 }, (_, index) => ({ ...baseContent, title: `Content ${index + 1}` })),
    );

    const response = await request(app).get('/api/contents').query({ page: 2, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta).toMatchObject({ page: 2, limit: 2, total: 5, total_pages: 3 });
  });

  it('menolak genre yang tidak dikenal dengan 400', async () => {
    const response = await request(app).get('/api/contents').query({ genre: 'GenreAneh' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors[0].field).toBe('genre');
  });
});

describe('GET /api/contents/:id', () => {
  it('mengembalikan detail content', async () => {
    const content = await ContentModel.create({ ...baseContent, title: 'Detail Uji' });

    const response = await request(app).get(`/api/contents/${content.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Detail Uji');
  });

  it('mengembalikan 404 untuk id valid yang tidak ada', async () => {
    const response = await request(app).get('/api/contents/000000000000000000000000');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('mengembalikan 400 untuk format id yang salah', async () => {
    const response = await request(app).get('/api/contents/bukan-object-id');

    expect(response.status).toBe(400);
  });
});

describe('POST /api/contents', () => {
  it('menolak request tanpa token dengan 401', async () => {
    const response = await request(app).post('/api/contents').send(baseContent);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('menolak token yang tidak valid dengan 401', async () => {
    const response = await request(app)
      .post('/api/contents')
      .set('Authorization', 'Bearer token-palsu')
      .send(baseContent);

    expect(response.status).toBe(401);
  });

  it('mengembalikan error validasi per field ketika body kosong', async () => {
    const response = await request(app).post('/api/contents').set('Authorization', `Bearer ${token}`).send({});

    expect(response.status).toBe(400);
    const fields = response.body.errors.map((error: { field: string }) => error.field);
    expect(fields).toEqual(expect.arrayContaining(['title', 'description', 'genre', 'status']));
  });

  it('menolak status published tanpa published_at', async () => {
    const response = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...baseContent, status: 'published' });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].field).toBe('published_at');
  });

  it('menolak thumbnail URL yang bukan http/https', async () => {
    const response = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...baseContent, thumbnail_url: 'bukan-url' });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].field).toBe('thumbnail_url');
  });

  it('membuat content draft baru dengan status 201', async () => {
    const response = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...baseContent, title: 'Content Baru', thumbnail_url: '' });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      title: 'Content Baru',
      status: 'draft',
      thumbnail_url: null,
      published_at: null,
    });

    const stored = await ContentModel.countDocuments();
    expect(stored).toBe(1);
  });

  it('membuat content published dengan tanggal dari string ISO date', async () => {
    const response = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...baseContent, status: 'published', published_at: '2026-10-01' });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('published');
    expect(new Date(response.body.data.published_at).toISOString()).toBe('2026-10-01T00:00:00.000Z');
  });
});

describe('PUT /api/contents/:id', () => {
  it('memperbarui content dan mengosongkan published_at ketika status draft', async () => {
    const content = await ContentModel.create({
      ...baseContent,
      status: 'published',
      published_at: new Date('2026-09-01T00:00:00.000Z'),
    });

    const response = await request(app)
      .put(`/api/contents/${content.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...baseContent, title: 'Judul Setelah Update', status: 'draft' });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Judul Setelah Update');
    expect(response.body.data.published_at).toBeNull();
  });

  it('mengembalikan 404 untuk content yang tidak ada', async () => {
    const response = await request(app)
      .put('/api/contents/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send(baseContent);

    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/contents/:id', () => {
  it('menghapus content dan mengembalikan 404 saat diakses lagi', async () => {
    const content = await ContentModel.create(baseContent);

    const deleteResponse = await request(app)
      .delete(`/api/contents/${content.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app).get(`/api/contents/${content.id}`);
    expect(getResponse.status).toBe(404);
  });

  it('menolak penghapusan tanpa token', async () => {
    const content = await ContentModel.create(baseContent);

    const response = await request(app).delete(`/api/contents/${content.id}`);
    expect(response.status).toBe(401);
  });
});

describe('POST /api/auth/login', () => {
  it('menolak password yang salah dengan 401', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: 'password-salah' });

    expect(response.status).toBe(401);
  });

  it('mengembalikan token dan data user tanpa password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeTypeOf('string');
    expect(response.body.data.user.email).toBe(ADMIN_EMAIL);
    expect(response.body.data.user).not.toHaveProperty('password');
  });

  it('menolak email dengan format tidak valid', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bukan-email', password: ADMIN_PASSWORD });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].field).toBe('email');
  });
});

describe('GET /api/health', () => {
  it('mengembalikan status ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('ok');
  });
});
