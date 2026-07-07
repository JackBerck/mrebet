# 🗺️ Cetak Biru & Skema Database: Website Desa Wisata Kecamatan Mrebet

**Klien:** Pemerintah Kecamatan/Desa Mrebet, Kabupaten Purbalingga
**Arsitektur:** Flat & Simplified (Optimasi UX Admin Desa)
**Tech Stack:** Laravel + React.js (Inertia SSR) + MySQL (InnoDB)

---

## 🏗️ 1. Penjelasan General Arsitektur
Skema database ini dirancang dengan pendekatan *denormalized/flat*. Tujuan utamanya adalah menyederhanakan *User Experience* (UX) pada halaman Admin Panel. Mengingat pengelola (Admin Desa atau Pokdarwis) mungkin memiliki literasi digital yang beragam, form input dibuat semudah mungkin dalam satu halaman panjang tanpa perlu banyak berpindah tab atau mengisi relasi data yang rumit (seperti tabel jam operasional atau fasilitas yang dipisah).

Untuk mempermudah tahap awal pengembangan, konten website saat ini hanya fokus pada **Bahasa Indonesia saja** (tidak menggunakan multi-bahasa/i18n berbasis JSON untuk teks deskripsi).

---

## 🗄️ 2. Struktur Database (Tabel & Relasi)

### A. Tabel `users` (Autentikasi & RBAC)
Menyimpan data pengguna, baik Super Admin maupun Admin masing-masing desa.
* `id` (INT, PK, Auto Increment)
* `full_name` (VARCHAR)
* `email` (VARCHAR, Unique)
* `phone_number` (VARCHAR)
* `password` (VARCHAR)
* `email_verified_at` (TIMESTAMP, Nullable)
* `avatar` (VARCHAR, Nullable) - *Path file foto profil.*
* `role` (ENUM: 'admin', 'manager') - *'admin' untuk kecamatan, 'manager' untuk desa.*
* `village_id` (INT, FK ke villages.id, Nullable) - *Hanya diisi jika role adalah 'manager'.*
* `is_active` (BOOLEAN, Default: True)
* `remember_token` (VARCHAR)
* `created_at / updated_at` (TIMESTAMP)

### B. Tabel `villages` (Master Desa)
Menyimpan profil utama desa wisata.
* `id` (INT, PK, Auto Increment)
* `name` (VARCHAR) - *Contoh: Desa Serang*
* `slug` (VARCHAR, Unique)
* `description` (TEXT) - *Deskripsi profil desa (Bahasa Indonesia saja).*
* `head_name` (VARCHAR) - *Nama Kepala Desa/Ketua Pokdarwis.*
* `contact_phone` (VARCHAR)
* `latitude` (DECIMAL 10,8)
* `longitude` (DECIMAL 11,8)
* `point` (POINT, SPATIAL) - *Titik koordinat asli untuk fitur pencarian radius.*
* `qr_code_target` (VARCHAR, Nullable) - *URL target QR Code (misal: Google Maps atau link detail desa).*
* `status` (ENUM: 'draft', 'published')
* `created_at / updated_at / deleted_at` (TIMESTAMP)

### C. Tabel `destinations` (Spot Wisata/Atraksi)
Menyimpan titik wisata spesifik di dalam desa.
* `id` (INT, PK, Auto Increment)
* `village_id` (INT, FK ke villages.id)
* `name` (VARCHAR) - *Contoh: Curug Ciputut*
* `slug` (VARCHAR, Unique)
* `category` (ENUM: 'alam', 'budaya', 'buatan')
* `description` (TEXT) - *Deskripsi wisata (Bahasa Indonesia saja).*
* `ticket_price` (DECIMAL 10,2) - *Harga dasar tiket.*
* `ticket_info` (TEXT, Nullable) - *Keterangan tambahan harga manual (misal: tarif parkir, rombongan).*
* `open_time` (TIME)
* `close_time` (TIME)
* `operational_days` (VARCHAR) - *Teks manual bebas, misal: "Setiap Hari" atau "Sabtu & Minggu".*
* `facilities` (JSON) - *Array fasilitas, misal: `["Toilet", "Parkir", "Warung"]`.*
* `latitude` (DECIMAL 10,8)
* `longitude` (DECIMAL 11,8)
* `point` (POINT, SPATIAL)
* `qr_code_target` (VARCHAR, Nullable) - *URL target QR Code (misal: Google Maps atau link detail wisata).*
* `status` (ENUM: 'draft', 'published')
* `created_at / updated_at / deleted_at` (TIMESTAMP)

### D. Tabel `events` (Kalender Acara)
Menyimpan kegiatan atau festival musiman.
* `id` (INT, PK, Auto Increment)
* `village_id` (INT, FK ke villages.id)
* `destination_id` (INT, FK ke destinations.id, Nullable)
* `title` (VARCHAR)
* `slug` (VARCHAR, Unique)
* `description` (TEXT) - *Deskripsi event (Bahasa Indonesia saja).*
* `start_date` (DATE)
* `end_date` (DATE)
* `start_time` (TIME, Nullable)
* `end_time` (TIME, Nullable)
* `ticket_price` (DECIMAL 10,2, Default 0)
* `organizer` (VARCHAR)
* `instagram` (VARCHAR, Nullable)
* `contact_person` (VARCHAR)
* `qr_code_target` (VARCHAR, Nullable) - *URL target QR Code (misal: lokasi acara di Google Maps).*
* `status` (ENUM: 'draft', 'published')
* `created_at / updated_at / deleted_at` (TIMESTAMP)

### E. Tabel `blogs` (Artikel / Berita / Blog)
Menyimpan tulisan, artikel, dan dokumentasi kegiatan pariwisata.
* `id` (INT, PK, Auto Increment)
* `user_id` (INT, FK ke users.id) - *Penulis/pembuat artikel.*
* `village_id` (INT, FK ke villages.id, Nullable) - *Opsional, jika artikel dikaitkan dengan desa tertentu. Tapi kalau yang bikin admin desa nanti tidak bisa ngisi desa lain (hanya desa yang diampu)*
* `title` (VARCHAR)
* `slug` (VARCHAR, Unique)
* `content` (LONGTEXT) - *Isi artikel lengkap (rich text/HTML).*
* `cover_image` (VARCHAR, Nullable) - *Path untuk gambar cover utama.*
* `status` (ENUM: 'draft', 'published')
* `views_count` (INT, Default: 0)
* `published_at` (TIMESTAMP, Nullable)
* `created_at / updated_at / deleted_at` (TIMESTAMP)

### F. Tabel `media` (Manajemen Aset)
*Catatan: Jika menggunakan `spatie/laravel-medialibrary`, tabel ini akan di-generate otomatis.*
* `id` (INT, PK, Auto Increment)
* `mediable_id` (INT)
* `mediable_type` (VARCHAR) - *Contoh: App\Models\Destination*
* `file_path` (VARCHAR)
* `alt_text` (VARCHAR) - *Penting untuk SEO.*
* `is_primary` (BOOLEAN) - *Penanda cover/thumbnail utama.*
* `created_at / updated_at` (TIMESTAMP)

---

## 🚀 3. Fitur Inti yang Disediakan
1.  **Role-Based Access Control (RBAC):** Pemisahan tegas antara Super Admin (yang bisa melihat dan mengatur semua desa) dan Manager/Admin Desa (yang hak akses CRUD-nya terkunci hanya untuk `village_id` miliknya).
2.  **Sistem Spasial Peta (WebGIS Ringan):** Penggunaan tipe data `POINT` memungkinkan website menampilkan semua destinasi dalam satu peta interaktif besar, sekaligus mendukung query "Wisata Terdekat".
3.  **Kalender Pariwisata:** Pengunjung web dapat memfilter event berdasarkan bulan berjalan.
4.  **Artikel & Publikasi (Blogs):** Wadah promosi desa wisata dan kegiatan lokal dalam bentuk blogpost interaktif.
5.  **Sistem QR Code Lokasi:** Setiap desa, destinasi, dan event memiliki kolom `qr_code_target`. Sistem dapat secara otomatis menghasilkan QR Code yang ketika dipindai (scan) langsung mengarahkan pengguna ke link target tersebut (misalnya, Google Maps atau halaman detail website).

---

## 🌐 4. Struktur Halaman Publik (Frontend)

Struktur halaman website yang dapat diakses oleh pengunjung (wisatawan) dibagi menjadi dua kategori utama:

### Kategori 1: Halaman Utama (Tampil di Navbar & Footer)
Halaman-halaman ini adalah *core features* yang menjadi daya tarik utama website pariwisata.
1. **Beranda (Home)**: Banner hero, pencarian cepat, peta mini (wisata terdekat), dan highlight destinasi/event/artikel terbaru.
2. **Desa Wisata**: Daftar seluruh desa wisata dan halaman detail deskripsi desa beserta list spot wisata di dalamnya.
3. **Destinasi Wisata**: Eksplorasi spot wisata dengan filter (alam/budaya/buatan) beserta halaman detail (harga tiket, jam buka, galeri foto, rute Google Maps).
4. **Peta Wisata (WebGIS)**: Peta *full-screen* interaktif dengan seluruh pin lokasi desa dan destinasi wisata di Mrebet.
5. **Kalender Acara**: Agenda kegiatan budaya dan festival desa wisata dalam bentuk kalender/timeline.
6. **Blog & Berita**: Wadah untuk artikel promosi, publikasi desa, dan liputan event.
7. **Tentang Kami & Kontak**: Profil pengelola (Kecamatan/Pokdarwis), visi-misi, serta form kontak terpusat (WhatsApp/Email).

### Kategori 2: Halaman Opsional / Tambahan (Tampil di Footer Saja)
Halaman bersifat pendukung, informatif, dan mengedepankan legalitas untuk menambah kredibilitas serta kenyamanan pengunjung.
1. **FAQ (Tanya Jawab)**: Menjawab pertanyaan umum (kondisi jalan/akses bus, tingkat keamanan untuk balita/lansia, prosedur reservasi rombongan).
2. **Kebijakan Privasi (Privacy Policy)**: Menjamin keamanan data jika website mengumpulkan data pengunjung (melalui form kontak atau registrasi) — sejalan dengan *best practices* pengelolaan data publik.
3. **Syarat & Ketentuan (Terms & Conditions)**: Aturan di area wisata (kebersihan/pelestarian alam) dan *disclaimer* terkait cuaca atau pembatalan *ticketing*/event.
4. **Panduan Wisatawan (Travel Tips)**: Informasi pelengkap seperti akses transportasi umum, rekomendasi pakaian, dan daftar nomor darurat lokal (Puskesmas/Polsek).
5. **Kemitraan (Partnership)**: Informasi kerja sama bagi investor, *travel agent*, pihak sponsor acara, atau institusi yang ingin melakukan survei/KKN.

---

## 💡 5. Saran & Hal Penting Lainnya (Vervo Standard)

* **Implementasi Media Library:** Sangat disarankan untuk langsung memakai package `spatie/laravel-medialibrary`. Jangan membuat *upload logic* dari awal. Package ini sudah sangat matang untuk mengurus relasi *polymorphic*, *auto-resize* gambar untuk thumbnail, dan integrasi cloud storage (jika ke depannya butuh S3).
* **Pendekatan UI Form:** Karena skemanya sudah sangat *flat*, buat UI panel admin menggunakan komponen React yang intuitif. Gunakan *Map Picker* (misal: Leaflet) di form agar admin desa cukup geser pin di peta, dan kolom `latitude` & `longitude` otomatis terisi.
* **Integrasi QR Code**: Gunakan package Laravel seperti `simplesoftwareio/simple-qrcode` untuk merender QR Code secara dinamis berdasarkan nilai `qr_code_target`. Jika kolom `qr_code_target` kosong, sistem bisa otomatis mengarah ke halaman detail desa/destinasi itu sendiri sebagai fallback.
* **Akurasi Titik:** Mengingat kontur geografis daerah Mrebet yang bervariasi (menuju arah lereng Gunung Slamet), pastikan pin peta pada database diset seakurat mungkin karena ini akan terhubung langsung dengan tombol "Get Directions" yang mengarah ke Google Maps wisatawan.