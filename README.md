# Gateplus Content Management

[![CI](https://github.com/JakaxKato/gateplus-content-management/actions/workflows/ci.yml/badge.svg)](https://github.com/JakaxKato/gateplus-content-management/actions/workflows/ci.yml)

Aplikasi content management dengan dua sisi: **halaman publik** untuk melihat content dan **panel admin** untuk membuat, mengubah, dan menghapus content. Seluruh data mengalir lewat REST API ke database MongoDB yang persistent.

---

**Nama:** Jaka Kelana Wijaya
**Repository:** https://github.com/JakaxKato/gateplus-content-management
**Live Demo:** N/A (belum di-deploy; cara menjalankan lokal ada di bawah)
**Catatan:** Kredensial demo admin ada di bagian [Demo Credentials](#demo-credentials).

---

## Deskripsi Aplikasi

Gateplus Content Management dibangun untuk memenuhi alur utuh **User → Frontend → API/Backend → Database → API Response → Frontend**:

- **Halaman publik** (`/contents`): daftar content dengan thumbnail (atau placeholder), genre, deskripsi singkat, status, tanggal publish, pencarian berdasarkan judul, filter genre, pagination, serta halaman detail content. Tersedia state loading (skeleton), empty, error, dan tombol retry. Halaman publik **hanya menampilkan content berstatus `published`**.
- **Panel admin** (`/admin`): login sederhana, list seluruh content (termasuk draft) dengan tabel di desktop dan card di mobile, create, update, dan delete dengan dialog konfirmasi. Validasi berjalan di frontend **dan** backend.
- **REST API** (`/api`): CRUD content dengan status code yang sesuai, format response konsisten, error handling terpusat, dan server-side validation.

### Screenshots

| Halaman publik | Detail content |
| --- | --- |
| ![Daftar content](docs/screenshots/public-list.png) | ![Detail content](docs/screenshots/public-detail.png) |

| Panel admin | Validasi form |
| --- | --- |
| ![Panel admin](docs/screenshots/admin-list.png) | ![Validasi form](docs/screenshots/form-validation.png) |

Tampilan mobile dan tablet (panel admin memakai card di layar kecil, tabel hanya di desktop):

| Mobile (390px) | Tablet (820px) |
| --- | --- |
| ![Mobile admin](docs/screenshots/mobile-admin.png) | ![Tablet admin](docs/screenshots/tablet-admin.png) |

| Tablet — halaman publik |
| --- |
| ![Tablet publik](docs/screenshots/tablet-public.png) |

## Tech Stack

**MERN + TypeScript** di kedua sisi:

| Bagian | Teknologi |
| --- | --- |
| Database | MongoDB 7 (via Docker Compose) + Mongoose 9 |
| Backend | Node.js 24, Express 5, TypeScript, Zod (validasi), JWT + bcryptjs (auth), helmet + express-rate-limit |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, React Router 7 |
| Data fetching | TanStack Query v5 (server state), fetch API bawaan |
| Form | React Hook Form + Zod resolver |
| Testing & quality | Vitest + Supertest (32 API test), ESLint, `tsc --noEmit`, GitHub Actions CI |

## Cara Menjalankan Project

**Prasyarat:** Node.js 20+ (dites di Node 24, lihat `.nvmrc`), npm, dan Docker (untuk MongoDB). Bisa juga memakai MongoDB Atlas dengan mengubah `MONGODB_URI`.

```bash
# 0. (opsional) gunakan versi Node yang disarankan
nvm use

# 1. Install seluruh dependency (root, server, client)
npm run install:all

# 2. Siapkan environment variable server
#    Windows:  copy server\.env.example server\.env
#    macOS/Linux:
cp server/.env.example server/.env
#    Lalu isi JWT_SECRET dengan string acak yang panjang.

# 3. Jalankan MongoDB
npm run db:up

# 4. Isi database dengan data awal (16 content + 1 akun admin)
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
npm test            # 32 automated test API (butuh MongoDB berjalan)
npm run build       # Build production server + client
npm run check       # lint + typecheck + test + build sekaligus
npm run db:down     # Hentikan container MongoDB
```

> **Troubleshooting:** bila mesin Anda menetapkan `NODE_ENV=production` secara global, `npm install` akan melewati devDependencies (ESLint/Vitest/TypeScript). Gunakan `npm install --include=dev` di folder `server/` dan `client/`. Script `npm run install:all` sudah memakai flag tersebut.

## Deploy (Opsional)

Panduan singkat untuk mengisi kolom Live Demo. Urutannya: **database → backend → frontend**.

### 1. Database — MongoDB Atlas (cluster M0 gratis)

1. Buat cluster M0, lalu buat database user.
2. Network Access → izinkan `0.0.0.0/0` (Render memakai IP keluar yang dinamis).
3. Salin connection string `mongodb+srv://…/gateplus`.

### 2. Backend — Render (Web Service)

| Pengaturan | Nilai |
| --- | --- |
| Root Directory | `server` |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Environment variables: `NODE_ENV=production`, `MONGODB_URI=<connection string Atlas>`, `JWT_SECRET=<string acak panjang>`, `JWT_EXPIRES_IN=7d`, `CLIENT_ORIGIN=https://<app>.vercel.app` (boleh beberapa origin dipisah koma, mis. untuk preview deployment).

> **Penting:** `--include=dev` pada build command tidak boleh dihilangkan. Render menyetel `NODE_ENV=production`, dan pada kondisi itu `npm install` melewati devDependencies — TypeScript tidak terpasang sehingga `npm run build` gagal.

> Layanan free tier Render tidur setelah ~15 menit idle, sehingga request pertama bisa terasa lambat.

### 3. Frontend — Vercel

| Pengaturan | Nilai |
| --- | --- |
| Root Directory | `client` (framework terdeteksi: Vite) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment variable | `VITE_API_URL=https://<service>.onrender.com/api` |

`VITE_API_URL` harus URL penuh beserta akhiran `/api` karena di produksi tidak ada proxy Vite. Nilai ini di-bake saat build, jadi setiap kali diubah perlu redeploy.

Reload halaman pada route SPA (`/contents/:id`, `/admin/...`) ditangani oleh `client/vercel.json` yang me-rewrite semua path ke `index.html`.

### 4. Seed database produksi

Jalankan sekali dari lokal dengan mengarahkan `MONGODB_URI` ke Atlas. Variabel dari shell menang atas `.env` (dotenv tidak menimpa nilai yang sudah ada), jadi `.env` lokal tidak perlu diubah:

```powershell
cd server
$env:MONGODB_URI="mongodb+srv://…/gateplus"
npm run seed
```

### 5. Checklist setelah deploy

- `https://<service>.onrender.com/api/health` mengembalikan `{"success":true,"data":{"status":"ok","database":"connected"}}`.
- Halaman publik di Vercel menampilkan content (artinya `VITE_API_URL` dan `CLIENT_ORIGIN`/CORS benar).
- Login admin berhasil, lalu create → edit → delete berjalan.
- Perbarui kolom **Live Demo** di bagian atas README ini.


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

**Setup:** `npm run db:up` menjalankan MongoDB 7 lewat `docker-compose.yml` dengan volume bernama `mongo_data`, sehingga data tetap ada setelah container restart atau aplikasi di-restart.

**Seed:** `npm run seed` melakukan reset data (menghapus `contents` & `users`) lalu mengisi:

- **16 content** — 12 `published` (dengan `published_at`) dan 4 `draft`; 2 di antaranya tanpa thumbnail untuk menguji placeholder.
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

Index `{ status, genre, created_at }` disiapkan untuk mempercepat filter + pengurutan yang paling sering dipakai. Tidak ada migration tool khusus karena MongoDB schemaless — struktur divalidasi di level aplikasi (Mongoose + zod), dan data awal disiapkan lewat `npm run seed`.

## API Endpoints

Base URL: `http://localhost:5000/api`. Koleksi request siap pakai (REST Client/Postman) ada di [`docs/api.http`](docs/api.http).

| Method | Endpoint | Auth | Deskripsi |
| --- | --- | --- | --- |
| GET | `/health` | – | Status server + koneksi database |
| GET | `/contents` | opsional | List content. Anonim: hanya `published`. Dengan token admin: semua status |
| GET | `/contents/:id` | opsional | Detail content. Draft hanya bisa dibaca admin |
| POST | `/contents` | Bearer token | Membuat content baru |
| PUT | `/contents/:id` | Bearer token | Memperbarui content (payload lengkap) |
| DELETE | `/contents/:id` | Bearer token | Menghapus content |
| POST | `/auth/login` | – | Login admin, mengembalikan JWT (dibatasi 10 percobaan / 15 menit) |
| GET | `/auth/me` | Bearer token | Profil user yang sedang login |

**Query params `GET /contents`:**

| Param | Nilai | Default |
| --- | --- | --- |
| `search` | teks bebas (dicocokkan ke judul, case-insensitive) | – |
| `genre` | salah satu genre yang terdaftar | – |
| `status` | `published` untuk semua pengunjung; `draft` hanya untuk admin | anonim: `published` |
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

**Status code yang dipakai:** `200` (sukses), `201` (dibuat), `400` (validasi/format id/JSON rusak), `401` (token tidak ada/tidak valid, kredensial salah), `403` (filter status khusus admin oleh pengunjung anonim), `404` (data/endpoint tidak ditemukan, termasuk draft yang diakses anonim), `409` (duplikat), `429` (rate limit login), `500` (error tak terduga). Error terpusat ditangani satu middleware, termasuk `CastError`, `ValidationError`, dan duplicate key MongoDB.

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

## Aturan Visibilitas Content (draft vs published)

Endpoint publik **tidak pernah** mengembalikan draft:

- `GET /contents` tanpa token otomatis dibatasi ke `status=published`; meminta `?status=draft` sebagai anonim menghasilkan `403`.
- `GET /contents/:id` untuk content draft mengembalikan `404` ke anonim (bukan `403`, supaya keberadaan draft tidak bocor).
- Admin yang menyertakan token JWT melihat semua status — dipakai oleh panel admin dan halaman edit.
- Halaman publik mengirim `status=published` secara eksplisit, sehingga walaupun admin sedang login di browser yang sama, halaman publik tetap hanya menampilkan content published.

Badge **Status** dan **Published date** tetap ditampilkan di kartu halaman publik (sesuai brief), hanya saja nilainya selalu `Published` karena draft memang tidak pernah dikirim ke halaman publik. Filter status tersedia di panel admin, tempat filter itu relevan.

**Trade-off:** tampilan "halaman publik semua status" memang lebih mudah untuk mendemokan variasi draft, tetapi berisiko dilihat sebagai kebocoran data. Karena brief menekankan alur data yang benar, aturan "publik = published" dipilih sebagai perilaku default; variasi draft tetap ditunjukkan lewat panel admin dan screenshot.

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
│   │   ├── middlewares/           # validate (zod), auth (require + optional), error handler
│   │   ├── models/                # skema Mongoose, invariant, transform toJSON
│   │   ├── routes/                # definisi route
│   │   ├── schemas/               # skema validasi zod
│   │   ├── utils/                 # AppError, response helper, jwt
│   │   ├── app.ts                 # perakitan Express app (helmet, cors, routes)
│   │   ├── server.ts              # bootstrap + graceful shutdown
│   │   └── seed.ts                # data awal
│   └── tests/                     # automated test API (Vitest + Supertest)
├── docs/
│   ├── api.http                   # koleksi request API (REST Client/Postman)
│   └── screenshots/
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
| `published_at` wajib & valid jika status `published` | ✔ | ✔ (zod + hook model) |
| Error per field dari server dipetakan ke field form | ✔ | — |

**Konsistensi `published_at`:**

- Status `draft` boleh (dan selalu disimpan sebagai) `null` — controller dan hook `pre('validate')` di model menetapkan `null` walaupun client mengirim tanggal.
- Status `published` wajib punya tanggal valid; pelanggaran ditolak `400` dengan error pada field `published_at`.
- Aturan ini ditegakkan di tiga lapis: skema zod (kontrak API), hook model (berlaku juga untuk penulisan langsung seperti seed), dan validasi form di frontend.

## Autentikasi

- Login admin (`POST /auth/login`) memverifikasi password dengan bcrypt dan mengembalikan JWT (masa berlaku dari `JWT_EXPIRES_IN`).
- Endpoint `POST`, `PUT`, `DELETE` wajib menyertakan `Authorization: Bearer <token>`; `GET` boleh diakses tanpa token.
- Middleware `optionalAuth` dipakai pada `GET`: token valid → diperlakukan sebagai admin, tanpa token → anonim, token ada tapi tidak valid → `401` (supaya frontend membersihkan sesi yang kedaluwarsa).
- `POST /auth/login` dibatasi 10 percobaan per 15 menit (express-rate-limit, dinonaktifkan otomatis saat `NODE_ENV=test`).
- Response `GET /auth/me` dan `POST /auth/login` tidak pernah menyertakan field `password` (dihapus oleh `toJSON` transform pada model User).

## Testing & Code Quality

- **32 automated test API** (`npm test` di folder `server/`) memakai Vitest + Supertest dengan database terpisah (`gateplus_test`). Cakupannya: list & pagination, detail, search, filter genre dan status, aturan visibilitas draft (403/404 untuk anonim), create/update/delete, validasi per field, thumbnail URL tidak valid, published tanpa `published_at`, invariant model, unauthorized mutation, content tidak ditemukan, konsistensi format response, login, dan health check.
- **ESLint** (flat config) untuk kedua package, **`tsc --noEmit`** untuk typecheck, dan **build production** keduanya.
- **CI GitHub Actions** (`.github/workflows/ci.yml`) menjalankan lint, typecheck, test (dengan service container MongoDB), dan build untuk setiap push/PR — statusnya hijau dan terlihat di badge paling atas README.

## Technical Decisions & Trade-offs

1. **TypeScript di dua sisi.** Kontrak data antara frontend dan backend jadi eksplisit dan kesalahan tipe tertangkap saat build. Trade-off: ada langkah build dan versi TypeScript dipin ke `6.x` karena `typescript-eslint` belum mendukung TS 7.
2. **Dua lapis validasi (zod di server, skema terpisah di client).** Server tetap satu-satunya penentu kebenaran; client hanya mempercepat feedback. Trade-off: aturan validasi terduplikasi karena tidak ada paket `shared/` — membuat workspace tambahan dianggap over-engineering untuk scope ini.
3. **Kontrak response seragam + error handler terpusat.** Frontend cukup menangani satu bentuk response, dan error per field (`errors[]`) langsung dipetakan ke form. Trade-off: pesan error harus disiplin dijaga agar tidak ada endpoint yang menyimpang.
4. **Auth hanya untuk endpoint mutasi, dengan `optionalAuth` pada `GET`.** Halaman publik tetap bisa diakses tanpa login, sedangkan draft hanya terbaca oleh admin lewat endpoint yang sama. Trade-off: satu endpoint melayani dua konteks (publik vs admin), sehingga perilakunya perlu didokumentasikan dengan jelas (lihat bagian Aturan Visibilitas Content).
5. **Draft tidak pernah diekspos ke publik.** `GET /contents` anonim dibatasi `status=published`, draft hanya terlihat admin, dan detail draft mengembalikan `404` untuk anonim. Trade-off: badge status di halaman publik selalu `Published` sehingga variasi draft tidak terlihat di sana; variasi draft diperlihatkan di panel admin. Alasan lengkap ada di bagian [Aturan Visibilitas Content](#aturan-visibilitas-content-draft-vs-published).
6. **TanStack Query untuk server state** menangani loading/error state, cache, dan invalidasi setelah mutasi secara konsisten (termasuk pagination tanpa flicker lewat `keepPreviousData`). Trade-off: satu dependency tambahan.
7. **Pencarian memakai regex case-insensitive dengan escaping** (aman dari injeksi regex) dan sort `created_at desc`. Trade-off: tidak memakai text index/Atlas Search; pada data besar perlu diganti.
8. **PUT (bukan PATCH)** karena form admin mengirim payload lengkap, sehingga tidak perlu logika merge parsial. Trade-off: update sebagian (partial update) belum didukung.
9. **`toJSON` transform di model** memastikan frontend selalu menerima `id` (bukan `_id`) dan tidak pernah menerima `__v` maupun `password`. Trade-off: bentuk dokumen mentah di server dan bentuk JSON di API berbeda tipis, perlu disadari saat debug.
10. **Delete berupa hard delete dengan dialog konfirmasi.** Trade-off: tanpa soft delete/audit trail; untuk kebutuhan internal yang butuh pemulihan data, soft delete lebih tepat.
11. **Komponen UI ditulis sendiri di atas Tailwind** (tanpa UI kit). Trade-off: lebih banyak kode komponen dasar, tetapi bundle kecil dan gaya konsisten.
12. **Helmet + rate limit login.** Header keamanan standar dipasang dan login dibatasi per IP. Trade-off: rate limit berbasis memory store (cukup untuk single instance, perlu Redis bila di-scale horizontal).
13. **State filter disimpan sebagai state komponen**, belum disinkronkan ke URL query. Trade-off: filter tidak bisa di-share lewat link, tetapi implementasi jauh lebih sederhana.

### Trade-off MongoDB dibanding database relational

- **Yang menguntungkan di kasus ini:** dokumen content tidak punya relasi (tidak ada join genre/user), sehingga bentuk JSON-native MongoDB langsung bisa dikirim sebagai response API tanpa mapping tabel. Skema yang fleksibel juga cocok karena field seperti `published_at` boleh `null` dan thumbnail opsional.
- **Yang hilang dibanding relational:** tidak ada foreign key & constraint tingkat database, jadi konsistensi seperti "published wajib punya `published_at`" harus dijaga di aplikasi (zod + hook Mongoose) — pada MySQL/PostgreSQL ini bisa ditegakkan dengan `CHECK`/`NOT NULL`. Selain itu, transaksi lintas dokumen dan query agregasi kompleks lebih mudah diekspresikan di SQL.
- **Kapan akan pindah:** jika content mulai punya relasi banyak (kategori hierarkis, penulis, riwayat revisi, audit) dan butuh constraint kuat di level database, PostgreSQL lebih tepat. Karena semua akses data sudah dibungkus di layer model/controller, migrasi hanya menyentuh `server/src/models` dan `controllers`, bukan frontend.

## Yang Sengaja Tidak Dikerjakan (di luar scope)

- Upload file thumbnail — brief meminta **thumbnail URL**, bukan storage; agar tidak menambah kompleksitas penyimpanan.
- Payment, realtime/WebSocket, role & permission kompleks, microservices, dan video streaming (secara eksplisit tidak perlu).
- **PATCH** partial update — brief menulis "PUT **atau** PATCH", dan form admin selalu mengirim payload lengkap, jadi PUT dipilih agar tidak ada logika merge parsial.
- Soft delete & audit trail — tidak diminta; hard delete dengan konfirmasi sudah memenuhi kebutuhan admin.
- Internationalization (i18n) — UI dan dokumentasi cukup satu bahasa (Indonesia) untuk konteks test ini.

## Known Limitations

- Token JWT disimpan di `localStorage`, belum memakai cookie `httpOnly` + refresh token.
- Pencarian hanya pada judul (sesuai brief), belum full-text search pada deskripsi.
- Pagination berbasis offset; untuk data sangat besar lebih baik cursor-based.
- Setelah create/update/delete, UI menunggu refetch (belum optimistic update).
- Filter & pagination belum tersimpan di URL, jadi belum bisa di-share lewat link.
- Rate limit login memakai memory store (belum Redis) dan belum ada rate limit untuk endpoint mutasi.
- Belum ada automated E2E test di browser; alur UI diverifikasi manual (bukti ada di `docs/screenshots/`).
- Live demo belum tersedia (belum di-deploy), sehingga reviewer perlu menjalankan secara lokal.

## Demo Credentials

```
Email:    admin@gateplus.id
Password: admin123
```

Akun ini dibuat oleh `npm run seed`. Halaman publik tidak memerlukan login.

## Status Verifikasi

Terakhir diverifikasi di lingkungan pengembangan (Node 24, MongoDB 7 lewat Docker):

| Pemeriksaan | Perintah | Hasil |
| --- | --- | --- |
| Lint | `npm run lint` | lolos (server + client) |
| Typecheck | `npm run typecheck` | lolos (server + client) |
| Automated test | `npm test` | 32 test lolos |
| Production build | `npm run build` | lolos (server + client) |
| CI | GitHub Actions | hijau (badge di atas) |
| Alur manual | browser | list publik (hanya published), detail, search, filter genre, pagination, login admin, create (draft & published), edit, delete + konfirmasi, responsive mobile/tablet/desktop |

---

## Jawaban Pertanyaan

### 1. Mengapa memilih tech stack tersebut?

Karena brief menekankan pemahaman alur **frontend → API → database**, saya memilih stack yang paling saya kuasai dan paling langsung menggambarkan alur itu (MERN), bukan stack yang paling banyak komponennya.

- **MongoDB** cocok untuk content karena bentuknya JSON-native sehingga dokumen bisa langsung dipetakan ke response API dan object di frontend tanpa mapping berlebih. Skema content juga masih sederhana, jadi fleksibilitas document store belum menjadi risiko konsistensi. Perbandingan detailnya ada di bagian [Trade-off MongoDB dibanding database relational](#trade-off-mongodb-dibanding-database-relational).
- **Express 5** ringan dan sudah menangani error dari handler `async` secara otomatis, sehingga kode controller tetap bersih.
- **React + Vite + TypeScript** memberi feedback cepat saat development, sementara TypeScript membuat kontrak data frontend–backend terlihat jelas (tipe `Content`, `PaginationMeta`, `ApiSuccess`/`ApiErrorBody`).
- **Tailwind CSS** membuat layout responsive (mobile/tablet/desktop) konsisten tanpa menulis CSS terpisah per komponen.
- **Zod** dipilih karena aturan validasi yang sama bisa dibaca di kedua sisi tanpa mengubah struktur kode, dan pesan errornya mudah dipetakan ke field form.

### 2. Bagaimana struktur aplikasinya?

Monorepo sederhana dengan dua aplikasi yang diorkestrasi dari root:

- `server/` — Express dengan pemisahan berlapis: **routes → middleware (auth/validasi) → controller → model**. Semua aturan validasi ada di `schemas/`, error ditangani satu middleware terpusat, dan seluruh response dibentuk lewat satu helper agar konsisten.
- `client/` — React dengan pembagian **pages / components / hooks / lib / context**. Semua akses API melewati satu `apiRequest()` di `lib/api.ts`, sehingga penanganan token, error, dan format response hanya ada di satu tempat. Data fetching dan mutasi memakai TanStack Query, sedangkan state UI (form, filter) tetap lokal.
- Di root ada script `dev`, `seed`, `lint`, `test`, dan `check` supaya reviewer bisa menjalankan semuanya tanpa menghafal perintah masing-masing folder.

Alur datanya: **komponen React → hook (TanStack Query) → `apiRequest` (menyisipkan token bila ada) → Express route → middleware `optionalAuth`/`requireAuth` → middleware validasi zod → controller → Mongoose → MongoDB → response `{success, data, meta}` → cache query → komponen**. Setelah create/update/delete, TanStack Query meng-invalidate cache `['contents']` sehingga daftar dan detail otomatis ter-refetch tanpa reload halaman.

### 3. Apa keputusan teknis paling penting?

**Kontrak error dan validasi yang seragam.** Server mengembalikan bentuk yang selalu sama (`success`, `message`, `errors[{field,message}]`), dan frontend memetakan `errors[]` itu langsung ke field form lewat `setError`. Dampaknya: aturan validasi tetap satu sumber kebenaran di backend, frontend tidak perlu logika penerjemahan error khusus per endpoint, dan pengguna melihat pesan yang jelas di field yang tepat — baik validasi ditolak di browser maupun di server.

Keputusan penting lain: **aturan `published_at` diperlakukan sebagai invariant** (wajib dan valid bila `published`; otomatis `null` bila `draft`, ditegakkan di zod + hook model), **draft tidak pernah diekspos ke endpoint publik**, serta **`toJSON` transform pada model** sehingga API tidak pernah membocorkan `_id`, `__v`, atau `password`.

### 4. Apa limitation solusi?

Yang paling perlu disadari: token disimpan di `localStorage` tanpa refresh token, pencarian terbatas pada judul dan memakai regex (belum text index), pagination masih offset-based, belum ada optimistic update maupun automated E2E test, filter belum bisa di-share lewat URL, rate limit login masih memory store, dan live demo belum tersedia. Daftar lengkapnya ada di bagian [Known Limitations](#known-limitations).

### 5. Jika mendapat 1 hari tambahan, apa yang diperbaiki?

Prioritas berdasarkan risiko dan nilai:

1. **Deploy nyata + live demo URL** (client di Vercel, server di Render/Fly.io, database di MongoDB Atlas) supaya reviewer bisa mencoba tanpa setup lokal.
2. **E2E test (Playwright)** untuk alur admin (login → create → update → delete) dan menjalankannya di CI bersama test API.
3. **Auth yang lebih aman**: refresh token + cookie `httpOnly`, rate limit untuk endpoint mutasi (bukan hanya login), dan audit log perubahan content.
4. **Sinkronisasi filter/pagination ke URL** agar state bisa di-share dan tombol back bekerja sesuai ekspektasi, lalu menambahkan pratinjau halaman publik di panel admin.
5. **Optimistic update** agar interaksi terasa instan, plus perbaikan aksesibilitas lanjutan (navigasi keyboard pada pagination, `role`/`aria` yang lebih kaya pada tabel).

### 6. Jika API/database production error atau lambat, apa langkah debugging pertama?

Urutannya: **tentukan lokasi masalahnya dulu, jangan langsung menebak kode.**

1. **Cek liveness**: `GET /api/health` dan log server (morgan). Dari sini bisa langsung dibedakan apakah prosesnya mati/restarting, atau koneksi database yang bermasalah (`database: disconnected`), atau aplikasinya hidup tapi lambat.
2. **Lihat pola error**: apakah semua endpoint terdampak (indikasi database/network/infra) atau hanya satu endpoint (indikasi query/kode). Perhatikan distribusi status code — `5xx` tak terduga vs `400/404` yang berarti input, `429` yang berarti rate limit, serta apakah error mulai muncul tepat setelah deploy (→ curigai perubahan terakhir, siapkan rollback).
3. **Ukur dan repro**: reproduksi endpoint yang bermasalah dengan `curl` sambil mengukur waktunya, lalu cek durasi query di MongoDB (`explain()`, `db.currentOp()`, slow query log). Kalau query memindai banyak dokumen, langkah pertamanya adalah menambah/memperbaiki index (mis. index `{status, genre, created_at}`) atau membatasi `limit`.
4. **Cek resource**: connection pool MongoDB, CPU/memory proses Node, dan spike traffic. Mitigasi cepat: naikkan pool/timeout secara hati-hati, tambahkan cache atau rate limit, dan lakukan scale sementara.
5. **Baru perbaiki akar masalah**, lalu tambahkan monitoring/alerting dan test regresi supaya kasus yang sama tidak terulang.

Untuk error yang dilaporkan pengguna, saya juga akan menanyakan jam kejadian, endpoint, dan payload-nya supaya bisa dicocokkan dengan log pada rentang waktu tersebut.
