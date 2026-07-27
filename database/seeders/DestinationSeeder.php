<?php

namespace Database\Seeders;

use App\Support\Spatial;
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
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();
        $villageTangkisan = DB::table('villages')->where('slug', 'tangkisan')->first();

        $destinations = [
            [
                'village_id' => $villageSerayuLarangan?->id,
                'name' => 'Agrowisata & Edukasi Nira Serayu Larangan',
                'category' => 'alam',
                'description' => 'Destinasi wisata edukasi khas Desa Serayu Larangan di mana pengunjung dapat melihat langsung proses tradisional penderes kelapa menyadap nira hingga mengolahnya menjadi gula cetak dan gula semut berkualitas khas lereng Gunung Slamet.',
                'ticket_price' => 10000.00,
                'ticket_info' => 'Termasuk cicip nira hangat segar dan edukasi pembuatan gula kelapa bersama petani lokal.',
                'open_time' => '07:00:00',
                'close_time' => '17:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Saung Edukasi', 'Icip Nira Segar', 'Oleh-oleh Gula Jawa', 'Toilet Umum', 'Area Parkir', 'Pemandu Lokal'],
                'latitude' => -7.29150,
                'longitude' => 109.33120,
                'status' => 'published',
            ],
            [
                'village_id' => $villageSerayuLarangan?->id,
                'name' => 'Spot Persawahan Terasering Serayu Larangan',
                'category' => 'alam',
                'description' => 'Lanskap hamparan persawahan terasering hijau berlatar panorama Gunung Slamet. Menawarkan spot foto alami, saung peristirahatan kayu, dan udara pedesaan yang sejuk serta jernihnya aliran air irigasi desa.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis dikunjungi wisatawan umum.',
                'open_time' => '06:00:00',
                'close_time' => '18:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Saung Bambu', 'Spot Foto Persawahan', 'Jalur Trekking Sawah', 'Parkir Motor'],
                'latitude' => -7.29050,
                'longitude' => 109.32950,
                'status' => 'published',
            ],
            [
                'village_id' => $villageSerayuLarangan?->id,
                'name' => 'Balai Desa & Sentra Digital Serayu Larangan',
                'category' => 'budaya',
                'description' => 'Pusat informasi dan pelayanan Desa Serayu Larangan yang menjadi percontohan nasional KPK RI dalam hal transparansi tata kelola pemerintahan desa. Pengunjung dapat mempelajari sistem digitalisasi layanan publik dan transparansi keuangan desa.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis, terbuka pada jam operasional kantor desa.',
                'open_time' => '08:00:00',
                'close_time' => '15:30:00',
                'operational_days' => 'Senin - Jumat',
                'facilities' => ['Ruang Layanan Digital', 'Papan Informasi Publik', 'Toilet', 'Parkir Luas', 'Wi-Fi Publik'],
                'latitude' => -7.29200,
                'longitude' => 109.33100,
                'status' => 'published',
            ],
            [
                'village_id' => $villageOnje?->id,
                'name' => 'Wisata Religi & Sejarah Onje',
                'category' => 'budaya',
                'description' => 'Kompleks wisata sejarah dan religi yang mencakup Masjid Kuno Raden Sayyid Kuning dan Makam Adipati Onje II, peninggalan era Kadipaten yang menjadi cikal bakal Kabupaten Purbalingga.',
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
                'description' => 'Aktivitas susur sungai Klawing yang memacu adrenalin dengan pemandangan alam hijau di kanan-kiri. Rute dimulai dari area Tangkisan dan berakhir di Desa Onje.',
                'ticket_price' => 50000.00,
                'ticket_info' => 'Harga per orang. Termasuk sewa ban, pelampung, helm, pemandu, dan snack.',
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
                'description' => 'Taman rekreasi buatan bertema agrowisata dan kuliner prasmanan di tengah sawah hijau dengan panorama langsung ke Gunung Slamet.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Masuk gratis. Pengunjung membayar parkir dan makanan yang dipesan.',
                'open_time' => '10:00:00',
                'close_time' => '22:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Restoran Prasmanan', 'Kolam Renang Anak', 'Terapi Ikan', 'Kolam Pancing', 'Mushola', 'Gazebo'],
                'latitude' => -7.31252,
                'longitude' => 109.32711,
                'status' => 'published',
            ],
            [
                'village_id' => $villageCipaku?->id,
                'name' => 'Situs Batu Tulis Cipaku',
                'category' => 'budaya',
                'description' => 'Situs cagar budaya prasejarah berupa batu besar purba berukir karakter huruf Jawa Kuno/Palawa di wilayah Mrebet.',
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
                'description' => 'Destinasi wisata religi ikonik dengan arsitektur unik perpaduan kelenteng Tionghoa dan nuansa Islami di jalur utama Kecamatan Mrebet.',
                'ticket_price' => 0.00,
                'ticket_info' => 'Gratis, terbuka untuk ibadah dan kunjungan wisata religi.',
                'open_time' => '04:00:00',
                'close_time' => '22:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Parkir Luas', 'Rest Area', 'Toilet', 'Toko Souvenir & UMKM'],
                'latitude' => -7.31510,
                'longitude' => 109.34990,
                'status' => 'published',
            ],
            [
                'village_id' => $villagePengadegan?->id,
                'name' => 'Ekowisata Hutan Pinus Pengadegan',
                'category' => 'alam',
                'description' => 'Kawasan hutan pinus hijau di lereng Gunung Slamet yang menawarkan udara sejuk dan jalur trekking ringan.',
                'ticket_price' => 10000.00,
                'ticket_info' => 'Tiket masuk per orang.',
                'open_time' => '07:00:00',
                'close_time' => '17:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Jalur Trekking', 'Area Piknik', 'Spot Foto', 'Toilet', 'Warung Kopi'],
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
                'point' => Spatial::point($lat, $lng),
                'qr_code_target' => $googleMapsUrl,
                'status' => $data['status'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
