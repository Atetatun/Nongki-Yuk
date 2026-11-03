# PRD: Web-App Jadwal Nongkrong (v2.0)

| | |
|---|---|
| **Status** | Draft untuk review tim |
| **Tim** | Elga (Front-End), Lea (Back-End), Rian (Database & Arsitektur), Nadya (UI/UX & QA) |
| **Dokumen sumber** | Dokumen Perencanaan Proyek v1 |
| **Ringkasan** | Web-app berbasis tautan, tanpa login, untuk menemukan waktu luang bersama sebuah kelompok dalam hitungan detik |

---

## 0. Analisis Dokumen v1

### Yang sudah bagus (dipertahankan)
- Konsep produk jelas dan fokus: tanpa login, berbagi lewat tautan, mobile-first.
- Batasan MVP tegas (tanpa akun, tanpa integrasi kalender, tanpa native app).
- Risiko *Lost Link* sudah teridentifikasi beserta solusi `localStorage`.
- Pembagian peran jelas dan ada target keberhasilan yang berani (< 60 detik).

### Celah yang diperbaiki di v2

| # | Celah di v1 | Dampak | Perbaikan di v2 |
|---|---|---|---|
| 1 | Teknologi masih "pilih salah satu" | Tim bisa berdebat/terlambat mulai | Stack direkomendasikan & dikunci (Bagian 8) |
| 2 | Metrik sukses hanya satu (60 detik) dan tidak terukur | Tidak tahu MVP berhasil atau tidak | KPI terukur + cara pengukuran (Bagian 3) |
| 3 | Partisipan "anonim" tapi tidak ada cara mengedit jawaban sendiri | Salah klik = tidak bisa memperbaiki; nama kembar bentrok | Token edit per partisipan di perangkat (Bagian 5.3) |
| 4 | Lost Link hanya untuk Inisiator; partisipan juga bisa kehilangan tautan | Pengalaman terputus | Riwayat untuk semua peran + tombol salin/bagikan WhatsApp (Bagian 5.5) |
| 5 | Zona waktu hanya disebut sebagai edge case | Hasil bisa salah untuk kelompok lintas zona (WIB/WITA/WIT) | Keputusan eksplisit: simpan UTC, tampilkan zona acara (Bagian 6.3) |
| 6 | "Real-time" disebut tanpa mekanisme | Ambigu, bisa over-engineering | Polling 5 detik di MVP, WebSocket ditunda (Bagian 6.4) |
| 7 | Granularitas slot, batas hari, batas peserta tidak ditentukan | Algoritma & UI tidak bisa dirancang | Parameter konkret (Bagian 5.1) |
| 8 | Algoritma Top Picks tidak didefinisikan (seri? blok berurutan?) | Hasil membingungkan | Aturan skor & tie-break (Bagian 5.4) |
| 9 | Tidak ada keamanan/privasi/rate limiting | Rentan spam & penyalahgunaan | Persyaratan non-fungsional (Bagian 7) |
| 10 | Tidak ada timeline, definition of done, atau kontrak API | Sulit paralel kerja; QA baru masuk di akhir | Milestone, API contract, acceptance criteria (Bagian 9-11) |
| 11 | Aksesibilitas heatmap (buta warna) & kondisi kosong/error tidak dibahas | UX tidak inklusif | Spesifikasi UI states & aksesibilitas (Bagian 5.2) |
| 12 | Cron job "hapus acara lewat" tanpa definisi | Data bisa terhapus terlalu cepat/lambat | Kebijakan retensi jelas (Bagian 6.5) |

---

## 1. Latar Belakang & Masalah

Mencari waktu nongkrong di grup chat biasanya berupa puluhan pesan ("Kamu bisa kapan?", "Aku Jumat malam", "Eh Jumat aku lembur"). Aplikasi penjadwalan yang ada umumnya mewajibkan akun, terlalu kompleks, atau berorientasi profesional/kantor.

**Masalah inti:** kelompok teman butuh cara paling ringan untuk menemukan waktu yang cocok, tanpa pendaftaran, langsung dari chat.

## 2. Tujuan & Non-Tujuan

### Tujuan
1. Inisiator membuat acara dan membagikan tautan dalam **< 30 detik**.
2. Partisipan mengisi ketersediaan dalam **< 45 detik** di ponsel, tanpa panduan.
3. Kelompok melihat waktu terbaik secara otomatis, tanpa hitung manual.

### Non-Tujuan (MVP)
- Akun, login, kata sandi.
- Sinkronisasi Google Calendar/Outlook.
- Aplikasi native Android/iOS.
- Pemilihan lokasi, voting tempat, atau chat di dalam aplikasi.
- Notifikasi push/email.

## 3. Target Pengguna & Metrik Keberhasilan

### Persona
- **Inisiator ("Si A"):** anggota grup yang mengambil inisiatif; ingin cepat dan tidak ribet.
- **Partisipan ("Si B, C, ..."):** teman yang membuka tautan dari WhatsApp/Telegram, hampir selalu di ponsel, sering tidak sabar.

### KPI MVP

| Metrik | Target | Cara ukur |
|---|---|---|
| Waktu membuat acara sampai tautan siap | < 30 dtk (median) | Uji usability 5+ orang + event timestamp |
| Waktu partisipan menyimpan ketersediaan | < 45 dtk (median) | Uji usability + event timestamp |
| Tingkat penyelesaian partisipan (buka tautan → simpan) | ≥ 70% | Event `link_opened` vs `availability_saved` |
| Acara dengan ≥ 3 partisipan | ≥ 50% | Query database |
| Error JavaScript tak tertangani | < 1% sesi | Pemantauan error (mis. Sentry free tier) |
| LCP halaman acara di jaringan 4G | < 2,5 dtk | Lighthouse / WebPageTest |

> Catatan: analitik dibuat tanpa data pribadi (hanya event anonim).

## 4. Alur Pengguna

### 4.1 Inisiator
1. Buka halaman utama → isi **nama acara** → pilih **rentang tanggal** (maks. 14 hari) dan **jam awal/akhir** per hari (default 08:00-23:00).
2. Tekan **Buat Tautan** → diarahkan ke halaman acara; tautan otomatis tersalin / tersedia tombol **Salin** dan **Bagikan ke WhatsApp**.
3. Isi ketersediaan sendiri, lalu pantau hasil.

### 4.2 Partisipan
1. Buka tautan → lihat nama acara & siapa saja yang sudah mengisi.
2. Masukkan **nama panggilan** → geser/ketuk blok waktu luang → **Simpan**.
3. Langsung melihat heatmap dan Top Picks.
4. Dapat kembali dan **mengedit** jawaban dari perangkat yang sama.

### 4.3 Peninjau
Siapa pun yang punya tautan melihat heatmap dan Top Picks dengan pembaruan otomatis.

## 5. Spesifikasi Fitur

### 5.1 Pembuatan Acara
**Parameter:**
- Nama acara: 1-60 karakter.
- Rentang tanggal: mulai hari ini, maks. 14 hari.
- Rentang jam: per acara (bukan per hari), kelipatan jam penuh.
- **Granularitas slot: 30 menit.**
- Zona waktu acara: otomatis dari perangkat Inisiator, dapat diubah (WIB/WITA/WIT atau IANA timezone).
- Batas partisipan: 30 per acara (dapat dinaikkan kemudian).

**Acceptance criteria:**
- Given form valid, When tekan "Buat Tautan", Then URL unik dibuat dan halaman acara terbuka < 1 dtk.
- Given nama kosong atau rentang tidak valid, Then tampil pesan error inline tanpa menghapus isian.
- Given tombol ditekan dua kali, Then hanya satu acara dibuat (idempotent / tombol dinonaktifkan saat loading).

### 5.2 Grid Matriks Waktu & Heatmap

**Mode isi (partisipan):**
- Ketuk satu sel = toggle; tahan lalu geser = pilih banyak sel (*drag-select*). Mode drag mengikuti niat pertama (jika sel pertama "dipilih", seluruh geseran memilih; jika "dihapus", seluruh geseran menghapus).
- Tombol bantu: **Pilih semua hari ini**, **Hapus semua**.
- Scroll halaman tidak boleh terganggu: drag-select aktif setelah *long-press* singkat (~150 ms) atau di area sel saja; gunakan `touch-action` yang tepat.

**Mode hasil (heatmap):**
- Skala warna 5 tingkat berdasarkan rasio (peserta luang / total peserta).
- **Aksesibilitas:** selain warna, tampilkan angka kecil (mis. "4") di sel, pola/kontras yang lolos WCAG AA, dan tidak mengandalkan warna merah-hijau.
- Ketuk sel hasil → panel kecil menampilkan **siapa yang bisa dan siapa yang tidak**.
- Sel dengan semua peserta luang diberi penanda khusus (mis. bingkai tebal).

**State UI yang wajib ada:** kosong (belum ada yang mengisi), memuat (skeleton), error jaringan (dengan tombol coba lagi), tersimpan (konfirmasi singkat), acara kedaluwarsa/tidak ditemukan.

**Acceptance criteria:**
- Drag-select 50 sel berjalan ≥ 50 fps di ponsel kelas menengah.
- Heatmap menyesuaikan dalam ≤ 5 dtk setelah peserta lain menyimpan.
- Layout tidak overflow pada lebar layar 320 px; tabel dapat di-scroll horizontal dengan kolom jam tetap (*sticky*).

### 5.3 Identitas Partisipan Anonim (baru)
- Saat pertama kali menyimpan, server membuat `participant_id` + `edit_token` (acak, tidak dapat ditebak) dan menyimpannya di `localStorage` perangkat tersebut.
- Hanya perangkat dengan token yang sah yang dapat **mengedit/menghapus** jawaban miliknya.
- **Nama kembar:** jika nama sudah dipakai orang lain di acara yang sama, tampilkan pilihan "Ini saya (edit jawaban)" jika token cocok, atau sarankan nama lain / tambahkan sufiks otomatis ("Budi 2").
- **Perangkat lain / mode Incognito:** tersedia opsi "Saya sudah mengisi sebelumnya" yang meminta nama; MVP menolak pengeditan tanpa token (mencegah orang lain menimpa jawaban), dan menyarankan membuat nama baru.
- Nama panggilan: 1-24 karakter, disanitasi (tanpa HTML).

### 5.4 Papan Top Picks
**Definisi:** rangkaian slot berurutan dengan durasi minimum yang dapat diatur Inisiator (default **2 jam**, pilihan 1/2/3/4 jam).

**Aturan peringkat:**
1. Skor utama: jumlah peserta yang luang di **seluruh** durasi blok (irisan, bukan rata-rata).
2. Tie-break: (a) persentase peserta lebih tinggi, (b) waktu lebih awal, (c) lebih dekat ke jam sosial (17:00-22:00 untuk hari kerja; 10:00-21:00 akhir pekan) *opsional, dapat ditunda*.
3. Hindari tumpang-tindih: pilih maksimal 3 blok yang tidak saling tumpang-tindih.
4. Tampilan: "Jumat, 19:00-21:00 · 4 dari 5 orang" + nama yang tidak bisa (opsional diperluas).
5. Jika tidak ada blok bersama (skor 0), tampilkan pesan ramah: "Belum ada waktu yang cocok. Coba tambah rentang hari."

**Acceptance criteria:** hasil algoritma konsisten untuk data uji yang sama (unit test deterministik), dan dihitung server < 200 ms untuk 30 peserta × 14 hari × 30 menit-slot.

### 5.5 Riwayat Acara & Pemulihan Tautan (diperluas)
- Menyimpan **semua** acara yang dibuat **maupun diikuti** di `localStorage` (id, nama, peran, terakhir dibuka, tanggal acara).
- Halaman utama menampilkan bagian **"Acara Saya"**, diurutkan terbaru, dengan penanda "Dibuat oleh saya".
- Acara kedaluwarsa otomatis diberi label dan dapat dihapus dari daftar.
- **Fallback bila penyimpanan tidak tersedia (Incognito/diblokir):** gunakan try/catch, aplikasi tetap berfungsi, dan tampilkan peringatan ringan: "Riwayat tidak dapat disimpan di mode ini. Salin tautanmu."
- Setelah membuat acara: tampilkan tombol **Salin Tautan**, **Bagikan ke WhatsApp** (`wa.me` deep link), dan **Web Share API** bila tersedia.
- Pratinjau tautan (Open Graph): judul "Nongkrong Warkop: isi waktu luangmu" agar tautan menarik saat dibagikan di WhatsApp/Telegram.
- Ekspor/impor riwayat ditunda ke versi berikutnya.

### 5.6 Penutupan Acara (baru, ringan)
- Inisiator dapat menekan **"Kunci Waktu"** untuk memilih satu Top Pick sebagai keputusan final. Halaman menampilkan banner "Waktu ditetapkan: Jumat, 19:00" dan menyediakan tombol **Tambah ke kalender** (berkas .ics).
- *Prioritas: Should-have; boleh masuk sprint terakhir jika waktu cukup.*

## 6. Keputusan Teknis & Aturan Data

### 6.1 URL & Keamanan Akses
- ID acara: **nanoid/UUIDv4 minimal 12 karakter acak** (tidak berurutan, tidak dapat ditebak). Tautan adalah satu-satunya "kunci akses" (*capability URL*).
- Tautan hanya memuat ID acara, tidak memuat token edit.
- Header `Referrer-Policy: no-referrer` dan `noindex` agar halaman acara tidak terindeks mesin pencari.

### 6.2 Penyimpanan Ketersediaan
Simpan per partisipan sebagai daftar slot (waktu mulai UTC), bukan matriks penuh, supaya hemat dan mudah dikueri.

### 6.3 Zona Waktu
- Seluruh waktu disimpan dalam **UTC**; acara menyimpan `timezone` (IANA, mis. `Asia/Pontianak`).
- Tampilan grid memakai zona acara secara default. Jika zona perangkat berbeda, tampilkan banner: "Waktu ditampilkan dalam WIB" dengan pilihan beralih ke zona lokal.
- Uji wajib: peserta di WIB, WITA, dan WIT pada acara yang melintasi tengah malam.

### 6.4 Pembaruan "Real-time"
- MVP: **polling tiap 5 detik** saat tab aktif (dihentikan saat tab tersembunyi, memakai `visibilitychange`) dengan ETag/`If-None-Match` agar hemat.
- Pembaruan optimistis di sisi klien setelah "Simpan".
- WebSocket/SSE ditunda sampai ada bukti kebutuhan.

### 6.5 Retensi Data
- Acara dihapus otomatis **30 hari setelah tanggal terakhir pada rentang acara** (atau 90 hari sejak dibuat bila tak ada aktivitas), dijalankan cron harian.
- Penghapusan bersifat cascade (acara → partisipan → slot).
- Halaman acara yang sudah dihapus menampilkan pesan "Acara ini sudah kedaluwarsa" (bukan error 500).

### 6.6 Skema Data (usulan)

```
events
  id (text, PK, nanoid)           name (text)
  timezone (text)                  start_date (date)   end_date (date)
  day_start_min (int)              day_end_min (int)
  slot_minutes (int, default 30)   min_duration_min (int, default 120)
  locked_start_utc (timestamptz, null)
  created_at (timestamptz)         expires_at (timestamptz, indexed)

participants
  id (uuid, PK)                    event_id (FK → events, indexed)
  name (text)                      edit_token_hash (text)
  created_at / updated_at          UNIQUE(event_id, lower(name))

availability
  participant_id (FK)              slot_start_utc (timestamptz)
  PRIMARY KEY (participant_id, slot_start_utc)
  INDEX (event_id, slot_start_utc)   -- denormalisasi event_id untuk agregasi cepat
```

`edit_token` disimpan sebagai **hash**, bukan teks asli.

### 6.7 Kontrak API (draft, dikunci di Milestone 0)

| Metode | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/events` | Buat acara → `{ id, url }` |
| GET | `/api/events/:id` | Detail acara + peserta + agregasi slot + Top Picks |
| POST | `/api/events/:id/participants` | Daftar nama → `{ participantId, editToken }` |
| PUT | `/api/events/:id/participants/:pid/availability` | Ganti seluruh slot milik partisipan (header `X-Edit-Token`) |
| DELETE | `/api/events/:id/participants/:pid` | Hapus jawaban sendiri |
| POST | `/api/events/:id/lock` | Kunci waktu final (hanya pembuat, via token pembuat) |

Prinsip: PUT bersifat **idempoten** (menyimpan dua kali menghasilkan keadaan sama), validasi dengan skema (mis. Zod), dan kode error konsisten `{ error: { code, message } }`.

## 7. Persyaratan Non-Fungsional

| Area | Persyaratan |
|---|---|
| **Performa** | Respons API p95 < 300 ms; ukuran JS awal < 150 KB gzip; halaman utama interaktif < 2 dtk di 4G |
| **Skalabilitas** | Stabil untuk 100 acara aktif & 30 peserta/acara secara bersamaan (uji beban) |
| **Keamanan** | HTTPS wajib; sanitasi input; kueri berparameter; *rate limiting* (mis. 30 req/menit/IP untuk tulis, 10 pembuatan acara/jam/IP); CORS terbatas; token edit di-hash |
| **Privasi** | Tidak ada data pribadi selain nama panggilan; tidak ada cookie pelacak; kebijakan privasi satu halaman; retensi sesuai 6.5 |
| **Aksesibilitas** | Kontras WCAG AA, target sentuh ≥ 44×44 px (dikompromikan di grid dengan jarak ≥ 8 px antar-baris), dukungan keyboard di desktop, label ARIA pada grid |
| **Kompatibilitas** | Chrome/Safari/Firefox 2 versi terakhir; Android Chrome & iOS Safari wajib; layar 320-768 px prioritas |
| **Bahasa** | Bahasa Indonesia default, teks dipisah dalam berkas i18n agar mudah ditambah bahasa lain |
| **Observabilitas** | Log terstruktur, pemantauan error, health-check `/api/health` |
| **Ketahanan** | Aplikasi tidak *crash* bila `localStorage` tidak tersedia; penanganan offline dengan pesan jelas |

## 8. Rekomendasi Teknologi (dikunci agar tim langsung jalan)

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Front-end | **Next.js (React) + TypeScript + Tailwind CSS** | Satu repo untuk UI & API, SSR untuk Open Graph preview, ekosistem luas |
| Back-end | **Next.js Route Handlers** (Node.js), validasi **Zod** | Mengurangi overhead sambungan front/back untuk tim kecil |
| Database | **PostgreSQL** (Supabase atau Neon, tier gratis) + ORM **Drizzle/Prisma** | Relasional cocok untuk agregasi irisan waktu; transaksi & indeks matang |
| Cron | Supabase `pg_cron` atau Vercel Cron | Retensi data otomatis |
| Hosting | **Vercel** (front+API) | Deploy otomatis dari Git, preview per *pull request* |
| Desain | **Figma** | Prototipe dan *handoff* |
| Pengujian | **Vitest** (unit), **Playwright** (E2E mobile viewport), **k6** (beban) | Otomasi QA yang dapat dijalankan di CI |
| Kualitas | ESLint, Prettier, GitHub Actions | Konsistensi kode & CI |
| Pemantauan | Sentry (error), analitik privasi-ramah (mis. Plausible/Umami) | Mengukur KPI tanpa data pribadi |

*Alternatif jika tim lebih menguasai stack lain:* tetap boleh, asalkan keputusan dikunci di Milestone 0 dan memenuhi persyaratan Bagian 7.

## 9. Peran, Tanggung Jawab & Kolaborasi

| Peran | Penanggung jawab | Tanggung jawab utama (deliverable) |
|---|---|---|
| **Front-End** | Elga | Grid sentuh (drag-select), heatmap, halaman utama + Riwayat Acara (`localStorage` dengan fallback), halaman acara, integrasi API, PWA-ready meta/Open Graph |
| **Back-End** | Lea | Implementasi API (Bagian 6.7), algoritma Top Picks + unit test, pembuatan ID & token, rate limiting, validasi |
| **Database & Arsitektur** | Rian | Skema & migrasi, indeks, kueri agregasi, cron retensi, pengaturan CI/CD & lingkungan, keamanan infrastruktur, uji beban bersama QA |
| **UI/UX & QA** | Nadya | Wireframe → prototipe Figma, design system kecil (warna heatmap, komponen), semua state UI, rencana & eksekusi uji, uji usability, laporan bug |

**Prinsip kerja baru:**
- **QA terlibat sejak Milestone 0** (menulis kriteria uji bersama PRD), bukan hanya di akhir.
- **Kontrak API dibekukan lebih dulu** → Front-End bisa memakai *mock data* sementara Back-End bekerja paralel.
- **Pairing:** Elga-Nadya untuk grid & heatmap; Lea-Rian untuk algoritma & kueri agregasi.
- *Daily* singkat (15 menit), *demo* tiap akhir sprint, tiap PR wajib 1 reviewer.

## 10. Rencana Pelaksanaan (4 minggu, dapat disesuaikan)

| Milestone | Isi | Hasil / Kriteria Selesai |
|---|---|---|
| **M0: Fondasi (minggu 1, awal)** | Kunci stack, repo & CI, kontrak API, skema DB, wireframe alur utama, data uji | Repo berjalan, deploy "Hello World", Figma wireframe disetujui |
| **M1: Inti (minggu 1-2)** | Buat acara, daftar partisipan, simpan ketersediaan, grid (mode isi) | Alur buat → bagikan → isi berjalan end-to-end di staging |
| **M2: Hasil (minggu 2-3)** | Heatmap, panel detail sel, Top Picks, polling, Riwayat Acara | Semua fitur MVP Bagian 5.1-5.5 memenuhi acceptance criteria |
| **M3: Mutu (minggu 3-4)** | Zona waktu, edit/hapus jawaban, state error/kosong, aksesibilitas, uji beban, uji Incognito, retensi cron, perbaikan bug | Daftar bug kritis = 0; KPI performa tercapai |
| **M4: Peluncuran (akhir minggu 4)** | Uji usability akhir (≥ 5 orang), Open Graph, analitik, dokumentasi, "Kunci Waktu" (bila sempat) | Siap dipakai publik; retrospektif |

## 11. Strategi Pengujian & Definition of Done

### Definition of Done (per fitur)
- Memenuhi acceptance criteria dan lolos review kode.
- Unit/E2E test terkait hijau di CI.
- Teruji di minimal: Android Chrome, iOS Safari, desktop Chrome.
- Tidak ada error konsol; state loading/error/kosong tersedia.
- Disetujui Nadya (UX & QA).

### Skenario uji utama (QA: Nadya)

| Kategori | Skenario |
|---|---|
| Fungsional | Buat acara → bagikan → 5 orang mengisi → Top Picks benar sesuai data uji |
| Edge case | Klik "Simpan" dua kali; kirim ulang saat koneksi lambat; nama kembar; nama berisi HTML/emoji; rentang 1 hari & 14 hari; acara melintasi tengah malam |
| Zona waktu | Peserta di WIB/WITA/WIT; perangkat dengan zona berbeda dari acara |
| Lost Link | Tutup & buka ulang browser (riwayat tetap ada); mode Incognito (tidak *error*, ada peringatan); bersihkan data situs (ada panduan pemulihan: tautan masih di chat) |
| Konkurensi | 30 peserta menyimpan serentak; dua perangkat mengedit orang yang sama |
| Keamanan | Menebak ID acara; menyalahgunakan `edit_token` milik orang lain; *rate limit* terpicu dengan pesan ramah |
| Aksesibilitas | Simulasi buta warna; pembaca layar dasar; ukuran font sistem besar |
| Beban | k6: 100 acara aktif × 30 peserta, polling 5 dtk; p95 < 300 ms |
| Usability | 5 orang baru menyelesaikan tugas tanpa panduan; catat waktu & titik bingung |

## 12. Risiko & Mitigasi

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Lost Link (tautan hilang) | Sedang | Tinggi | Riwayat `localStorage` untuk semua peran, tombol salin/bagikan, pesan jelas di Incognito, tautan selalu ada di grup chat |
| Drag-select bentrok dengan scroll di ponsel | Tinggi | Tinggi | Prototipe dini di M1, uji di perangkat nyata, long-press + `touch-action` |
| Salah zona waktu | Sedang | Tinggi | Simpan UTC, banner zona, uji lintas zona wajib |
| Penyalahgunaan/spam pembuatan acara | Sedang | Sedang | Rate limit per IP, batas ukuran data, bot-protection ringan bila perlu |
| Penimpaan jawaban orang lain (anonim) | Sedang | Sedang | Token edit per perangkat, nama unik per acara |
| Batas tier gratis database/hosting | Rendah | Sedang | Retensi data, indeks, pemantauan kuota |
| Lingkup membengkak (scope creep) | Tinggi | Tinggi | Daftar Non-Tujuan jelas; permintaan baru masuk backlog v1.1 |
| Anggota tim tidak tersedia | Sedang | Sedang | Dokumentasi singkat, *pairing*, tidak ada satu orang sebagai titik tunggal |

## 13. Roadmap Pasca-MVP (v1.1+)

1. Kunci waktu + ekspor kalender (.ics) bila belum masuk MVP.
2. Opsi "Mungkin" (ketersediaan tentatif, warna berbeda).
3. Voting lokasi sederhana.
4. Ekspor/impor riwayat acara; kode pemulihan opsional.
5. Pengingat via tautan WhatsApp (tanpa backend notifikasi).
6. Mode gelap; bahasa tambahan.
7. Opsi login opsional (bukan wajib) untuk sinkronisasi riwayat lintas perangkat.
8. Tautan terpisah "admin" vs "bagikan".

## 14. Pertanyaan Terbuka (putuskan di M0)

1. Apakah granularitas 30 menit sudah cukup, atau perlu 15 menit untuk kasus tertentu?
2. Haruskah Inisiator dapat menghapus acara sebelum retensi otomatis? (Usulan: ya, via token pembuat.)
3. Apakah acara perlu mendukung rentang tanggal tidak berurutan (mis. hanya Jumat-Minggu)? (Usulan: v1.1, MVP cukup rentang berurutan.)
4. Apakah batas 30 peserta/14 hari cukup untuk target pengguna awal?
5. Domain & nama produk final (untuk Open Graph, kebijakan privasi, dan analitik).

---

## Lampiran A: Wireframe Teks (halaman utama)

```
┌───────────────────────────────┐
│  [Logo]  Cari Waktu Nongkrong │
│                               │
│  Nama acara  [_____________]  │
│  Tanggal     [12 Nov → 18 Nov]│
│  Jam         [08:00 → 23:00 ] │
│                               │
│  [      Buat Tautan       ]   │
│                               │
│  Acara Saya                   │
│  • Nongkrong Warkop  (Dibuat) │
│  • Futsal Jumat      (Ikut)   │
│  • Ultah Dina        (Lewat)  │
└───────────────────────────────┘
```

## Lampiran B: Glosarium
- **Slot:** satuan waktu terkecil (30 menit).
- **Irisan waktu:** slot yang dipilih oleh banyak/semua peserta.
- **Capability URL:** tautan yang tidak dapat ditebak dan berfungsi sebagai kunci akses.
- **Edit token:** kode rahasia di perangkat partisipan untuk mengedit jawaban miliknya.
