<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agrowisata = DB::table('destinations')->where('slug', 'like', '%agrowisata%')->first();

        $events = [
            [
                'destination_id' => $agrowisata?->id,
                'title' => 'Festival Nira & Pasar Gula Jawa Serayu Larangan',
                'description' => 'Pesta panen nira kelapa dan pasar rakyat pameran olahan gula semut khas Desa Serayu Larangan dengan lomba penderes tradisional dan pertunjukan seni lesehan.',
                'start_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'ticket_price' => 0,
                'organizer' => 'Kelompok Penderes & Karang Taruna Serayu Larangan',
                'instagram' => '@serayularangan_official',
                'contact_person' => '081398480422 (Fajar)',
                'gmaps_link' => 'https://maps.google.com/?q=-7.3235410,109.3642100',
                'status' => 'published',
            ],
            [
                'destination_id' => null,
                'title' => 'Gebyar GERMAS & Srawung Desa Sehat Serayu Larangan',
                'description' => 'Jalan sehat warga keliling terasering sawah dilanjutkan dengan senam bersama, pemeriksaan kesehatan gratis, serta bazar kuliner tradisional khas desa.',
                'start_date' => Carbon::now()->addDays(14)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(14)->format('Y-m-d'),
                'start_time' => '06:30:00',
                'end_time' => '12:00:00',
                'ticket_price' => 0,
                'organizer' => 'Pemerintah Desa & PKK Serayu Larangan',
                'instagram' => '@pemdes_serayularangan',
                'contact_person' => '081100001111 (Admin Desa)',
                'gmaps_link' => 'https://maps.google.com/?q=-7.3229000,109.3638000',
                'status' => 'published',
            ],
        ];

        foreach ($events as $data) {
            DB::table('events')->insert([
                'destination_id' => $data['destination_id'],
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'description' => $data['description'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'ticket_price' => $data['ticket_price'],
                'organizer' => $data['organizer'],
                'instagram' => $data['instagram'],
                'contact_person' => $data['contact_person'],
                'gmaps_link' => $data['gmaps_link'],
                'qr_code_target' => 'https://serayularangan.desa.id/event/'.Str::slug($data['title']),
                'status' => $data['status'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
