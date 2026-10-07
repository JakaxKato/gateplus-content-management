import bcrypt from 'bcryptjs';
import type { ContentStatus, Genre } from './constants.js';
import { connectDatabase, disconnectDatabase } from './db/connect.js';
import { ContentModel } from './models/content.model.js';
import { UserModel } from './models/user.model.js';

const ADMIN_NAME = 'Admin Gateplus';
const ADMIN_EMAIL = 'admin@gateplus.id';
const ADMIN_PASSWORD = 'admin123';

interface SeedContent {
  title: string;
  description: string;
  genre: Genre;
  thumbnail_url: string | null;
  status: ContentStatus;
  published_at: Date | null;
}

const seedContents: SeedContent[] = [
  {
    title: 'Petualangan Nusantara: Jejak Sang Penjelajah',
    description:
      'Seorang penjelajah muda menelusuri jalur rempah kuno dari Sumatera hingga Maluku. Di tengah cuaca ekstrem dan teka-teki peta warisan keluarganya, ia menemukan rahasia yang mengubah cara pandangnya tentang sejarah.',
    genre: 'Adventure',
    thumbnail_url: 'https://picsum.photos/seed/nusantara/800/450',
    status: 'published',
    published_at: new Date('2026-09-28T00:00:00.000Z'),
  },
  {
    title: 'Neon Jakarta 2099',
    description:
      'Di Jakarta tahun 2099, seorang detektif siber memburu peretas yang mencuri memori warga kota. Penyelidikan itu membawanya pada konspirasi besar yang menyangkut masa lalunya sendiri.',
    genre: 'Sci-Fi',
    thumbnail_url: 'https://picsum.photos/seed/neonjakarta/800/450',
    status: 'published',
    published_at: new Date('2026-09-21T00:00:00.000Z'),
  },
  {
    title: 'Misteri Rumah Tua Bandung',
    description:
      'Tiga mahasiswa mendokumentasikan rumah kosong peninggalan zaman kolonial untuk tugas akhir mereka. Satu per satu dari mereka mulai kehilangan jejak, dan rekaman kamera menunjukkan sosok yang tidak pernah mereka lihat sebelumnya.',
    genre: 'Horror',
    thumbnail_url: 'https://picsum.photos/seed/rumahtua/800/450',
    status: 'published',
    published_at: new Date('2026-09-12T00:00:00.000Z'),
  },
  {
    title: 'Cinta di Ujung Senja',
    description:
      'Dua orang asing bertemu setiap senja di sebuah dermaga kecil. Masing-masing membawa luka yang belum selesai, dan pertemuan singkat mereka perlahan mengubah arah hidup keduanya.',
    genre: 'Drama',
    thumbnail_url: null,
    status: 'published',
    published_at: new Date('2026-08-30T00:00:00.000Z'),
  },
  {
    title: 'Operasi Fajar: Misi Terakhir',
    description:
      'Tim khusus diberi satu misi penyelamatan terakhir sebelum fajar. Badai, waktu yang terus berjalan, dan pengkhianatan di dalam tim membuat operasi ini jauh dari kata sederhana.',
    genre: 'Action',
    thumbnail_url: 'https://picsum.photos/seed/operasifajar/800/450',
    status: 'published',
    published_at: new Date('2026-08-18T00:00:00.000Z'),
  },
  {
    title: 'Komplotan Receh',
    description:
      'Empat sahabat yang selalu gagal membangun usaha bersama justru terlibat dalam rencana perampokan. Sayangnya, rencana itu sama kacaunya dengan usaha-usaha mereka sebelumnya.',
    genre: 'Comedy',
    thumbnail_url: 'https://picsum.photos/seed/komplotanreceh/800/450',
    status: 'published',
    published_at: new Date('2026-08-05T00:00:00.000Z'),
  },
  {
    title: 'Bayangan di Balik Cermin',
    description:
      'Seorang psikiater mulai melihat kesamaan mencurigakan antara cerita pasien-pasiennya dan kejadian yang ia alami sendiri. Semakin dalam ia menyelidiki, semakin tipis batas antara ingatan dan halusinasi.',
    genre: 'Thriller',
    thumbnail_url: 'https://picsum.photos/seed/cermin/800/450',
    status: 'published',
    published_at: new Date('2026-07-22T00:00:00.000Z'),
  },
  {
    title: 'Kerajaan Awan: Legenda Naga',
    description:
      'Di negeri di atas awan, seorang gadis penjaga kuil dipilih oleh naga terakhir untuk memulihkan keseimbangan alam yang rusak. Perjalanannya mengungkap kebenaran yang disembunyikan kerajaannya selama berabad-abad.',
    genre: 'Fantasy',
    thumbnail_url: 'https://picsum.photos/seed/kerajaanawan/800/450',
    status: 'published',
    published_at: new Date('2026-07-10T00:00:00.000Z'),
  },
  {
    title: 'Rahasia Pulau Terlarang',
    description:
      'Sebuah ekspedisi ilmiah menemukan pulau yang tidak ada di peta modern. Apa yang mereka temukan di sana berpotensi mengubah sejarah peradaban, sekaligus mengancam keselamatan tim.',
    genre: 'Adventure',
    thumbnail_url: 'https://picsum.photos/seed/pulaulerlarang/800/450',
    status: 'draft',
    published_at: null,
  },
  {
    title: 'Perburuan di Kota Tua',
    description:
      'Seorang kurir berkecepatan tinggi terjebak dalam perang antar geng di gang-gang Kota Tua. Satu paket yang salah antar membuat nyawanya menjadi taruhan sepanjang malam.',
    genre: 'Action',
    thumbnail_url: 'https://picsum.photos/seed/kotatua/800/450',
    status: 'draft',
    published_at: null,
  },
  {
    title: 'Komedi Kantor: Rapat Terakhir',
    description:
      'Rapat akhir tahun berubah menjadi kekacauan ketika seluruh berkas presentasi tertukar. Rahasia-rahasia kantor mulai terbongkar, satu per satu, di depan semua orang.',
    genre: 'Comedy',
    thumbnail_url: null,
    status: 'draft',
    published_at: null,
  },
  {
    title: 'Eksperimen Laboratorium X',
    description:
      'Kelompok riset yang mengembangkan sumber energi baru menyadari eksperimen mereka membuka celah ke tempat yang seharusnya tidak pernah tersentuh. Menutup celah itu jauh lebih sulit daripada membukanya.',
    genre: 'Sci-Fi',
    thumbnail_url: 'https://picsum.photos/seed/laboratoriumx/800/450',
    status: 'draft',
    published_at: null,
  },
];

async function seed(): Promise<void> {
  console.log('Menghubungkan ke database...');
  await connectDatabase();

  console.log('Menghapus data lama (contents & users)...');
  await Promise.all([ContentModel.deleteMany({}), UserModel.deleteMany({})]);

  console.log(`Membuat ${seedContents.length} data content...`);
  await ContentModel.insertMany(seedContents);

  console.log('Membuat akun admin...');
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await UserModel.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: passwordHash,
    role: 'admin',
  });

  const publishedCount = seedContents.filter((item) => item.status === 'published').length;
  const draftCount = seedContents.length - publishedCount;

  console.log('');
  console.log('Seed selesai:');
  console.log(`  - ${seedContents.length} content (${publishedCount} published, ${draftCount} draft)`);
  console.log('  - 1 user admin');
  console.log(`Login admin -> email: ${ADMIN_EMAIL} | password: ${ADMIN_PASSWORD}`);

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Seed gagal:', error);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
