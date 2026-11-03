# Nongkrong App 🗓️

Web-app berbasis tautan untuk menemukan waktu luang bersama sebuah kelompok, **tanpa login**. Buat acara, bagikan tautan ke grup chat, semua orang menandai jam luangnya, lalu aplikasi menampilkan waktu terbaik secara otomatis.

> Dokumen perencanaan lengkap ada di [`docs/PRD.md`](docs/PRD.md).

## Fitur MVP

- **Grid matriks waktu** yang responsif untuk sentuhan (ketuk, tahan, geser)
- **Heatmap**: makin banyak yang luang, warna makin pekat
- **Top Picks**: 3 opsi waktu terbaik secara otomatis
- **Acara Saya**: riwayat tautan acara tersimpan di browser (`localStorage`)

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Front-end & API | Next.js (React) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Supabase / Neon) |
| Validasi | Zod |
| Pengujian | Vitest, Playwright |
| Hosting | Vercel |

> Stack final dikunci pada Milestone 0. Sesuaikan tabel ini jika ada perubahan.

## Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) versi 20 atau lebih baru
- npm (atau pnpm/yarn, sesuai kesepakatan tim)
- Git
- Akses ke database PostgreSQL (minta connection string dari Rian)

### Instalasi

```bash
# 1. Clone repo
git clone https://github.com/<username-atau-org>/nongkrong-app.git
cd nongkrong-app

# 2. Pasang dependensi
npm install

# 3. Salin file environment lalu isi nilainya
cp .env.example .env

# 4. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Untuk menguji tampilan ponsel, buka DevTools lalu aktifkan *device toolbar* (Ctrl/Cmd + Shift + M), atau akses lewat IP jaringan lokal dari ponsel.

### Variabel Environment

Contoh isi `.env` (jangan pernah commit file `.env` asli):

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Script yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Build untuk produksi |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | Memeriksa gaya kode (ESLint) |
| `npm run test` | Menjalankan unit test |
| `npm run test:e2e` | Menjalankan uji end-to-end |

## Struktur Folder (usulan)

```
nongkrong-app/
├── docs/               # PRD & dokumentasi keputusan
├── src/
│   ├── app/            # Halaman & route API (Next.js)
│   ├── components/     # Komponen UI (grid, heatmap, dll.)
│   ├── lib/            # Util, algoritma Top Picks, akses DB
│   └── styles/
├── tests/              # Unit & E2E test
├── .env.example
└── README.md
```

## Tim

| Peran | Nama |
|---|---|
| Front-End | Elga |
| Back-End | Lea |
| Database & Arsitektur | Rian |
| UI/UX & QA | Nadya |

Ketua tim: _isi nama_

## Alur Kontribusi

Baca [`CONTRIBUTING.md`](CONTRIBUTING.md) sebelum mengirim perubahan.

## Roadmap

Lihat Bagian 13 di [`docs/PRD.md`](docs/PRD.md) untuk rencana setelah MVP, dan tab **Projects** di GitHub untuk status tugas terkini.

## Lisensi

_Tentukan lisensi (mis. MIT) atau tulis "Hak cipta dilindungi" bila proyek bersifat privat._
