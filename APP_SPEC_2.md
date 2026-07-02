# 🗺️ Cetak Biru & Skema Database: Website Desa Wisata Kecamatan Mrebet

**Klien:** Pemerintah Kecamatan/Desa Mrebet, Kabupaten Purbalingga
**Arsitektur:** Flat & Simplified (Optimasi UX Admin Desa)
**Tech Stack:** Laravel + React.js (Inertia SSR) + MySQL (InnoDB)

---

## 🏗️ 1. Penjelasan General Arsitektur
Skema database ini dirancang dengan pendekatan *denormalized/flat*. Tujuan utamanya adalah menyederhanakan *User Experience* (UX) pada halaman Admin Panel. Mengingat pengelola (Admin Desa atau Pokdarwis) mungkin memiliki literasi digital yang beragam, form input dibuat semudah mungkin dalam satu halaman panjang tanpa perlu banyak berpindah tab atau mengisi relasi data yang rumit (seperti tabel jam operasional atau fasilitas yang dipisah).

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
* `avatar` (VARCHAR, Nullable)
* `role` (ENUM: 'admin', 'manager') - *'admin' untuk kecamatan, 'manager' untuk desa.*
* `village_id` (INT, FK ke villages.id, Nullable) - *Hanya diisi jika role adalah 'manager'.*
* `is_active` (BOOLEAN, Default: True)
* `remember_token` (VARCHAR)

### B. Tabel `villages` (Master Desa)
Menyimpan profil utama desa wisata.
* `id` (INT, PK, Auto Increment)
* `name` (VARCHAR) - *Contoh: Desa Serang*
* `slug` (VARCHAR, Unique)
* `description` (JSON) - *Mendukung Multi-bahasa (i18n).*
* `head_name` (VARCHAR) - *Nama Kepala Desa/Ketua Pokdarwis.*
* `contact_phone` (VARCHAR)
* `latitude` (DECIMAL 10,8)
* `longitude` (DECIMAL 11,8)
* `point` (POINT, SPATIAL) - *Titik koordinat asli untuk fitur pencarian radius.*
* `status` (ENUM: 'draft', 'published')

### C. Tabel `destinations` (Spot Wisata/Atraksi)
Menyimpan titik wisata spesifik di dalam desa.
* `id` (INT, PK, Auto Increment)
* `village_id` (INT, FK ke villages.id)
* `name` (VARCHAR) - *Contoh: Curug Ciputut*
* `slug` (VARCHAR, Unique)
* `category` (ENUM: 'alam', 'budaya', 'buatan', dll)
* `description` (JSON) - *Mendukung Multi-bahasa (i18n).*
* `ticket_price` (DECIMAL 10,2) - *Harga dasar.*
* `ticket_info` (TEXT, Nullable) - *Keterangan tambahan harga manual.*
* `open_time` (TIME)
* `close_time` (TIME)
* `operational_days` (VARCHAR) - *Teks manual bebas, misal: "Setiap Hari".*
* `facilities` (JSON) - *Array fasilitas, misal: `["Toilet", "Parkir"]`.*
* `latitude` (DECIMAL 10,8)
* `longitude` (DECIMAL 11,8)
* `point` (POINT, SPATIAL)
* `status` (ENUM: 'draft', 'published')

### D. Tabel `events` (Kalender Acara)
Menyimpan kegiatan atau festival musiman.
* `id` (INT, PK, Auto Increment)
* `village_id` (INT, FK ke villages.id)
* `destination_id` (INT, FK ke destinations.id, Nullable)
* `title` (VARCHAR)
* `slug` (VARCHAR, Unique)
* `description` (JSON) - *Mendukung Multi-bahasa (i18n).*
* `start_date` (DATE)
* `end_date` (DATE)
* `start_time` (TIME, Nullable)
* `end_time` (TIME, Nullable)
* `ticket_price` (DECIMAL 10,2, Default 0)
* `organizer` (VARCHAR)
* `instagram` (VARCHAR, Nullable)
* `contact_person` (VARCHAR)
* `status` (ENUM: 'draft', 'published')

### E. Tabel `media` (Manajemen Aset)
*Catatan: Jika menggunakan `spatie/laravel-medialibrary`, tabel ini akan di-generate otomatis.*
* `id` (INT, PK, Auto Increment)
* `mediable_id` (INT)
* `mediable_type` (VARCHAR) - *Contoh: App\Models\Destination*
* `file_path` (VARCHAR)
* `alt_text` (VARCHAR) - *Penting untuk SEO.*
* `is_primary` (BOOLEAN) - *Penanda cover/thumbnail utama.*

---

## 🚀 3. Fitur Inti yang Disediakan
1.  **Role-Based Access Control (RBAC):** Pemisahan tegas antara Super Admin (yang bisa melihat dan mengatur semua desa) dan Manager/Admin Desa (yang hak akses CRUD-nya terkunci hanya untuk `village_id` miliknya).
2.  **Sistem Spasial Peta (WebGIS Ringan):** Penggunaan tipe data `POINT` memungkinkan website menampilkan semua destinasi dalam satu peta interaktif besar, sekaligus mendukung query "Wisata Terdekat".
3.  **Kalender Pariwisata:** Pengunjung web dapat memfilter event berdasarkan bulan berjalan.
4.  **Multi-bahasa (i18n) via JSON:** Kolom deskripsi menggunakan JSON agar siap disajikan dalam Bahasa Indonesia dan Inggris tanpa perlu merombak tabel. (optional/diakhir saja untuk sekarang fokus ke bahasa indo saja)
5.  **SEO Optimized (SSR):** Penggunaan Inertia React dengan SSR memastikan seluruh metadata dan teks multi-bahasa ter-render di sisi server sehingga Google Bot dapat merayapi situs dengan sempurna.

---

## 💡 4. Saran & Hal Penting Lainnya (Vervo Standard)

* **Implementasi Media Library:** Sangat disarankan untuk langsung memakai package `spatie/laravel-medialibrary`. Jangan membuat *upload logic* dari awal. Package ini sudah sangat matang untuk mengurus relasi *polymorphic*, *auto-resize* gambar untuk thumbnail, dan integrasi cloud storage (jika ke depannya butuh S3).
* **Pendekatan UI Form:** Karena skemanya sudah sangat *flat*, buat UI panel admin menggunakan komponen React yang intuitif. Gunakan *Map Picker* (misal: Leaflet) di form agar admin desa cukup geser pin di peta, dan kolom `latitude` & `longitude` otomatis terisi.
* **Field JSON:** Pastikan saat membuat migration di Laravel, kolom `description` (di tabel `villages`, `destinations`, `events`) serta `facilities` (di tabel `destinations`) menggunakan `$table->json('nama_kolom')`, bukan sekadar `text`. Ini penting untuk paket translasi Spatie.
* **Akurasi Titik:** Mengingat kontur geografis daerah Mrebet yang bervariasi (menuju arah lereng Gunung Slamet), pastikan pin peta pada database diset seakurat mungkin karena ini akan terhubung langsung dengan tombol "Get Directions" yang mengarah ke Google Maps wisatawan.