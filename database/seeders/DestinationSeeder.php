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
        $destinations = [
            [
                'name' => 'Agrowisata & Edukasi Nira Serayu Larangan',
                'category' => 'budaya',
                'description' => 'Destinasi wisata edukasi budaya penderes nira kelapa murni dan pengolahan gula jawa tradisional khas lereng timur Gunung Slamet di Desa Serayu Larangan.',
                'ticket_price' => 10000,
                'ticket_info' => 'Termasuk welcome drink nira kelapa murni & souvenir gula jawa cetak.',
                'open_time' => '07:00:00',
                'close_time' => '16:00:00',
                'operational_days' => 'Senin - Minggu',
                'facilities' => ['Parkir Luas', 'Mushola', 'Toilet', 'Pendopo Edukasi', 'Warung Nira', 'WiFi Publik'],
                'latitude' => -7.3235410,
                'longitude' => 109.3642100,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3235410,109.3642100',
                'status' => 'published',
            ],
            [
                'name' => 'Spot Persawahan Terasering Serayu Larangan',
                'category' => 'alam',
                'description' => 'Kawasan pemandangan hamparan sawah bertingkat (terasering) nan hijau yang dikelilingi perbukitan nan asri dengan udara sejuk alami lereng Slamet.',
                'ticket_price' => 0,
                'ticket_info' => 'Gratis akses untuk spot swafoto dan jalan santai.',
                'open_time' => '06:00:00',
                'close_time' => '18:00:00',
                'operational_days' => 'Setiap Hari',
                'facilities' => ['Spot Foto', 'Gazebo Istirahat', 'Area Parkir Motor'],
                'latitude' => -7.3251200,
                'longitude' => 109.3654000,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3251200,109.3654000',
                'status' => 'published',
            ],
            [
                'name' => 'Sentra Transparansi & Balai Desa Serayu Larangan',
                'category' => 'buatan',
                'description' => 'Pusat pelayanan publik dan transparansi digital Desa Serayu Larangan yang diresmikan sebagai Desa Percontohan Anti-Korupsi oleh KPK RI.',
                'ticket_price' => 0,
                'ticket_info' => 'Kunjungan studi banding & edukasi administrasi publik gratis.',
                'open_time' => '08:00:00',
                'close_time' => '15:30:00',
                'operational_days' => 'Senin - Jumat',
                'facilities' => ['Ruang Rapat Digital', 'Layanan Publik Online', 'Mushola', 'Toilet Disabilitas'],
                'latitude' => -7.3229000,
                'longitude' => 109.3638000,
                'gmaps_link' => 'https://maps.google.com/?q=-7.3229000,109.3638000',
                'status' => 'published',
            ],
        ];

        foreach ($destinations as $data) {
            DB::table('destinations')->insert([
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
