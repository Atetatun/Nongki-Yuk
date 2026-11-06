# Pembagian Tugas Back-End — Nongki-Yuk

Dokumen ini menjelaskan siapa mengerjakan apa di sisi Back-End, urutan kerjanya, dan aturan main agar tidak bentrok. Ditujukan untuk tim yang masih belajar, jadi tugas dipecah kecil dan jelas.

## 1. Pembagian Peran

### Elga — Fondasi data dan deploy
- Rancang skema database (acara, peserta, slot ketersediaan) dan koneksinya.
- Buat fungsi akses data yang sederhana, misalnya `buatAcara()`, `simpanKetersediaan()`, dan `ambilAcara()`.
- Atur environment variable dan urus deploy ke Vercel.
- **Output utama:** fungsi-fungsi akses data yang dipakai Lea dan Nadya.

### Lea — Endpoint untuk menulis data
- `POST` buat acara (validasi input, kembalikan tautan acara).
- `POST` simpan ketersediaan peserta (validasi ketat karena tanpa login).
- Tangani kasus tepi: acara tidak ditemukan, data kosong, kirim dua kali.
- Gunakan fungsi akses data milik Elga.

### Nadya — Logika inti dan endpoint hasil
- Buat fungsi murni di `lib/`: hitung irisan waktu (data heatmap) dan pilih Top Picks (3 opsi terbaik).
- Tulis unit test untuk kasus normal dan tepi (tidak ada irisan, peserta tunggal, skor seri).
- `GET` hasil acara yang memanggil fungsi di atas.
- Bagian ini tidak butuh database di awal, jadi bisa dimulai hari pertama dengan data contoh.

## 2. Kesepakatan Sebelum Mulai

Adakan satu sesi bersama (30-45 menit) untuk menyepakati:

1. **Bentuk data** (tipe/skema Zod) untuk acara dan slot ketersediaan. Jadikan satu sumber kebenaran.
2. **Nama dan bentuk fungsi akses data** milik Elga, supaya Lea dan Nadya bisa mulai dengan data tiruan.
3. **Bentuk response** tiap endpoint, lalu bagikan ke Rian (Front-End) agar UI bisa dibangun dengan data tiruan.

## 3. Urutan dan Ketergantungan

| Minggu | Elga | Lea | Nadya |
|---|---|---|---|
| 1 | Skema dan koneksi database | Kontrak endpoint, endpoint buat acara (data tiruan) | Fungsi heatmap + tes |
| 2 | Fungsi akses data, deploy | Endpoint simpan ketersediaan | Fungsi Top Picks + tes |
| 3 | Sambungkan ke fungsi asli | Ganti data tiruan dengan data asli | Endpoint hasil, lalu tes ujung ke ujung |

## 4. Siklus Kerja per Tugas

Ulangi untuk setiap issue:

1. Ambil satu issue dan tulis di komentar, "Saya kerjakan ini". Satu issue dalam satu waktu.
2. Update dan buat branch: `git checkout main`, `git pull`, lalu `git checkout -b feat/nama-tugas`.
3. Pahami dulu sebelum coding. Tulis 3 baris di komentar: apa inputnya, apa outputnya, apa yang bisa salah.
4. Kerjakan dengan hermes per langkah kecil (lihat aturan di bawah).
5. Tes sendiri: jalankan `npm run lint` dan `npm run test`, lalu coba endpoint secara manual.
6. Commit kecil dan sering dengan pesan jelas, misalnya `feat: tambah endpoint buat acara`.
7. Buka Pull Request: apa yang diubah, cara mengetesnya, dan satu hal yang dipelajari.
8. Tunggu review. Perbaiki komentar di branch yang sama, jangan buka PR baru.
9. Setelah merge, hapus branch, tarik `main` terbaru, lalu ambil issue berikutnya.

## 5. Aturan Pakai Hermes

- Satu sesi, satu issue. Jangan minta "buatkan seluruh backend".
- Beri konteks: isi issue, bagian PRD yang relevan, dan file yang boleh disentuh.
- Minta penjelasan alasannya, bukan hanya kodenya.
- Sebelum commit, kamu harus bisa menjelaskan tiap bagian kode dengan kata-katamu sendiri.
- Jangan tempel `.env`, kunci API, atau connection string ke prompt.
- Kalau saran hermes berbeda dari struktur repo yang ada, ikuti struktur repo dan tanyakan ke Ketua.

## 6. Aturan Agar Tidak Bentrok

- **Satu pemilik per folder/file.** Elga memegang folder data, Lea memegang route tulis, Nadya memegang `lib/` logika dan route hasil. Mau mengubah milik orang lain? Minta lewat issue atau komentar PR.
- **Review silang:** Lea mereview Nadya, Nadya mereview Elga, Elga mereview Lea. Ketua memberi review akhir.
- **Satu issue, satu branch, satu PR kecil.**
- **Jangan merge sendiri.** Semua PR minimal di-review satu orang.
- **Jangan push langsung ke `main`.**

## 7. Kalau Macet

- Stuck lebih dari 30 menit berarti wajib bertanya di grup.
- Tulis apa yang sudah dicoba, error lengkapnya, dan file yang terlibat.
- Bertanya itu bagian dari kerja, bukan tanda kelemahan.

## 8. Checklist PR

- [ ] Satu issue, satu PR, ukuran kecil
- [ ] `npm run lint` dan `npm run test` lolos
- [ ] Sudah dites manual
- [ ] Tidak ada rahasia (`.env`, kunci API) yang ikut ter-commit
- [ ] Saya paham semua kode yang saya kirim
