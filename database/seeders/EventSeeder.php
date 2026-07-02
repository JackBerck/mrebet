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
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();

        $destOnjeReligi = DB::table('destinations')->where('slug', 'wisata-religi-sejarah-onje')->first();
        $destCipakuSabin = DB::table('destinations')->where('slug', 'kumpoel-green-sabin')->first();
        $destCipakuBatu = DB::table('destinations')->where('slug', 'situs-batu-tulis-cipaku')->first();
        $destChengHoo = DB::table('destinations')->where('slug', 'masjid-muhammad-cheng-hoo-mrebet')->first();

        $events = [
            // DATA RIIL — Tradisi tahunan paling terkenal Desa Onje
            [
                'village_id' => $villageOnje?->id,
                'destination_id' => $destOnjeReligi?->id,
                'title' => 'Grebeg Onje',
                'description' => 'Tradisi budaya dan ritual religi tahunan masyarakat Desa Onje yang digelar setiap menjelang bulan suci Ramadhan (akhir Sya\'ban). Rangkaian acara meliputi kirab gunungan hasil bumi, prosesi pengambilan air suci di Sungai Klawing, doa bersama di Masjid Kuno, serta makan bersama nasi penggel khas Onje sebagai wujud syukur dan kebersamaan.',
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

            // DATA RIIL — Festival Film Purbalingga (CLC)
            [
                'village_id' => $villageSerayuLarangan?->id,
                'destination_id' => null,
                'title' => 'Layar Tanjleb Festival Film Purbalingga',
                'description' => 'Pemutaran film alternatif keliling dan pesta rakyat tahunan yang diinisiasi Cinema Lover Community (CLC) Purbalingga. Acara memutarkan karya film pendek lokal Banyumasan di Lapangan Desa Serayu Larangan, didukung lapak UMKM warga desa. Gratis dan terbuka untuk umum.',
                'start_date' => Carbon::now()->addMonths(1)->format('Y-m-d'),
                'end_date' => null,
                'start_time' => '19:30:00',
                'end_time' => '23:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Cinema Lover Community (CLC) Purbalingga & Pemdes Serayu Larangan',
                'instagram' => '@clcpurbalingga',
                'contact_person' => '+622817700040',
                'status' => 'published',
            ],

            // DATA RIIL — Kegiatan edukasi cagar budaya Cipaku
            [
                'village_id' => $villageCipaku?->id,
                'destination_id' => $destCipakuBatu?->id,
                'title' => 'Eksplorasi & Literasi Cagar Budaya Cipaku',
                'description' => 'Kegiatan edukatif sejarah berkala yang diikuti pelajar dan anggota Pramuka Penggalang Kwaran Mrebet. Mencakup Lomba Eksplorasi Cagar Budaya di Situs Batu Tulis Cipaku, kelas sejarah bersama kurator purbakala, dan aksi bersih-bersih pelestarian lingkungan situs.',
                'start_date' => Carbon::now()->addWeeks(3)->format('Y-m-d'),
                'end_date' => Carbon::now()->addWeeks(3)->addDay()->format('Y-m-d'),
                'start_time' => '07:30:00',
                'end_time' => '14:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Pemerhati Sejarah Purbalingga & Kwaran Mrebet',
                'instagram' => null,
                'contact_person' => null,
                'status' => 'published',
            ],

            // DATA SIMULASI — Event rutin Kumpoel Green Sabin
            [
                'village_id' => $villageCipaku?->id,
                'destination_id' => $destCipakuSabin?->id,
                'title' => 'Lomba Mancing Akhir Pekan Kumpoel Sabin',
                'description' => 'Acara rutin akhir pekan di area kolam pemancingan Kumpoel Green Sabin. Peserta berkompetisi memancing ikan maskot kiloan dengan total hadiah menarik dan voucher makan prasmanan gratis. Terbuka untuk semua kalangan.',
                'start_date' => Carbon::now()->next(Carbon::SUNDAY)->format('Y-m-d'),
                'end_date' => null,
                'start_time' => '09:00:00',
                'end_time' => '16:00:00',
                'ticket_price' => 25000.00,
                'organizer' => 'Manajemen Kumpoel Green Sabin',
                'instagram' => '@kumpoelgreensabin',
                'contact_person' => '+6282336966666',
                'status' => 'published',
            ],

            // DATA RIIL — Program kesehatan terintegrasi
            [
                'village_id' => $villageSerayuLarangan?->id,
                'destination_id' => null,
                'title' => 'Gebyar GERMAS & Srawung Desa Sehat',
                'description' => 'Acara pemberdayaan masyarakat integrasi antara Puskesmas Mrebet, program Srawung Desa mahasiswa kesehatan, dan kader penggerak lokal. Rangkaian kegiatan: jalan sehat desa, cek kesehatan gratis, sosialisasi penanganan stunting, dan senam kebugaran massal.',
                'start_date' => Carbon::now()->addMonths(3)->format('Y-m-d'),
                'end_date' => null,
                'start_time' => '06:00:00',
                'end_time' => '11:00:00',
                'ticket_price' => 0.00,
                'organizer' => 'Puskesmas Mrebet & Kader Kesehatan Desa Serayu Larangan',
                'instagram' => null,
                'contact_person' => '+622817700040',
                'status' => 'published',
            ],

            // DATA SIMULASI — Event religi tahunan di Cheng Hoo
            [
                'village_id' => $villageMrebet?->id,
                'destination_id' => $destChengHoo?->id,
                'title' => 'Peringatan Hari Jadi Masjid Muhammad Cheng Hoo Mrebet',
                'description' => 'Peringatan tahunan hari jadi Masjid Muhammad Cheng Hoo yang diisi dengan rangkaian kegiatan islami: tausiah kebangsaan, pameran UMKM lokal Mrebet, bazar kuliner halal, dan pentas seni budaya Banyumasan. Terbuka untuk seluruh masyarakat dan wisatawan.',
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

            // DATA SIMULASI — Trekking ekowisata
            [
                'village_id' => $villagePengadegan?->id,
                'destination_id' => null,
                'title' => 'Trekking Hutan Pinus & Kopi Sore Pengadegan',
                'description' => 'Kegiatan trekking sore hari terpandu di kawasan Hutan Pinus Pengadegan diakhiri sesi ngopi bersama sambil menikmati pemandangan sunset Gunung Slamet. Cocok untuk komunitas hiking, wisatawan muda, dan keluarga aktif.',
                'start_date' => Carbon::now()->next(Carbon::SATURDAY)->format('Y-m-d'),
                'end_date' => null,
                'start_time' => '14:00:00',
                'end_time' => '18:00:00',
                'ticket_price' => 30000.00,
                'organizer' => 'Pokdarwis Pengadegan & Karang Taruna Desa',
                'instagram' => null,
                'contact_person' => null,
                'status' => 'published',
            ],
        ];

        foreach ($events as $data) {
            if (! $data['village_id']) {
                continue;
            }

            // QR Code event mengarah ke Google Search nama event di Mrebet
            $qrTarget = 'https://www.google.com/search?q='.urlencode($data['title'].' Mrebet Purbalingga');

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
