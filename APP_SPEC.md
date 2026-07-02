# Skema Database — Web Desa Wisata Kecamatan Mrebet
**Stack:** Laravel + MySQL 8.0 (InnoDB) + Inertia.js (React, SSR)
**Prinsip desain:** denormalized, simple, mudah diinput oleh Admin Desa (Pokdarwis), mendukung i18n (JSON untuk deskripsi), mendukung data spasial (POINT) langsung di tabel utama, soft-delete pada tabel konten publik.

---

## 0. Catatan Teknis Penting Sebelum Migration

1. **i18n via JSON untuk Deskripsi**
   - Kolom deskripsi (`description`) disimpan sebagai `JSON` dengan format `{"id": "...", "en": "..."}`.
   - Kolom nama (`name`) JANGAN menggunakan format JSON agar mempermudah pencarian (search) dan pengurutan (sorting) secara langsung tanpa generated columns. Nama tempat menggunakan `VARCHAR` biasa.

2. **Kolom Spasial (`POINT`)**
   - Kolom `point` (SPATIAL POINT) diletakkan langsung di dalam tabel `villages` dan `destinations` untuk menyederhanakan query.
   - Di InnoDB, `SPATIAL INDEX` mewajibkan kolom `NOT NULL`. Default value bisa diset via Observer/Trigger dari nilai `latitude` dan `longitude` saat insert/update:
     ```sql
     point POINT NOT NULL SRID 4326,
     SPATIAL INDEX idx_point (point)
     ```

3. **Soft Delete**
   - Digunakan pada `villages`, `destinations`, dan `events` agar data tidak langsung hilang permanen jika tidak sengaja terhapus.

4. **Media (Polymorphic)**
   - Menggunakan tabel polymorphic `media` untuk menyimpan foto-foto galeri. Hal ini mempermudah integrasi dengan package seperti `spatie/laravel-medialibrary`.

---

## 1. Autentikasi & Otorisasi

### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT UNSIGNED PK AI | |
| full_name | VARCHAR(150) | |
| email | VARCHAR(150) UNIQUE | |
| phone_number | VARCHAR(15) UNIQUE | |
| password | VARCHAR(255) | |
| email_verified_at | TIMESTAMP NULL | |
| avatar | VARCHAR(255) NULL | Path file foto profil |
| role | ENUM('admin','manager') | Admin (Super Admin) / Manager (Admin Desa) |
| village_id | BIGINT UNSIGNED NULL FK → villages.id | Terisi jika role = 'manager' (mengelola desa tertentu) |
| is_active | BOOLEAN DEFAULT TRUE | |
| remember_token | VARCHAR(100) NULL | |
| created_at / updated_at | | | 

---

## 2. Wilayah & Master Desa

### `villages`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT UNSIGNED PK AI | |
| name | VARCHAR(150) | Nama desa (misal: "Serang") |
| slug | VARCHAR(160) UNIQUE | |
| description | JSON | i18n untuk deskripsi panjang |
| head_name | VARCHAR(150) NULL | Nama Kepala Desa / Pengelola |
| contact_phone | VARCHAR(20) NULL | Nomor kontak |
| latitude | DECIMAL(10,8) NULL | Koordinat latitude |
| longitude | DECIMAL(11,8) NULL | Koordinat longitude |
| point | POINT NOT NULL SRID 4326 | Data spasial (SPATIAL INDEX) |
| status | ENUM('draft','published') DEFAULT 'draft' | |
| created_at / updated_at / deleted_at | | Soft deletes |

---

## 3. Destinasi Wisata

### `destinations`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT UNSIGNED PK AI | |
| village_id | BIGINT UNSIGNED FK → villages.id | Relasi ke desa |
| name | VARCHAR(150) | Nama destinasi (misal: "Lembah Asri") |
| slug | VARCHAR(160) UNIQUE | |
| category | ENUM('alam','budaya','buatan') | Kategori utama |
| description | JSON | i18n untuk deskripsi panjang |
| ticket_price | DECIMAL(10,2) DEFAULT 0.00 | Harga tiket standar |
| ticket_info | TEXT NULL | Informasi tambahan tiket (misal: "Parkir Rp2.000, rombongan diskon 10%") |
| open_time | TIME NULL | Jam buka |
| close_time | TIME NULL | Jam tutup |
| operational_days | VARCHAR(150) NULL | Hari operasional bebas diisi (misal: "Setiap Hari", "Sabtu - Minggu") |
| facilities | JSON NULL | Array fasilitas (misal: `["Toilet", "Mushola", "Parkir", "Warung"]`) |
| latitude | DECIMAL(10,8) NULL | |
| longitude | DECIMAL(11,8) NULL | |
| point | POINT NOT NULL SRID 4326 | Data spasial (SPATIAL INDEX) |
| status | ENUM('draft','published') DEFAULT 'draft' | |
| created_at / updated_at / deleted_at | | Soft deletes |

---

## 4. Media (Foto/Galeri Polymorphic)

### `media`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT UNSIGNED PK AI | |
| mediable_id | BIGINT UNSIGNED | |
| mediable_type | VARCHAR(255) | `App\Models\Village` / `App\Models\Destination` / `App\Models\Event` |
| file_path | VARCHAR(255) | Path file media |
| alt_text | VARCHAR(255) NULL | Alt text untuk SEO |
| is_primary | BOOLEAN DEFAULT FALSE | Cover/Thumbnail utama |
| created_at / updated_at | | |

---

## 5. Event Management (Kalender Wisata)

### `events`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT UNSIGNED PK AI | |
| village_id | BIGINT UNSIGNED NULL FK → villages.id | Relasi opsional ke desa |
| destination_id | BIGINT UNSIGNED NULL FK → destinations.id | Relasi opsional ke destinasi |
| title | VARCHAR(150) | Judul event |
| slug | VARCHAR(180) UNIQUE | |
| description | JSON | i18n deskripsi event |
| start_date | DATE | Tanggal mulai |
| end_date | DATE NULL | Tanggal selesai |
| start_time | TIME NULL | Waktu mulai |
| end_time | TIME NULL | Waktu selesai |
| ticket_price | DECIMAL(10,2) DEFAULT 0.00 | Harga tiket masuk event jika ada |
| organizer | VARCHAR(150) NULL | Penyelenggara |
| contact_person | VARCHAR(150) NULL | Kontak person |
| status | ENUM('draft','published') DEFAULT 'draft' | |
| created_at / updated_at / deleted_at | | Soft deletes |

---

## 6. Diagram Relasi

```
villages (1) ─── (*) destinations
   │                  │
   └─────── (1) ──────┘ (FK village_id)

villages (1) ─── (*) users (FK village_id, nullable)
villages (1) ─── (*) events (FK village_id, nullable)
destinations (1) ─── (*) events (FK destination_id, nullable)

villages / destinations / events ─── (polymorphic) ───> media
```

---

## 7. Ringkasan Keputusan Desain

1. **Denormalisasi untuk Kemudahan UX Admin**: 
   - Jam operasional, tiket, koordinat lokasi, dan fasilitas dijadikan satu form input panjang di halaman edit/tambah desa atau destinasi. Tidak ada tab/modul terpisah.
2. **5 Tabel Utama**:
   - Skema dipangkas drastis dari 11 tabel menjadi 5 tabel utama: `users`, `villages`, `destinations`, `events`, dan `media`.
3. **Penyimpanan Fasilitas via JSON**:
   - Fasilitas disimpan sebagai array JSON sederhana (`["Mushola", "Toilet"]`), yang di Laravel langsung di-cast sebagai array.
4. **Pencarian Nama yang Cepat**:
   - Kolom nama menggunakan VARCHAR biasa tanpa i18n JSON agar pencarian (query `WHERE name LIKE %...%`) tetap berjalan sangat cepat dan sederhana tanpa generated column.