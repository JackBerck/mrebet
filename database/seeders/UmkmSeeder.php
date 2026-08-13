<?php

namespace Database\Seeders;

use App\Support\Spatial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $umkms = [
            [
                'name' => 'Sentra Gula Jawa & Gula Semut Murni Serayu Larangan',
                'category' => 'pertanian_olahan',
                'owner_name' => 'Fajar Prasetyo Utomo & Kelompok Penderes Desa',
                'description' => 'Pusat produksi dan edukasi pengolahan nira kelapa murni menjadi gula jawa cetak dan gula semut organik tanpa bahan pengawet sintetik. Dipetik langsung oleh penderes berpengalaman Desa Serayu Larangan.',
                'address' => 'RT 03 / RW 02, Desa Serayu Larangan, Kec. Mrebet, Kab. Purbalingga',
                'contact_phone' => '081398480422',
                'price_range' => 'Rp 15.000 - Rp 35.000 / kg',
                'latitude' => -7.3235410,
                'longitude' => 109.3642100,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3235410,109.3642100',
                'status' => 'published',
            ],
            [
                'name' => 'Warung Makan & Sambal Nira Mbok Sri',
                'category' => 'kuliner',
                'owner_name' => 'Siti Srimulyati',
                'description' => 'Menyajikan sajian kuliner khas serundeng kelapa, olahan ayam kampung goreng bumbu nira, serta es kelapa muda nira segar yang nikmat dinikmati di tepi persawahan terasering.',
                'address' => 'Jl. Raya Desa Serayu Larangan No. 12',
                'contact_phone' => '082227961243',
                'price_range' => 'Rp 10.000 - Rp 30.000',
                'latitude' => -7.3241000,
                'longitude' => 109.3651000,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3241000,109.3651000',
                'status' => 'published',
            ],
            [
                'name' => 'Kerajinan Anyaman Bambu & Tampah Serayu',
                'category' => 'kerajinan',
                'owner_name' => 'Mugi Ari Purwono',
                'description' => 'Kerajinan aneka alat rumah tangga dari anyaman bambu murni berkualitas tinggi seperti tampah, tempat nasi, besek, dan hiasan dinding khas pedesaan.',
                'address' => 'Dusun 2, Desa Serayu Larangan',
                'contact_phone' => '081345678901',
                'price_range' => 'Rp 8.000 - Rp 75.000',
                'latitude' => -7.3228000,
                'longitude' => 109.3635000,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3228000,109.3635000',
                'status' => 'published',
            ],
            [
                'name' => 'Toko Oleh-Oleh & Batik Tulis Serayu Larangan',
                'category' => 'kerajinan',
                'owner_name' => 'Suwanto',
                'description' => 'Sentra penjualan batik tulis dengan motif daun kelapa dan aliran Sungai Klawing, dilengkapi dengan pusat snack kering olahan singkong dan kelapa.',
                'address' => 'Depan Balai Desa Serayu Larangan',
                'contact_phone' => '081456789012',
                'price_range' => 'Rp 20.000 - Rp 250.000',
                'latitude' => -7.3250000,
                'longitude' => 109.3660000,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3250000,109.3660000',
                'status' => 'published',
            ],
        ];

        foreach ($umkms as $data) {
            DB::table('umkms')->insert([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'category' => $data['category'],
                'owner_name' => $data['owner_name'],
                'description' => $data['description'],
                'address' => $data['address'],
                'contact_phone' => $data['contact_phone'],
                'price_range' => $data['price_range'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'gmaps_link' => $data['gmaps_link'],
                'point' => Spatial::point($data['latitude'], $data['longitude']),
                'status' => $data['status'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
