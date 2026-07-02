<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();
        $villageTangkisan = DB::table('villages')->where('slug', 'tangkisan')->first();

        $destinations = [
            [
                'village_id' => $villageOnje?->id,
                'name' => 'Wisata Religi & Sejarah Onje',
                'category' => 'budaya',
                'description' => 'Kompleks wisata sejarah dan religi yang mencakup Masjid Kuno Raden Sayyid Kuning (salah satu masjid tertua di Jawa Tengah, dibangun sekitar abad ke-16) dan Makam Adipati Onje II, peninggalan era Kadipaten yang menjadi cikal bakal Kabupaten Purbalingga.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis, infak sukarela untuk pemeliharaan situs cagar budaya.',
                'open_time' => '06:00:00',
                'close_time' => '18:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Areal Parkir', 'Masjid Bersejarah', 'Toilet Umum', 'Pemandu Lokal', 'Spot Foto'],
                'latitude' => -7.33412,
                'longitude' => 109.37190,
                'status' => 'published',
            ],
            [
                'village_id' => $villageTangkisan?->id ?? $villageOnje?->id,
                'name' => 'Wisata Tubing Sungai Klawing',
                'category' => 'alam',
                'description' => 'Aktivitas susur sungai Klawing yang memacu adrenalin dengan pemandangan alam hijau di kanan-kiri. Rute dimulai dari area Tangkisan dan berakhir di Desa Onje dengan total jarak tempuh sekitar 3-4 km. Cocok untuk keluarga dan grup wisata.',
                'ticket_price' => 50000.00,
                'ticket_info' => 'Harga per orang. Termasuk: sewa ban tubing, pelampung keselamatan, helm, pemandu, dan snack tradisional. Minimal 5 orang per sesi.',
                'open_time' => '08:00:00',
                'close_time' => '16:00:00',
                'operational_days' => 'Sabtu & Minggu (Weekday via reservasi kelompok)',
                'facilities' => ['Sewa Alat Tubing', 'Pemandu Bersertifikat', 'Kamar Bilas', 'Area Parkir', 'Warung Makan'],
                'latitude' => -7.33650,
                'longitude' => 109.37320,
                'status' => 'published',
            ],
            [
                'village_id' => $villageCipaku?->id,
                'name' => 'Kumpoel Green Sabin',
                'category' => 'buatan',
                'description' => 'Taman rekreasi buatan bertema agrowisata dan kuliner prasmanan di tengah sawah hijau dengan panorama langsung ke Gunung Slamet. Menawarkan kolam renang anak gratis, terapi ikan, kolam pemancingan kiloan, dan musik live setiap akhir pekan.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Masuk gratis sejak pertengahan 2024. Pengunjung membayar parkir (Rp 2.000 motor / Rp 5.000 mobil) dan makanan yang dipesan.',
                'open_time' => '10:00:00',
                'close_time' => '22:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Restoran Prasmanan', 'Kolam Renang Anak', 'Terapi Ikan', 'Kolam Pancing', 'Mushola', 'Gazebo', 'Live Music Weekend'],
                'latitude' => -7.31252,
                'longitude' => 109.32711,
                'status' => 'published',
            ],
            [
                'village_id' => $villageCipaku?->id,
                'name' => 'Situs Batu Tulis Cipaku',
                'category' => 'budaya',
                'description' => 'Situs cagar budaya prasejarah berupa batu besar purba berukir karakter huruf Jawa Kuno/Palawa yang diperkirakan berasal dari era Hindu-Buddha. Menjadi objek penelitian arkeologis dan destinasi wisata edukasi sejarah lokal yang penting di Purbalingga.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis, area terbuka publik 24 jam.',
                'open_time' => '00:00:00',
                'close_time' => '23:59:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Papan Informasi Sejarah', 'Toilet Umum', 'Jalan Setapak', 'Area Parkir Motor'],
                'latitude' => -7.31044,
                'longitude' => 109.32639,
                'status' => 'published',
            ],
            [
                'village_id' => $villageMrebet?->id,
                'name' => 'Masjid Muhammad Cheng Hoo Mrebet',
                'category' => 'budaya',
                'description' => 'Destinasi wisata religi ikonik dengan arsitektur unik perpaduan kelenteng Tionghoa dan nuansa Islami. Dibangun sebagai simbol harmoni budaya dan toleransi antar umat beragama, kini menjadi salah satu spot foto paling populer di Kecamatan Mrebet.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis, terbuka untuk ibadah dan kunjungan wisata religi.',
                'open_time' => '04:00:00',
                'close_time' => '22:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Parkir Luas', 'Rest Area', 'Toilet', 'Toko Souvenir & UMKM', 'Aula Pertemuan'],
                'latitude' => -7.31510,
                'longitude' => 109.34990,
                'status' => 'published',
            ],
            [
                'village_id' => $villageSerayuLarangan?->id,
                'name' => 'Balai Desa Serayu Larangan (Pusat Informasi Desa)',
                'category' => 'budaya',
                'description' => 'Pusat pelayanan dan informasi Desa Serayu Larangan yang menjadi percontohan nasional KPK RI dalam hal transparansi tata kelola pemerintahan desa. Pengunjung dapat melihat langsung sistem digitalisasi layanan publik dan laporan keuangan desa secara terbuka.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis, kunjungan pada jam kerja.',
                'open_time' => '08:00:00',
                'close_time' => '15:00:00',
                'operational_days' => 'Senin - Jumat',
                'facilities' => ['Ruang Informasi', 'Toilet', 'Parkir', 'Papan Informasi Publik Digital'],
                'latitude' => -7.29200,
                'longitude' => 109.33100,
                'status' => 'published',
            ],
            [
                'village_id' => $villagePengadegan?->id,
                'name' => 'Ekowisata Hutan Pinus Pengadegan',
                'category' => 'alam',
                'description' => 'Kawasan hutan pinus hijau di lereng Gunung Slamet yang menawarkan udara sejuk, jalur trekking ringan, dan spot foto estetik di antara rimbunnya pohon pinus. Cocok untuk piknik keluarga, foto prewedding, dan rekreasi alam.',
                'ticket_price' => 10000.00,
                'ticket_info' => 'Tiket masuk per orang. Parkir motor Rp 2.000, mobil Rp 5.000.',
                'open_time' => '07:00:00',
                'close_time' => '17:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Jalur Trekking', 'Area Piknik', 'Spot Foto', 'Toilet', 'Warung Kopi', 'Area Parkir'],
                'latitude' => -7.29800,
                'longitude' => 109.35400,
                'status' => 'published',
            ],
        ];

        foreach ($destinations as $data) {
            if (! $data['village_id']) {
                continue;
            }

            $lat = $data['latitude'];
            $lng = $data['longitude'];
            $googleMapsUrl = "https://www.google.com/maps/search/?api=1&query={$lat},{$lng}";

            DB::table('destinations')->insert([
                'village_id' => $data['village_id'],
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'category' => $data['category'],
                'description' => $data['description'],
                'ticket_price' => $data['ticket_price'],
                'ticket_info' => $data['ticket_info'],
                'open_time' => $data['open_time'],
                'close_time' => $data['close_time'],
                'operational_days' => $data['operational_days'],
                'facilities' => json_encode($data['facilities']),
                'latitude' => $lat,
                'longitude' => $lng,
                'point' => DB::raw("ST_SRID(POINT({$lng}, {$lat}), 4326)"),
                'qr_code_target' => $googleMapsUrl,
                'status' => $data['status'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
