<?php

namespace Database\Seeders;

use App\Support\Spatial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VillageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $villages = [
            [
                'name' => 'Onje',
                'description' => 'Desa wisata religi bersejarah yang pernah menjadi pusat Kadipaten Onje, cikal bakal terbentuknya Kabupaten Purbalingga. Terkenal dengan situs Makam Adipati Onje II dan Masjid Raden Sayyid Kuning, salah satu masjid tertua di Jawa Tengah.',
                'head_name' => 'Mugi Ari Purwono',
                'contact_phone' => '082227961243',
                'latitude' => -7.33583,
                'longitude' => 109.37250,
                'status' => 'published',
            ],
            [
                'name' => 'Cipaku',
                'description' => 'Desa yang dikenal dengan keindahan alam, situs prasejarah Batu Tulis Cipaku, dan destinasi agrowisata Kumpoel Green Sabin. Salah satu desa tua di Purbalingga dengan sejarah peradaban yang kuat.',
                'head_name' => 'Sugiarto, S.Pd., M.M.',
                'contact_phone' => null,
                'latitude' => -7.31194,
                'longitude' => 109.32667,
                'status' => 'published',
            ],
            [
                'name' => 'Mrebet',
                'description' => 'Ibu kota kecamatan yang menjadi pusat administrasi pemerintahan, layanan publik, dan aktivitas ekonomi. Dikenal sebagai transit utama wisatawan berkat kehadiran Masjid Muhammad Cheng Hoo yang ikonik.',
                'head_name' => 'Mudrikah, S.IP.',
                'contact_phone' => null,
                'latitude' => -7.31639,
                'longitude' => 109.34833,
                'status' => 'published',
            ],
            [
                'name' => 'Serayu Larangan',
                'description' => 'Desa percontohan anti-korupsi nasional yang ditunjuk oleh KPK RI. Memiliki tata kelola irigasi pertanian yang maju, digitalisasi layanan desa, dan akuntabilitas dana publik yang tinggi.',
                'head_name' => 'Fajar Prasetyo Utomo',
                'contact_phone' => '+622817700040',
                'latitude' => -7.29139,
                'longitude' => 109.33083,
                'status' => 'published',
            ],
            [
                'name' => 'Pengadegan',
                'description' => 'Desa wisata alam dengan potensi ekowisata hutan pinus dan peternakan sapi perah. Menjadi bagian dari jalur agrowisata terpadu menuju kaki Gunung Slamet dari sisi utara Purbalingga.',
                'head_name' => 'Suwanto',
                'contact_phone' => null,
                'latitude' => -7.29972,
                'longitude' => 109.35194,
                'status' => 'published',
            ],
            [
                'name' => 'Tangkisan',
                'description' => 'Desa yang berbatasan langsung dengan Onje di sepanjang aliran Sungai Klawing. Dikenal sebagai titik awal rute tubing dan arung jeram populer yang menjadi daya tarik wisata alam air.',
                'head_name' => 'Sutrisno',
                'contact_phone' => null,
                'latitude' => -7.33250,
                'longitude' => 109.36780,
                'status' => 'published',
            ],
            [
                'name' => 'Karangturi',
                'description' => 'Desa dengan potensi wisata kuliner dan kerajinan lokal yang terus berkembang. Hasil produksi UMKM setempat seperti makanan olahan dan anyaman bambu menjadi daya tarik wisata belanja.',
                'head_name' => 'Ahmad Fauzi',
                'contact_phone' => null,
                'latitude' => -7.30750,
                'longitude' => 109.33500,
                'status' => 'draft',
            ],
        ];

        foreach ($villages as $data) {
            $slug = Str::slug($data['name']);
            $lat = $data['latitude'];
            $lng = $data['longitude'];

            // Google Maps URL format yang benar: maps/search/?api=1&query=lat,lng
            $googleMapsUrl = "https://www.google.com/maps/search/?api=1&query={$lat},{$lng}";

            $id = DB::table('villages')->insertGetId([
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['description'],
                'head_name' => $data['head_name'],
                'contact_phone' => $data['contact_phone'],
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
