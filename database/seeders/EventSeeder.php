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
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();

        $destEduNira = DB::table('destinations')->where('slug', 'agrowisata-edukasi-nira-serayu-larangan')->first();
        $destOnjeReligi = DB::table('destinations')->where('slug', 'wisata-religi-sejarah-onje')->first();
        $destCipakuSabin = DB::table('destinations')->where('slug', 'kumpoel-green-sabin')->first();
        $destChengHoo = DB::table('destinations')->where('slug', 'masjid-muhammad-cheng-hoo-mrebet')->first();

        $events = [
            [
                'village_id' => $villageSerayuLarangan?->id,
                'destination_id' => $destEduNira?->id,
                'title' => 'Festival Nira & Pasar Gula Jawa Serayu Larangan',
                'description' => 'Festival kebudayaan dan pameran produk nira kelapa tahunan Desa Serayu Larangan. Menampilkan atraksi panjat pohon kelapa oleh penderes lokal, pameran gula cetak organik, demo pembuatan sagon & jajanan nira, serta bazaar UMKM warga desa.',
                'start_date' => Carbon::now()->addMonths(1)->format('Y-m-d'),
                'end_date' => Carbon::now()->addMonths(1)->addDay()->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Pokdarwis & Pemdes Serayu Larangan',
                'instagram' => '@serayularangan_official',
                'contact_person' => '+6281398480422',
                'status' => 'published',
            ],
            [
                'village_id' => $villageSerayuLarangan?->id,
                'destination_id' => null,
                'title' => 'Layar Tanjleb Festival Film Purbalingga (CLC)',
                'description' => 'Pemutaran film layar tancap keliling dan pesta rakyat di Lapangan Desa Serayu Larangan yang diinisiasi Cinema Lover Community (CLC) Purbalingga. Memutarkan film-film pendek inspiratif Banyumasan.',
                'start_date' => Carbon::now()->addWeeks(2)->format('Y-m-d'),
                'end_date' => null,
                'start_time' => '19:30:00',
                'end_time' => '23:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Cinema Lover Community & Pemdes Serayu Larangan',
                'instagram' => '@clcpurbalingga',
                'contact_person' => '+6281398480422',
                'status' => 'published',
            ],
            [
                'village_id' => $villageOnje?->id,
                'destination_id' => $destOnjeReligi?->id,
                'title' => 'Grebeg Onje',
                'description' => 'Tradisi budaya dan ritual religi tahunan masyarakat Desa Onje yang digelar setiap menjelang bulan suci Ramadhan. Rangkaian acara meliputi kirab gunungan hasil bumi dan doa bersama.',
                'start_date' => Carbon::now()->addMonths(2)->format('Y-m-d'),
                'end_date' => Carbon::now()->addMonths(2)->addDays(2)->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Pokdarwis Bangun Pesona & Pemerintah Desa Onje',
                'instagram' => '@grebeg.onje',
                'contact_person' => '082227961243',
                'status' => 'published',
            ],
            [
                'village_id' => $villageSerayuLarangan?->id,
                'destination_id' => null,
                'title' => 'Gebyar GERMAS & Srawung Desa Sehat Serayu Larangan',
                'description' => 'Acara pemberdayaan masyarakat integrasi antara Puskesmas Mrebet dan Pemdes Serayu Larangan. Rangkaian kegiatan: jalan sehat persawahan, cek kesehatan gratis, dan senam massal.',
                'start_date' => Carbon::now()->addMonths(3)->format('Y-m-d'),
                'end_date' => null,
                'start_time' => '06:00:00',
                'end_time' => '11:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Puskesmas Mrebet & Kader Kesehatan Serayu Larangan',
                'instagram' => null,
                'contact_person' => '+6281398480422',
                'status' => 'published',
            ],
            [
                'village_id' => $villageMrebet?->id,
                'destination_id' => $destChengHoo?->id,
                'title' => 'Peringatan Hari Jadi Masjid Muhammad Cheng Hoo',
                'description' => 'Peringatan tahunan yang diisi dengan tausiah kebangsaan, pameran UMKM lokal, dan pentas seni budaya Banyumasan.',
                'start_date' => Carbon::now()->addMonths(4)->format('Y-m-d'),
                'end_date' => Carbon::now()->addMonths(4)->addDay()->format('Y-m-d'),
                'start_time' => '09:00:00',
                'end_time' => '21:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Takmir Masjid Cheng Hoo & Dinas Pariwisata Purbalingga',
                'instagram' => '@masjidchenghoomrebet',
                'contact_person' => null,
                'status' => 'published',
            ],
        ];

        foreach ($events as $data) {
            if (! $data['village_id']) {
                continue;
            }

            $qrTarget = 'https://www.google.com/search?q='.urlencode($data['title'].' Serayu Larangan Purbalingga');

            DB::table('events')->insert([
                'village_id' => $data['village_id'],
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
                'qr_code_target' => $qrTarget,
                'status' => $data['status'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
