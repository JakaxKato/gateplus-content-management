# Gateplus Content Management

Aplikasi content management dengan dua sisi: **halaman publik** untuk melihat content dan **panel admin** untuk membuat, mengubah, dan menghapus content. Seluruh data mengalir lewat REST API ke database MongoDB yang persistent.

---

**Nama:** [Nama Kandidat]
**Repository:** [URL repository]
**Live Demo:** N/A
**Catatan:** Kredensial demo admin ada di bagian [Demo Credentials](#demo-credentials).

---

## Deskripsi Aplikasi

Gateplus Content Management dibangun untuk memenuhi alur utuh **User → Frontend → API/Backend → Database → API Response → Frontend**:

- **Halaman publik** (`/contents`): daftar content dengan thumbnail, genre, deskripsi singkat, status, tanggal publish, pencarian berdasarkan judul, filter genre/status, pagination, serta halaman detail content. Tersedia state loading (skeleton), empty, dan error.
- **Panel admin** (`/admin`): login sederhana, list content, create, update, dan delete dengan dialog konfirmasi. Validasi berjalan di frontend **dan** backend.
- **REST API** (`/api`): CRUD content dengan status code yang sesuai, format response konsisten, error handling terpusat, dan server-side validation.

### Screenshots

| Halaman publik | Detail content |
| --- | --- |
| ![Daftar content](docs/screenshots/public-list.png) | ![Detail content](docs/screenshots/public-detail.png) |

| Panel admin | Validasi form |
| --- | --- |
| ![Panel admin](docs/screenshots/admin-list.png) | ![Validasi form](docs/screenshots/form-validation.png) |

Tampilan mobile (panel admin menampilkan card, bukan tabel):

![Mobile admin](docs/screenshots/mobile-admin.png)

## Tech Stack

**MERN + TypeScript** di kedua sisi:

| Bagian | Teknologi |
| --- | --- |
| Database | MongoDB 7 (via Docker Compose) + Mongoose 9 |
| Backend | Node.js 24, Express 5, TypeScript, Zod (validasi), JWT + bcryptjs (auth) |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, React Router 7 |
| Data fetching | TanStack Query v5 (server state), fetch API bawaan |
| Form | React Hook Form + Zod resolver |
| Testing & quality | Vitest + Supertest (22 API test), ESLint, `tsc --noEmit`, GitHub Actions CI |

## Cara Menjalankan Project

**Prasyarat:** Node.js 20+ (dites di Node 24), npm, dan Docker (untuk MongoDB). Bisa juga memakai MongoDB Atlas dengan mengubah `MONGODB_URI`.

```bash
# 1. Install seluruh dependency (root, server, client)
npm run install:all

# 2. Siapkan environment variable server
#    Windows:  copy server\.env.example server\.env
#    macOS/Linux:
cp server/.env.example server/.env
#    Lalu isi JWT_SECRET dengan string acak yang panjang.

# 3. Jalankan MongoDB
npm run db:up

# 4. Isi database dengan data awal (12 content + 1 akun admin)
npm run seed

# 5. Jalankan server API dan frontend sekaligus
npm run dev
```

Setelah itu:

| Layanan | URL |
| --- | --- |
| Halaman publik | http://localhost:5173/contents |
| Panel admin | http://localhost:5173/admin/login |
| REST API | http://localhost:5000/api/health |

Script lain yang tersedia:

```bash
npm run lint        # ESLint untuk server + client
npm run typecheck   # TypeScript check untuk server + client
npm test            # 22 automated test API (butuh MongoDB berjalan)
npm run build       # Build production server + client
npm run check       # lint + typecheck + test + build sekaligus
npm run db:down     # Hentikan container MongoDB
```

> **Troubleshooting:** bila mesin Anda menetapkan `NODE_ENV=production` secara global, `npm install` akan melewati devDependencies (ESLint/Vitest/TypeScript). Gunakan `npm install --include=dev` di folder `server/` dan `client/`.

## Environment Variables

Semua variabel server ada di `server/.env` (contoh lengkap: `server/.env.example`). File `.env` **tidak di-commit** — hanya `.env.example` yang masuk repository.

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `PORT` | `5000` | Port server API |
| `NODE_ENV` | `development` | `development` / `production` / `test` |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/gateplus` | Koneksi MongoDB (lokal atau Atlas) |
| `JWT_SECRET` | – (wajib) | Secret penandatangan JWT, minimal 16 karakter |
| `JWT_EXPIRES_IN` | `7d` | Masa berlaku token |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Origin yang diizinkan CORS (bisa dipisah koma) |

Frontend memakai `VITE_API_URL` (default `/api`, diteruskan proxy Vite ke port 5000). Salin `client/.env.example` menjadi `client/.env` hanya bila ingin menunjuk API di host lain.

## Database

**Setup:** `npm run db:up` menjalankan MongoDB 7 lewat `docker-compose.yml` dengan volume bernama `mongo_data`, sehingga data tetap ada setelah container restart.

**Seed:** `npm run seed` melakukan reset data (menghapus `contents` & `users`) lalu mengisi:

- **12 content** — 8 `published` (dengan `published_at`) dan 4 `draft`; 2 di antaranya tanpa thumbnail untuk menguji placeholder.
- **1 akun admin** untuk login.

**Koleksi `contents`** — field sesuai kebutuhan:

| Field | Tipe | Catatan |
| --- | --- | --- |
| `id` | ObjectId | Diekspos sebagai string `id` di response |
| `title` | string | Wajib, maksimal 150 karakter |
| `description` | string | Wajib, maksimal 5000 karakter |
| `genre` | string | Wajib, salah satu dari 8 genre (enum di model & validasi) |
| `thumbnail_url` | string \| null | Opsional, harus URL `http/https` bila diisi |
| `status` | string | `draft` \| `published`, default `draft` |
| `published_at` | Date \| null | Wajib (dan tidak boleh null) bila status `published` |
| `created_at`, `updated_at` | Date | Otomatis dari Mongoose timestamps |

Index `{ status, genre, created_at }` disiapkan untuk mempercepat filter + pengurutan yang paling sering dipakai.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Deskripsi |
| --- | --- | --- | --- |
| GET | `/health` | – | Status server + koneksi database |
| GET | `/contents` | – | List content (search, filter, pagination) |
| GET | `/contents/:id` | – | Detail satu content |
| POST | `/contents` | Bearer token | Membuat content baru |
| PUT | `/contents/:id` | Bearer token | Memperbarui content (payload lengkap) |
| DELETE | `/contents/:id` | Bearer token | Menghapus content |
| POST | `/auth/login` | – | Login admin, mengembalikan JWT |
| GET | `/auth/me` | Bearer token | Profil user yang sedang login |

**Query params `GET /contents`:**

| Param | Nilai | Default |
| --- | --- | --- |
| `search` | teks bebas (dicocokkan ke judul, case-insensitive) | – |
| `genre` | salah satu genre yang terdaftar | – |
| `status` | `draft` \| `published` | – |
| `page` | integer ≥ 1 | `1` |
| `limit` | integer 1–50 | `9` |

**Format response sukses:**

```json
{
  "success": true,
  "message": "Content berhasil dibuat.",
  "data": { "id": "…", "title": "…", "status": "draft", "…": "…" },
  "meta": { "page": 1, "limit": 9, "total": 12, "total_pages": 2 }
}
```

**Format response error:**

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [{ "field": "published_at", "message": "Tanggal publish wajib diisi jika status published" }]
}
```

**Status code yang dipakai:** `200` (sukses), `201` (dibuat), `400` (validasi/format id/JSON rusak), `401` (token tidak ada/tidak valid, kredensial salah), `404` (data/endpoint tidak ditemukan), `409` (duplikat), `500` (error tak terduga). Error terpusat ditangani satu middleware, termasuk `CastError`, `ValidationError`, dan duplicate key MongoDB.

**Contoh pemakaian:**

```bash
# Login
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gateplus.id","password":"admin123"}'

# Membuat content (ganti <TOKEN>)
curl -s -X POST http://localhost:5000/api/contents \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Judul Baru","description":"Deskripsi content.","genre":"Action","thumbnail_url":"","status":"published","published_at":"2026-10-06"}'

# List dengan search + filter
curl -s "http://localhost:5000/api/contents?search=neon&genre=Sci-Fi&page=1&limit=9"
```

## Struktur Project

```
.
├── client/                        # Frontend React + Vite
│   └── src/
│       ├── components/            # ui/ (button, modal, badge, pagination, …)
│       │                          # layout/, content/, admin/
│       ├── context/               # auth & toast (context + provider terpisah)
│       ├── hooks/                 # data fetching, mutasi, debounce, auth, toast
│       ├── lib/                   # api client, query client, format, skema form
│       ├── pages/                 # public/ dan admin/
│       └── types/                 # tipe domain + kontrak response API
├── server/                        # Backend Express + Mongoose
│   ├── src/
│   │   ├── config/                # pembacaan & validasi environment
│   │   ├── controllers/           # handler HTTP
│   │   ├── db/                    # koneksi MongoDB
│   │   ├── middlewares/           # validate (zod), auth (JWT), error handler
│   │   ├── models/                # skema Mongoose + transform toJSON
│   │   ├── routes/                # definisi route
│   │   ├── schemas/               # skema validasi zod
│   │   ├── utils/                 # AppError, response helper, jwt
│   │   ├── app.ts                 # perakitan Express app
│   │   ├── server.ts              # bootstrap + graceful shutdown
│   │   └── seed.ts                # data awal
│   └── tests/                     # automated test API (Vitest + Supertest)
├── docs/screenshots/
├── .github/workflows/ci.yml
├── docker-compose.yml
└── package.json                   # script orkestrasi (install, db, seed, dev, check)
```

## Validasi

Aturan validasi dijalankan di **dua tempat**: zod di backend sebagai sumber kebenaran, dan skema terpisah di frontend agar pengguna mendapat feedback sebelum request dikirim.

| Aturan | Frontend | Backend |
| --- | --- | --- |
| `title` wajib, maks 150 karakter | ✔ | ✔ (zod + Mongoose) |
| `description` wajib, maks 5000 karakter | ✔ | ✔ (zod + Mongoose) |
| `genre` wajib & harus dari daftar genre | ✔ | ✔ (zod enum + enum model) |
| `status` harus `draft` atau `published` | ✔ | ✔ |
| `thumbnail_url` valid (http/https) jika diisi | ✔ | ✔ |
| `published_at` wajib & valid jika status `published` | ✔ | ✔ |
| Error per field dari server dipetakan ke field form | ✔ | — |

Isi ulang `published_at` saat status `draft` akan disimpan sebagai `null`, sehingga tidak ada content draft yang punya tanggal publish.

## Testing & Code Quality

- **22 automated test API** (`npm test` di folder `server/`) memakai Vitest + Supertest dengan database terpisah (`gateplus_test`): memverifikasi happy path CRUD, search/filter/pagination, seluruh aturan validasi, autentikasi (401/berhasil), format error, dan 400/404 untuk input/id yang salah.
- **ESLint** (flat config) untuk kedua package, **`tsc --noEmit`** untuk typecheck, dan **build production** keduanya.
- **CI GitHub Actions** (`.github/workflows/ci.yml`) menjalankan lint, typecheck, test (dengan service container MongoDB), dan build untuk setiap push/PR.

## Technical Decisions & Trade-offs

1. **TypeScript di dua sisi.** Kontrak data antara frontend dan backend jadi eksplisit dan kesalahan tipe tertangkap saat build. Trade-off: ada langkah build dan versi TypeScript dipin ke `6.x` karena `typescript-eslint` belum mendukung TS 7.
2. **Dua lapis validasi (zod di server, skema terpisah di client).** Server tetap satu-satunya penentu kebenaran; client hanya mempercepat feedback. Trade-off: aturan validasi terduplikasi karena tidak ada paket `shared/` — membuat workspace tambahan dianggap over-engineering untuk scope ini.
3. **Kontrak response seragam + error handler terpusat.** Frontend cukup menangani satu bentuk response, dan error per field (`errors[]`) langsung dipetakan ke form. Trade-off: pesan error harus disiplin dijaga agar tidak ada endpoint yang menyimpang.
4. **Auth hanya untuk endpoint mutasi.** `GET` tetap publik supaya halaman publik tidak butuh login, sedangkan perubahan data wajib memakai JWT. Trade-off: token disimpan di `localStorage` (rentan XSS) dan belum ada refresh token; untuk produksi lebih baik `httpOnly` cookie + proteksi CSRF.
5. **Halaman publik menampilkan semua status dengan badge**, karena brief meminta field *status* dan *tanggal publish* tampil di daftar. Di produksi, tinggal mengirim `status=published` sebagai default di endpoint publik. Trade-off: draft ikut terlihat di demo.
6. **TanStack Query untuk server state** menerima loading/error state, cache, dan invalidasi setelah mutasi secara konsisten (termasuk pagination tanpa flicker lewat `keepPreviousData`). Trade-off: satu dependency tambahan.
7. **Pencarian memakai regex case-insensitive dengan escaping** (aman dari injeksi regex) dan sort `created_at desc`. Trade-off: tidak memakai text index/Atlas Search; pada data besar perlu diganti.
8. **PUT (bukan PATCH)** karena form admin mengirim payload lengkap, sehingga tidak perlu logika merge parsial. Trade-off: update sebagian (partial update) belum didukung.
9. **`toJSON` transform di model** memastikan frontend selalu menerima `id` (bukan `_id`) dan tidak pernah menerima `__v` maupun `password`. Trade-off: bentuk dokumen mentah di server dan bentuk JSON di API berbeda tipis, perlu disadari saat debug.
10. **Delete berupa hard delete dengan dialog konfirmasi.** Trade-off: tanpa soft delete/audit trail; untuk kebutuhan internal yang butuh pemulihan data, soft delete lebih tepat.
11. **Komponen UI ditulis sendiri di atas Tailwind** (tanpa UI kit). Trade-off: lebih banyak kode komponen dasar, tetapi bundle kecil dan gaya konsisten.
12. **State filter disimpan sebagai state komponen**, belum disinkronkan ke URL query. Trade-off: filter tidak bisa di-share lewat link, tetapi implementasi jauh lebih sederhana.

## Known Limitations

- Belum ada hardening produksi: rate limiting, `helmet`, dan penanganan brute force login.
- Token JWT disimpan di `localStorage`, belum memakai cookie `httpOnly` + refresh token.
- Pencarian hanya pada judul (sesuai brief), belum full-text search pada deskripsi.
- Thumbnail hanya berupa URL — belum ada upload file (juga di luar scope brief).
- Pagination berbasis offset; untuk data sangat besar lebih baik cursor-based.
- Setelah create/update/delete, UI menunggu refetch (tanpa optimistic update).
- Filter tidak tersimpan di URL, dan panel admin belum punya halaman pratinjau tersendiri.
- Belum ada automated E2E test di browser; pengujian UI dilakukan manual (hasilnya ada di `docs/screenshots/`).

## Demo Credentials

```
Email:    admin@gateplus.id
Password: admin123
```

Akun ini dibuat oleh `npm run seed`. Halaman publik tidak memerlukan login.

---

## Jawaban Pertanyaan

### 1. Mengapa memilih tech stack tersebut?

Karena brief menekankan pemahaman alur **frontend → API → database**, saya memilih stack yang paling saya kuasai dan paling langsung menggambarkan alur itu (MERN), bukan stack yang paling banyak komponennya.

- **MongoDB** cocok untuk content karena bentuknya JSON-native sehingga dokumen bisa langsung dipetakan ke response API dan object di frontend tanpa mapping berlebih. Skema content juga masih sederhana, jadi fleksibilitas document store belum menjadi risiko konsistensi.
- **Express 5** ringan dan sudah menangani error dari handler `async` secara otomatis, sehingga kode controller tetap bersih.
- **React + Vite + TypeScript** memberi feedback cepat saat development, sementara TypeScript membuat kontrak data frontend–backend terlihat jelas (tipe `Content`, `PaginationMeta`, `ApiSuccess`/`ApiErrorBody`).
- **Tailwind CSS** membuat layout responsive (mobile/tablet/desktop) konsisten tanpa menulis CSS terpisah per komponen.
- **Zod** dipilih karena validasi yang sama bisa dibaca di kedua sisi tanpa mengubah struktur kode, dan pesan errornya mudah dipetakan ke field form.

### 2. Bagaimana struktur aplikasinya?

Monorepo sederhana dengan dua aplikasi yang diorkestrasi dari root:

- `server/` — Express dengan pemisahan berlapis: **routes → middleware (validasi/auth) → controller → model**. Semua aturan validasi ada di `schemas/`, error ditangani satu middleware terpusat, dan seluruh response dibentuk lewat satu helper agar konsisten.
- `client/` — React dengan pembagian **pages / components / hooks / lib / context**. Semua akses API melewati satu `apiRequest()` di `lib/api.ts`, sehingga penanganan token, error, dan format response hanya ada di satu tempat. Data fetching dan mutasi memakai TanStack Query, sedangkan state UI (form, filter) tetap lokal.
- Di root ada script `dev`, `seed`, `lint`, `test`, dan `check` supaya reviewer bisa menjalankan semuanya tanpa menghafal perintah masing-masing folder.

Alur datanya: **komponen React → hook (TanStack Query) → `apiRequest` → Express route → middleware validasi zod → controller → Mongoose → MongoDB → response `{success, data, meta}` → cache query → komponen**.

### 3. Apa keputusan teknis paling penting?

**Kontrak error dan validasi yang seragam.** Server mengembalikan bentuk yang selalu sama (`success`, `message`, `errors[{field,message}]`), dan frontend memetakan `errors[]` itu langsung ke field form lewat `setError`. Dampaknya: aturan validation tetap satu sumber kebenaran di backend, frontend tidak perlu logika penerjemahan error khusus per endpoint, dan pengguna melihat pesan yang jelas di field yang tepat — baik validasi ditolak di browser maupun di server.

Keputusan penting lain: **aturan `published_at` diperlakukan sebagai invariant** (wajib dan valid bila `published`; otomatis `null` bila `draft`) sehingga tidak ada data yang saling bertentangan, serta **`toJSON` transform pada model** sehingga API tidak pernah membocorkan `_id`, `__v`, atau `password`.

### 4. Apa limitation solusi?

Yang paling perlu disadari: belum ada hardening produksi (rate limit, `helmet`, proteksi brute force), token disimpan di `localStorage` tanpa refresh token, pencarian terbatas pada judul dan memakai regex (belum text index), pagination masih offset-based, tidak ada optimistic update maupun automated E2E test, dan filter belum bisa di-share lewat URL. Daftar lengkapnya ada di bagian [Known Limitations](#known-limitations).

### 5. Jika mendapat 1 hari tambahan, apa yang diperbaiki?

Prioritas berdasarkan risiko dan nilai:

1. **E2E test (Playwright)** untuk alur admin (login → create → update → delete) dan menjalankannya di CI bersama test API.
2. **Hardening & auth yang lebih aman**: `helmet`, rate limit pada `/auth/login` dan endpoint mutasi, refresh token + cookie `httpOnly`, serta audit log perubahan content.
3. **Sinkronisasi filter/pagination ke URL** agar state bisa di-share dan tombol back bekerja sesuai ekspektasi, lalu menambahkan preview halaman publik di panel admin (pratinjau sebelum publish).
4. **Optimistic update + skeleton per bagian** agar interaksi terasa instan, serta perbaikan aksesibilitas lanjutan (focus trap pada modal, `aria-live` untuk toast).
5. **Deploy nyata** (client di Vercel, server di Render/Fly.io, database di MongoDB Atlas) supaya ada live demo URL, termasuk pengecekan CORS dan konfigurasi environment produksi.

### 6. Jika API/database production error atau lambat, apa langkah debugging pertama?

Urutannya: **tentukan lokasi masalahnya dulu, jangan langsung menebak kode.**

1. **Cek liveness**: `GET /api/health` dan log server (morgan). Dari sini bisa langsung dibedakan apakah prosesnya mati/restarting, atau koneksi database yang bermasalah (`database: disconnected`), atau aplikasinya hidup tapi lambat.
2. **Lihat pola error**: apakah semua endpoint terdampak (indikasi database/network/infra) atau hanya satu endpoint (indikasi query/kode). Perhatikan distribusi status code — `5xx` tak terduga vs `400/404` yang berarti input, serta apakah error mulai muncul tepat setelah deploy (→ curigai perubahan terakhir, siapkan rollback).
3. **Ukur dan repro**: reproduksi endpoint yang bermasalah dengan `curl` sambil mengukur waktunya, lalu cek durasi query di MongoDB (`explain()`, `db.currentOp()`, slow query log). Kalau query memindai banyak dokumen, langkah pertamanya adalah menambah/memperbaiki index (mis. index `{status, genre, created_at}`) atau membatasi `limit`.
4. **Cek resource**: connection pool MongoDB, CPU/memory proses Node, dan spike traffic. Mitigasi cepat: naikkan pool/timeout secara hati-hati, tambahkan cache atau rate limit, dan lakukan scale sementara.
5. **Baru perbaiki akar masalah**, lalu tambahkan monitoring/alerting dan test regresi supaya kasus yang sama tidak terulang.

Untuk error yang dilaporkan pengguna, saya juga akan menanyakan jam kejadian, endpoint, dan payload-nya supaya bisa dicocokkan dengan log pada rentang waktu tersebut.
