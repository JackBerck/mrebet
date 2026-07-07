# Requirements Document

## Introduction

Fitur **Public Pages** adalah kumpulan halaman publik yang dapat diakses oleh pengunjung (wisatawan) pada website Desa Wisata Kecamatan Mrebet, Kabupaten Purbalingga, Jawa Tengah. Fitur ini mencakup tiga area utama berdasarkan prioritas:

1. **Autentikasi** — Halaman login untuk admin dan manager menggunakan Laravel Fortify yang sudah terpasang. Self-register publik tidak diizinkan; pembuatan akun hanya dilakukan oleh admin melalui panel admin.
2. **Layout Publik** — Navbar responsif dan footer yang mengimplementasikan style guide *Rustic Modern Nature* (warna OKLCH, font Fraunces + Inter), mendukung breakpoint mobile/tablet/desktop.
3. **Halaman Home** — Halaman beranda utama dengan semua section yang di-port dari desain referensi `temp/index.html` ke komponen React + Inertia dengan data dinamis dari backend Laravel.

Stack: Laravel 13 + React 19 (Inertia v3) + Tailwind CSS v4. Data bersumber dari tabel `villages`, `destinations`, `events`, `blogs`, dan `media` (polymorphic).

---

## Glossary

- **Public_Layout**: Layout wrapper React yang membungkus semua halaman publik, terdiri dari `PublicNavbar` dan `PublicFooter`.
- **PublicNavbar**: Komponen navigasi utama publik yang responsif, mendukung mobile hamburger menu dan desktop nav links.
- **PublicFooter**: Komponen footer publik berisi link navigasi sekunder, info kontak, dan tautan footer pages.
- **Home_Page**: Halaman beranda `/` (root) yang menampilkan semua section promosi destinasi wisata Mrebet.
- **Login_Page**: Halaman `/login` yang merender form autentikasi Laravel Fortify melalui komponen React Inertia.
- **Auth_Controller**: Controller Fortify yang sudah ada, menangani POST `/login` dan POST `/logout`.
- **HomeController**: Controller Laravel baru di `App\Http\Controllers\Public\HomeController` yang menyediakan data untuk Home_Page.
- **PublicController**: Base abstraction untuk semua public page controllers di `App\Http\Controllers\Public\`.
- **Visitor**: Pengguna anonim yang mengakses halaman publik tanpa autentikasi.
- **Admin**: Pengguna dengan `role = 'admin'` (Super Admin Kecamatan) yang dapat mengelola semua data.
- **Manager**: Pengguna dengan `role = 'manager'` (Admin Desa) yang hanya dapat mengelola data desa miliknya.
- **Hero_Section**: Section pertama Home_Page dengan background image fullscreen, tagline puitis, dan quick-bar info.
- **MustSee_Strip**: Section chip/pill destinasi populer di bawah Hero_Section.
- **Discover_Section**: Section "Tentang Mrebet" dengan narasi dan statistik kecamatan.
- **Destinations_Section**: Section grid kartu destinasi unggulan.
- **Activities_Section**: Section grid ikon 6 kategori aktivitas wisata.
- **WhyVisit_Section**: Section highlight statistik angka.
- **Gallery_Section**: Section masonry grid foto dari media destinasi/desa.
- **Events_Section**: Section daftar acara mendatang dari tabel `events`.
- **Testimonials_Section**: Section slider kutipan pengunjung (statis/hardcoded).
- **Visit_Section**: Section informasi kunjungan dengan peta mini Leaflet dan QR code.
- **ContentStatus**: Enum PHP `App\Enums\ContentStatus` dengan nilai `draft` dan `published`.
- **DestinationCategory**: Enum PHP `App\Enums\DestinationCategory` dengan nilai `alam`, `budaya`, `buatan`.
- **MediaItem**: Tipe TypeScript untuk record polymorphic dari tabel `media`, berisi `file_path`, `alt_text`, `is_primary`.
- **Wayfinder**: Package `laravel/wayfinder` yang men-generate fungsi TypeScript typed dari controller/route Laravel.

---

## Requirements

### Requirement 1: Halaman Login Admin/Manager

**User Story:** Sebagai admin atau manager, saya ingin dapat login ke sistem melalui halaman login yang dirancang sesuai brand Wisata Mrebet, sehingga saya bisa mengakses panel admin untuk mengelola konten.

#### Acceptance Criteria

1. WHEN pengguna mengunjungi `/login`, THE Login_Page SHALL merender form dengan field `email` (type email) dan `password` (type password).
2. WHEN pengguna mengirimkan form login dengan kredensial valid, THE Auth_Controller SHALL mengautentikasi pengguna dan mengarahkan ke `/admin/dashboard`.
3. WHEN pengguna mengirimkan form login dengan kredensial tidak valid, THE Login_Page SHALL menampilkan pesan error validasi di bawah field yang bersangkutan tanpa melakukan full page reload.
4. THE Login_Page SHALL merender dalam Auth_Layout yang menggunakan palet warna `--cream-warm` sebagai background dan font Fraunces untuk heading judul halaman.
5. WHEN pengguna yang sudah terautentikasi mengunjungi `/login`, THE Auth_Controller SHALL mengarahkan pengguna ke `/admin/dashboard`.
6. THE Login_Page SHALL menampilkan tombol "Masuk" dengan styling `btn-forest` yang memiliki area sentuh minimal 44px (sesuai standar aksesibilitas).
7. IF jaringan gagal saat pengiriman form, THEN THE Login_Page SHALL menampilkan pesan error generik tanpa mengekspos detail teknis.
8. THE Login_Page SHALL menyertakan atribut `autocomplete="email"` pada field email dan `autocomplete="current-password"` pada field password untuk mendukung password manager.
9. WHEN pengguna mengklik link "Lupa Password", THE Login_Page SHALL menavigasi ke halaman `/forgot-password` yang sudah disediakan oleh Fortify.

---

### Requirement 2: Pembatasan Self-Register Publik

**User Story:** Sebagai admin sistem, saya ingin memastikan pengunjung publik tidak dapat membuat akun sendiri, sehingga akses ke panel admin tetap terkontrol.

#### Acceptance Criteria

1. THE Public_Layout SHALL tidak menampilkan tautan atau tombol menuju halaman registrasi (`/register`) pada navbar maupun footer publik.
2. WHEN pengguna anonim mengunjungi `/register` secara langsung, THE Auth_Controller SHALL mengembalikan respons HTTP 404.
3. THE Login_Page SHALL tidak menampilkan tautan "Daftar" atau "Sign up" yang mengarah ke `/register`.

---

### Requirement 3: Layout Publik — Navbar Responsif

**User Story:** Sebagai pengunjung, saya ingin dapat menavigasi website dengan mudah dari perangkat apapun (mobile, tablet, desktop), sehingga saya dapat menemukan informasi wisata yang diinginkan.

#### Acceptance Criteria

1. THE PublicNavbar SHALL merender logo "Wisata Mrebet" (ikon SVG + teks) di sisi kiri yang merupakan tautan ke halaman beranda `/`.
2. THE PublicNavbar SHALL menampilkan menu navigasi utama dengan 7 tautan: "Beranda", "Desa Wisata", "Destinasi", "Peta Wisata", "Acara", "Blog", dan "Tentang & Kontak".
3. THE PublicNavbar SHALL menampilkan tombol "Book Now" yang menghubungkan ke WhatsApp nomor `6281398480422` dengan pesan pre-filled dalam format `wa.me` link.
4. WHILE lebar viewport kurang dari 768px (breakpoint `md`), THE PublicNavbar SHALL menyembunyikan menu navigasi dan menampilkan tombol hamburger dengan aria-label "Buka menu".
5. WHEN pengguna mengklik tombol hamburger pada mobile, THE PublicNavbar SHALL menampilkan menu navigasi dalam panel slide-down atau drawer dengan animasi transisi yang halus.
6. WHEN pengguna mengklik tautan di dalam menu mobile, THE PublicNavbar SHALL menutup menu mobile secara otomatis.
7. WHILE pengguna scroll melewati 80px dari atas halaman, THE PublicNavbar SHALL menambahkan efek backdrop-blur dan mengurangi transparansi background (transisi `0.3s ease`).
8. THE PublicNavbar SHALL memenuhi standar aksesibilitas WCAG 2.1 Level AA, termasuk: atribut `role="banner"` pada elemen `<header>`, `role="navigation"` dengan `aria-label="Navigasi utama"` pada elemen `<nav>`, dan `aria-expanded` yang diperbarui pada tombol hamburger.
9. THE PublicNavbar SHALL menggunakan komponen `Link` dari `@inertiajs/react` (bukan `<a>` biasa) untuk semua tautan internal guna mendukung navigasi SPA tanpa full reload.

---

### Requirement 4: Layout Publik — Footer

**User Story:** Sebagai pengunjung, saya ingin menemukan informasi kontak, tautan penting, dan tautan legal di footer, sehingga saya bisa dengan mudah menghubungi pengelola atau membaca kebijakan website.

#### Acceptance Criteria

1. THE PublicFooter SHALL menampilkan logo "Wisata Mrebet" dan deskripsi singkat Kecamatan Mrebet di kolom pertama.
2. THE PublicFooter SHALL menampilkan grup tautan navigasi utama (Beranda, Desa Wisata, Destinasi, Peta Wisata, Acara, Blog, Tentang).
3. THE PublicFooter SHALL menampilkan grup tautan halaman legal/opsional: FAQ, Kebijakan Privasi, Syarat & Ketentuan, Panduan Wisatawan, Kemitraan.
4. THE PublicFooter SHALL menampilkan informasi kontak: nomor telepon WhatsApp dan tautan ke Google Maps Kecamatan Mrebet.
5. THE PublicFooter SHALL menampilkan teks copyright dengan tahun berjalan yang dihasilkan secara dinamis.
6. THE PublicFooter SHALL menggunakan warna background `--forest-deep` dengan teks berwarna `--cream-warm` untuk menciptakan kontras yang sesuai standar WCAG AA (rasio kontras minimal 4.5:1).
7. WHILE lebar viewport kurang dari 768px, THE PublicFooter SHALL menumpuk semua kolom secara vertikal (single-column layout).

---

### Requirement 5: Home Page — Hero Section

**User Story:** Sebagai pengunjung yang baru pertama kali membuka website, saya ingin melihat tampilan hero yang memukau dengan foto latar alam Mrebet dan tagline yang menarik, sehingga saya langsung mendapatkan kesan pertama yang kuat tentang destinasi ini.

#### Acceptance Criteria

1. THE Hero_Section SHALL merender gambar latar fullscreen dengan `object-fit: cover` menggunakan gambar hero dari media collection desa atau fallback ke gambar statis.
2. THE Hero_Section SHALL menampilkan eyebrow text "Purbalingga, Jawa Tengah" di atas judul utama.
3. THE Hero_Section SHALL menampilkan judul utama (H1) dengan font Fraunces, ukuran responsif `clamp(2.25rem, 5vw, 4.5rem)`, berisi tagline dari desain referensi atau data `villages.description` yang di-truncate.
4. THE Hero_Section SHALL menampilkan dua tombol CTA: tombol utama "Jelajahi Mrebet" (styling `btn-gold`) yang scroll ke Destinations_Section, dan tombol sekunder "Tonton Video" dengan ikon play circle.
5. THE Hero_Section SHALL menampilkan quick-bar berisi 4 item informasi: Rute (tautan Google Maps), Jelajah (jumlah destinasi dinamis dari DB), Jam Buka (06.00–17.00 WIB statis), dan Akses Cepat (QR code website).
6. WHEN HomeController memuat halaman beranda, THE HomeController SHALL menyertakan `destinations_count` dalam props Inertia yang merepresentasikan jumlah destinasi dengan `status = 'published'`.
7. THE Hero_Section SHALL menampilkan indikator scroll animasi ("Scroll" + garis animasi) di bagian bawah section.
8. THE Hero_Section SHALL menggunakan `loading="eager"` dan `fetchpriority="high"` pada tag `<img>` hero untuk optimasi LCP (Largest Contentful Paint).

---

### Requirement 6: Home Page — MustSee Strip

**User Story:** Sebagai pengunjung, saya ingin melihat daftar destinasi paling populer dalam format chip yang ringkas tepat di bawah hero, sehingga saya bisa langsung mengetahui destinasi unggulan.

#### Acceptance Criteria

1. THE MustSee_Strip SHALL merender deretan chip/pill destinasi menggunakan data `destinations` dengan `status = 'published'`, diurutkan berdasarkan `created_at` descending, dibatasi maksimal 8 item.
2. WHEN HomeController memuat data untuk MustSee_Strip, THE HomeController SHALL mengirimkan array `featuredDestinations` berisi `id`, `name`, `slug`, `latitude`, `longitude`, dan `primary_media` dari tabel `destinations`.
3. THE MustSee_Strip SHALL menampilkan thumbnail gambar berukuran 30×30px dengan `border-radius: 50%` dan nama destinasi di setiap chip.
4. WHEN pengunjung mengklik chip destinasi, THE MustSee_Strip SHALL membuka tautan Google Maps dengan query nama destinasi dalam tab baru (`target="_blank" rel="noopener"`).
5. THE MustSee_Strip SHALL memiliki label "Wajib Dikunjungi" di sisi kiri pada viewport desktop.
6. WHILE lebar viewport kurang dari 640px, THE MustSee_Strip SHALL memungkinkan scroll horizontal pada deretan chip tanpa menampilkan scrollbar (overflow-x: auto, scrollbar-width: none).

---

### Requirement 7: Home Page — Discover Section

**User Story:** Sebagai pengunjung, saya ingin membaca narasi singkat tentang Mrebet beserta statistik menarik, sehingga saya mendapatkan gambaran konteks dan keunikan destinasi ini.

#### Acceptance Criteria

1. THE Discover_Section SHALL menampilkan heading "Tentang Mrebet" (eyebrow) dan H2 naratif dengan font Fraunces.
2. THE Discover_Section SHALL menampilkan dua paragraf teks deskripsi yang diambil dari `villages.description` desa dengan `status = 'published'` pertama, atau fallback ke teks statis jika data kosong.
3. THE Discover_Section SHALL menampilkan tiga statistik dalam grid: jumlah curug/destinasi aktif (dinamis dari DB `destinations` count), ketinggian "450m" (statis), dan suhu rata-rata "18°C" (statis).
4. THE Discover_Section SHALL merender dua gambar dalam layout overlap: gambar utama dan gambar float yang diambil dari `media` desa dengan `is_primary = false`, atau fallback ke aset statis.
5. WHEN HomeController memuat Discover_Section, THE HomeController SHALL menyertakan `villageProfile` dalam props berisi `description`, `name`, dan `media` dari desa pertama yang dipublikasikan.

---

### Requirement 8: Home Page — Destinations Section

**User Story:** Sebagai pengunjung, saya ingin melihat kartu-kartu destinasi unggulan dengan foto, nomor urut, nama, deskripsi singkat, dan tautan peta, sehingga saya bisa memilih destinasi yang ingin dikunjungi.

#### Acceptance Criteria

1. THE Destinations_Section SHALL merender grid kartu destinasi menggunakan data dari HomeController dengan maksimal 6 destinasi (`status = 'published'`, diurutkan `created_at` descending).
2. WHEN HomeController menyiapkan data Destinations_Section, THE HomeController SHALL mengirimkan `featuredDestinations` berisi `id`, `name`, `slug`, `description`, `category`, `latitude`, `longitude`, dan `primary_media`.
3. THE Destinations_Section SHALL menampilkan nomor urut 2-digit (01, 02, dst.) pada setiap kartu destinasi.
4. THE Destinations_Section SHALL menampilkan gambar destinasi dari `primary_media.file_path` dengan `alt` dari `primary_media.alt_text`, atau placeholder image jika media tidak ada.
5. THE Destinations_Section SHALL menampilkan tombol "Jelajahi" yang menggunakan komponen `Link` dari Inertia menuju halaman detail destinasi `/destinasi/{slug}`.
6. THE Destinations_Section SHALL menampilkan tombol "Lihat di Peta" yang membuka Google Maps Directions dengan koordinat `latitude` dan `longitude` destinasi dalam tab baru.
7. WHEN pengguna menghover kartu destinasi pada viewport desktop, THE Destinations_Section SHALL menerapkan efek `translateY(-4px)` dengan transisi `0.4s cubic-bezier(0.19, 1, 0.22, 1)` sesuai style guide.
8. THE Destinations_Section SHALL menampilkan heading section: eyebrow "Destinasi Pilihan" dan H2 dengan font Fraunces.

---

### Requirement 9: Home Page — Activities Section

**User Story:** Sebagai pengunjung, saya ingin melihat jenis-jenis aktivitas yang tersedia di Mrebet dalam format visual yang menarik, sehingga saya bisa merencanakan jenis pengalaman yang diinginkan.

#### Acceptance Criteria

1. THE Activities_Section SHALL merender tepat 6 kartu aktivitas statis: Camping, Hiking, Sunrise, Fotografi, Kuliner Lokal, dan Adventure.
2. THE Activities_Section SHALL menampilkan ikon SVG unik, judul aktivitas (H4), dan deskripsi singkat (1-2 kalimat) untuk setiap kartu aktivitas.
3. THE Activities_Section SHALL menampilkan heading section: eyebrow "Pengalaman" dan H2 dengan font Fraunces.
4. WHILE lebar viewport lebih dari atau sama dengan 768px, THE Activities_Section SHALL menampilkan kartu dalam grid 3 kolom.
5. WHILE lebar viewport kurang dari 768px, THE Activities_Section SHALL menampilkan kartu dalam grid 2 kolom.

---

### Requirement 10: Home Page — WhyVisit Section

**User Story:** Sebagai pengunjung, saya ingin melihat statistik kunci tentang Mrebet dalam tampilan yang menonjol, sehingga saya semakin yakin untuk mengunjungi destinasi ini.

#### Acceptance Criteria

1. THE WhyVisit_Section SHALL menampilkan heading: eyebrow "Mengapa Mrebet" dan H2 dengan font Fraunces.
2. THE WhyVisit_Section SHALL merender 4 item statistik dengan data: jumlah destinasi aktif (dinamis dari DB), rating pengunjung "4.9" (statis), jarak "3 Jam dari Purwokerto" (statis), dan "12+ Titik Foto Ikonik" (statis).
3. WHEN HomeController menyiapkan props untuk WhyVisit_Section, THE HomeController SHALL menyertakan `destinationsCount` sebagai integer yang merepresentasikan total destinasi dengan `status = 'published'`.
4. THE WhyVisit_Section SHALL menampilkan ikon SVG dan label deskriptif di bawah setiap angka statistik.

---

### Requirement 11: Home Page — Gallery Section

**User Story:** Sebagai pengunjung, saya ingin melihat galeri foto keindahan Mrebet dalam layout masonry yang menarik, sehingga saya mendapatkan visual preview yang kuat sebelum berkunjung.

#### Acceptance Criteria

1. THE Gallery_Section SHALL merender grid masonry berisi maksimal 6 gambar yang diambil dari tabel `media` yang berelasi ke model `Destination` atau `Village` dengan `status = 'published'`, diurutkan `created_at` descending.
2. WHEN HomeController menyiapkan Gallery_Section, THE HomeController SHALL menyertakan `galleryMedia` berisi array maksimal 6 item dengan `file_path`, `alt_text`, dan nama relasi (caption).
3. THE Gallery_Section SHALL menampilkan caption di bawah atau overlay setiap gambar menggunakan `alt_text` dari MediaItem atau nama destinasi/desa yang berelasi.
4. THE Gallery_Section SHALL menggunakan `loading="lazy"` pada semua tag `<img>` dalam galeri.
5. THE Gallery_Section SHALL menampilkan heading section: eyebrow "Galeri" dan H2 dengan font Fraunces.

---

### Requirement 12: Home Page — Events Section

**User Story:** Sebagai pengunjung, saya ingin melihat daftar acara wisata mendatang, sehingga saya bisa merencanakan kunjungan bertepatan dengan festival atau event spesial.

#### Acceptance Criteria

1. THE Events_Section SHALL merender daftar maksimal 4 event dengan `status = 'published'` dan `start_date >= CURDATE()`, diurutkan `start_date` ascending.
2. WHEN HomeController menyiapkan Events_Section, THE HomeController SHALL mengirimkan `upcomingEvents` berisi `id`, `title`, `slug`, `start_date`, `organizer`, `village` (relasi), dan `primary_media`.
3. THE Events_Section SHALL menampilkan tanggal event dalam format dua baris: hari (angka) dan bulan (nama bulan Bahasa Indonesia).
4. THE Events_Section SHALL menampilkan judul event, deskripsi singkat (maksimal 100 karakter, dengan truncation "..."), dan tag kategori yang diambil dari `organizer` atau label statis.
5. THE Events_Section SHALL menampilkan heading section: eyebrow "Acara Mendatang" dan H2 dengan font Fraunces.
6. IF tidak ada event mendatang yang dipublikasikan, THEN THE Events_Section SHALL menampilkan pesan "Belum ada acara mendatang. Pantau terus!" sebagai pengganti daftar kosong.
7. THE Events_Section SHALL menampilkan ikon panah (→) sebagai indikator tautan di setiap baris event yang menggunakan komponen `Link` Inertia menuju halaman detail event.

---

### Requirement 13: Home Page — Testimonials Section

**User Story:** Sebagai pengunjung, saya ingin membaca testimoni dari pengunjung sebelumnya, sehingga saya semakin percaya tentang kualitas pengalaman di Mrebet.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL merender slider testimoni dengan data statis minimum 3 kutipan pengunjung (nama, peran, kutipan teks).
2. THE Testimonials_Section SHALL menampilkan indikator titik (dot indicators) di bawah slider untuk navigasi antar slide.
3. WHEN pengguna mengklik dot indicator, THE Testimonials_Section SHALL menampilkan slide yang sesuai dengan animasi transisi horizontal.
4. THE Testimonials_Section SHALL menampilkan foto avatar peserta testimoni (dapat berupa gambar statis dari `public/` folder) dengan teks nama dan peran di bawah kutipan.
5. THE Testimonials_Section SHALL memiliki minimal `aria-label="Navigasi testimoni"` pada container dot indicators untuk aksesibilitas.

---

### Requirement 14: Home Page — Visit/Contact Section

**User Story:** Sebagai pengunjung, saya ingin melihat informasi cara menuju dan menghubungi pengelola Wisata Mrebet, termasuk peta mini dan QR code, sehingga saya bisa dengan mudah merencanakan perjalanan.

#### Acceptance Criteria

1. THE Visit_Section SHALL menampilkan informasi lokasi: nama kecamatan, kabupaten, dan provinsi dari data `villages` atau statis.
2. THE Visit_Section SHALL menampilkan informasi jam operasional "06.00–17.00 WIB, setiap hari" (statis).
3. THE Visit_Section SHALL menampilkan tombol "Book Now" yang merupakan tautan WhatsApp ke nomor `6281398480422` dengan pesan pre-filled.
4. THE Visit_Section SHALL merender peta mini interaktif Leaflet dengan pin lokasi koordinat kecamatan Mrebet (`-7.3168897, 109.3491433`) dan zoom level 13.
5. THE Visit_Section SHALL menampilkan QR code yang dihasilkan secara dinamis menggunakan external API `api.qrserver.com` dengan URL target website.
6. IF library Leaflet belum ter-load (SSR/hydration), THEN THE Visit_Section SHALL merender placeholder skeleton dengan dimensi yang sama hingga Leaflet selesai di-mount di sisi klien (dynamic import dengan `ssr: false`).
7. THE Visit_Section SHALL menampilkan heading: eyebrow "Rencanakan Kunjungan" dan H2 dengan font Fraunces.

---

### Requirement 15: Home Page — Controller & Data Loading

**User Story:** Sebagai developer, saya ingin HomeController menyediakan semua data yang dibutuhkan halaman beranda dalam satu request yang efisien, sehingga performa halaman optimal dan tidak terjadi N+1 query.

#### Acceptance Criteria

1. THE HomeController SHALL mengimplementasikan method `index()` yang mengembalikan `Inertia::render('Public/Home', [...props])`.
2. WHEN HomeController memuat data, THE HomeController SHALL menggunakan Eloquent eager loading (`with()`) untuk semua relasi `media` guna menghindari N+1 query problem.
3. THE HomeController SHALL hanya memuat record dengan `status = ContentStatus::Published` untuk semua query destinasi, event, village, dan blog.
4. THE HomeController SHALL membatasi kolom yang di-select hanya pada kolom yang dibutuhkan halaman (bukan `SELECT *`) untuk mengoptimalkan transfer data.
5. THE HomeController SHALL mengirimkan `destinationsCount` (integer), `featuredDestinations` (array max 6), `upcomingEvents` (array max 4), `villageProfile` (object atau null), dan `galleryMedia` (array max 6) sebagai props Inertia.
6. IF query ke database gagal, THEN THE HomeController SHALL mengembalikan respons dengan props minimal (array kosong) dan mencatat error ke Laravel Log tanpa meneruskan exception ke pengunjung.

---

### Requirement 16: Responsivitas Mobile-First

**User Story:** Sebagai pengunjung yang mengakses dari smartphone, saya ingin semua halaman publik tampil dengan baik dan mudah digunakan, sehingga saya mendapatkan pengalaman yang nyaman di layar kecil.

#### Acceptance Criteria

1. THE Public_Layout SHALL mengimplementasikan pendekatan mobile-first dengan breakpoint Tailwind: default (mobile < 640px), `sm` (≥ 640px), `md` (≥ 768px), `lg` (≥ 1024px), `xl` (≥ 1280px).
2. THE Home_Page SHALL menggunakan container `max-w-7xl mx-auto` dengan padding horizontal responsif `px-4 sm:px-6 lg:px-8` pada semua section.
3. THE Destinations_Section SHALL menampilkan kartu dalam 1 kolom pada mobile, 2 kolom pada `md`, dan 3 kolom pada `lg`.
4. THE Hero_Section SHALL menyesuaikan ukuran teks judul secara fluid menggunakan `clamp()` agar terbaca di semua ukuran layar.
5. WHILE lebar viewport kurang dari 640px, THE Activities_Section SHALL menampilkan grid 2 kolom; pada `md` ke atas, SHALL menampilkan grid 3 kolom.
6. THE Gallery_Section SHALL menggunakan CSS columns atau CSS grid dengan layout masonry: 2 kolom pada mobile, 3 kolom pada `md` ke atas.
7. THE Visit_Section SHALL menampilkan peta mini dan informasi kontak dalam satu kolom vertikal pada mobile, dan dua kolom berdampingan pada `lg` ke atas.
8. THE PublicNavbar SHALL memastikan semua touch target (tautan dan tombol) memiliki area minimal 44×44px sesuai standar WCAG 2.1 Success Criterion 2.5.5.

---

### Requirement 17: Performa & SEO Halaman Publik

**User Story:** Sebagai pengelola website, saya ingin halaman publik memiliki meta tag SEO yang benar dan performa loading yang baik, sehingga website mudah ditemukan melalui mesin pencari dan memberikan pengalaman cepat kepada pengunjung.

#### Acceptance Criteria

1. THE Home_Page SHALL menggunakan komponen `<Head>` dari `@inertiajs/react` untuk mendeklarasikan `<title>` dengan format "Wisata Mrebet — Temukan Curug, Temukan Diri" dan `<meta name="description">` yang informatif.
2. THE Login_Page SHALL menggunakan komponen `<Head>` dari `@inertiajs/react` untuk mendeklarasikan `<title>` "Masuk — Wisata Mrebet".
3. THE Home_Page SHALL menggunakan tag heading hierarkis yang benar: satu `<h1>` di Hero_Section, dan `<h2>` di setiap section utama, tanpa melewati level heading.
4. THE Public_Layout SHALL memastikan semua gambar yang dirender memiliki atribut `alt` yang deskriptif dan non-kosong.
5. THE Home_Page SHALL menggunakan atribut `loading="lazy"` untuk semua gambar di luar viewport awal (di bawah Hero_Section) dan `loading="eager"` khusus untuk gambar hero.
6. THE HomeController SHALL mengembalikan respons HTTP 200 untuk halaman beranda dengan header `Cache-Control: public, max-age=60` untuk mengaktifkan browser caching ringan.

