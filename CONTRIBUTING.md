# Panduan Kontribusi

Terima kasih sudah ikut membangun Nongkrong App! Dokumen ini berisi aturan main tim supaya kerja kita rapi, saling terlihat, dan tidak saling menimpa.

## Prinsip Utama

1. **`main` harus selalu stabil.** Jangan push langsung ke `main`; semua perubahan lewat Pull Request (PR).
2. **Satu tugas = satu branch = satu PR.** Buat PR kecil (idealnya < 400 baris perubahan) agar mudah di-review.
3. **Tidak ada yang merge PR sendiri tanpa review.** Minimal 1 persetujuan dari anggota tim lain.
4. **Rahasia tidak boleh masuk repo.** File `.env`, token, dan kunci API tidak pernah di-commit.
5. **Ragu? Tanya di grup.** Lebih baik bertanya 2 menit daripada memperbaiki 2 hari.

## Alur Kerja

### 1. Ambil tugas
- Pilih Issue dari papan **Projects** (kolom *To Do*), tetapkan dirimu sebagai *assignee*, lalu pindahkan ke *In Progress*.
- Jika tugas belum ada Issue-nya, buat dulu dengan label yang sesuai.

### 2. Buat branch dari `main`

```bash
git checkout main
git pull origin main
git checkout -b feat/grid-drag-select
```

**Format nama branch:**

| Awalan | Untuk | Contoh |
|---|---|---|
| `feat/` | Fitur baru | `feat/heatmap` |
| `fix/` | Perbaikan bug | `fix/double-save` |
| `docs/` | Dokumentasi | `docs/update-readme` |
| `refactor/` | Merapikan kode tanpa ubah perilaku | `refactor/top-picks-algo` |
| `test/` | Menambah/memperbaiki test | `test/timezone-cases` |
| `chore/` | Konfigurasi, dependensi, CI | `chore/setup-ci` |

Gunakan huruf kecil dan tanda hubung (`-`), tanpa spasi.

### 3. Commit

Commit kecil dan sering, dengan pesan jelas. Format yang dipakai: **Conventional Commits**.

```
<tipe>: <ringkasan singkat dalam bentuk perintah>
```

Contoh:

```
feat: tambah drag-select pada grid waktu
fix: cegah simpan ganda saat tombol ditekan dua kali
docs: lengkapi cara menjalankan di README
test: tambah kasus zona waktu WIT untuk Top Picks
```

Tipe yang dipakai: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

### 4. Sebelum membuka PR

Pastikan semua ini lolos di komputermu:

```bash
npm run lint
npm run test
npm run build
```

Lalu sinkronkan dengan `main` terbaru:

```bash
git fetch origin
git rebase origin/main   # atau: git merge origin/main
```

### 5. Buka Pull Request

- Judul mengikuti format commit (mis. `feat: tambah heatmap pada grid`).
- Isi deskripsi: **apa** yang berubah, **kenapa**, dan **cara mengujinya**.
- Kaitkan Issue dengan `Closes #12`.
- Untuk perubahan UI, **lampirkan screenshot atau rekaman layar** (tampilan ponsel).
- Minta review dari minimal 1 orang. Gunakan *Draft PR* bila belum siap.

**Checklist PR:**

- [ ] Sudah dites manual (sebutkan perangkat/browser)
- [ ] Lint, test, dan build lolos
- [ ] Tidak ada `console.log` atau kode sementara yang tertinggal
- [ ] Tidak ada rahasia/kredensial di dalam perubahan
- [ ] Dokumentasi diperbarui jika perlu

### 6. Review

**Sebagai reviewer:**
- Usahakan merespons dalam **24 jam**.
- Beri komentar yang spesifik dan sopan; jelaskan alasan, bukan hanya "ganti ini".
- Bedakan antara *wajib diperbaiki* dan *saran* (beri awalan `nit:` untuk saran kecil).
- Setujui (*Approve*) bila sudah memenuhi kriteria selesai.

**Sebagai penulis PR:**
- Jangan tersinggung; review menilai kode, bukan orangnya.
- Balas setiap komentar atau tandai *resolved* setelah diperbaiki.

### 7. Merge

- Gunakan **Squash and merge** agar riwayat `main` bersih.
- Hapus branch setelah merge.
- Pindahkan Issue ke *Done* (otomatis bila memakai `Closes #...`).

## Definisi Selesai (Definition of Done)

Sebuah tugas dianggap selesai jika:

- Memenuhi *acceptance criteria* di Issue/PRD.
- Lolos review minimal 1 orang dan CI hijau.
- Teruji di minimal Android Chrome, iOS Safari, dan desktop Chrome (untuk perubahan UI).
- Tidak ada error di konsol dan state loading/error/kosong tertangani.
- Disetujui Nadya (UX & QA) untuk fitur yang terlihat pengguna.

## Standar Kode

- Bahasa pemrograman: **TypeScript**; hindari `any` kecuali terpaksa dan diberi komentar.
- Format & lint otomatis dengan **Prettier** dan **ESLint**; ikuti konfigurasi di repo.
- Nama variabel/fungsi dalam **bahasa Inggris**, komentar dan teks UI boleh **bahasa Indonesia**.
- Teks yang tampil ke pengguna ditaruh di berkas i18n, bukan ditulis langsung di komponen.
- Validasi semua input di sisi server (Zod), jangan hanya mengandalkan front-end.
- Waktu selalu disimpan sebagai **UTC**; konversi zona waktu hanya di lapisan tampilan.
- Tulis test untuk logika penting (terutama algoritma Top Picks dan konversi zona waktu).

## Pembagian Area Kepemilikan

| Area | Penanggung jawab utama |
|---|---|
| UI, grid, heatmap, `localStorage` | Elga |
| API, algoritma Top Picks | Lea |
| Skema database, migrasi, cron, CI/CD | Rian |
| Desain, state UI, rencana & eksekusi uji | Nadya |

Penanggung jawab utama menjadi reviewer pertama untuk areanya, tetapi siapa pun boleh berkontribusi di area mana pun.

## Melaporkan Bug

Buat Issue baru dengan label `bug` yang memuat:

1. **Langkah untuk mereproduksi**
2. **Hasil yang diharapkan** vs **hasil yang terjadi**
3. **Perangkat, OS, dan browser** (contoh: Redmi Note 11, Android 13, Chrome 120)
4. **Screenshot / rekaman layar** bila memungkinkan

## Rapat & Komunikasi

- **Daily singkat** (15 menit, atau pesan teks di grup): kemarin ngerjain apa, hari ini apa, ada hambatan?
- **Demo mingguan**: setiap orang menunjukkan hasil kerjanya.
- Keputusan penting dicatat di `docs/decisions.md` agar tidak diperdebatkan ulang.
- Permintaan fitur baru di luar lingkup MVP dimasukkan ke backlog (v1.1), bukan langsung dikerjakan.

## Keamanan

- Jangan membagikan `DATABASE_URL` atau kredensial lewat grup chat publik; gunakan pengelola rahasia atau pesan pribadi.
- Jika tidak sengaja meng-commit rahasia, **segera beri tahu ketua dan Rian** agar kunci tersebut diganti (menghapus commit saja tidak cukup).
- Laporkan celah keamanan secara pribadi kepada ketua tim, bukan lewat Issue publik.

## Kode Etik Tim

Hormati sesama anggota, beri umpan balik dengan baik, dan hargai waktu satu sama lain. Perbedaan pendapat diselesaikan dengan diskusi; bila buntu, ketua tim yang memutuskan dan keputusannya dicatat.
