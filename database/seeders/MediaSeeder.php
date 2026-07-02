<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MediaSeeder extends Seeder
{
    /**
     * Seed foto-foto placeholder untuk setiap desa dan destinasi.
     * Gunakan path lokal (public/storage/...) atau URL Unsplash untuk mockup UI.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $villages = DB::table('villages')->get()->keyBy('slug');
        $destinations = DB::table('destinations')->get()->keyBy('slug');

        // Map slug → Unsplash cover image URL (nature/culture themed)
        $villageCoverMap = [
            'onje' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            'cipaku' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'mrebet' => 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
            'serayu-larangan' => 'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800',
            'pengadegan' => 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
            'tangkisan' => 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
        ];

        $destCoverMap = [
            'wisata-religi-sejarah-onje' => 'https://images.unsplash.com/photo-1599639957043-f3aa7b998a1c?w=800',
            'wisata-tubing-sungai-klawing' => 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
            'kumpoel-green-sabin' => 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800',
            'situs-batu-tulis-cipaku' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
            'masjid-muhammad-cheng-hoo-mrebet' => 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=800',
            'balai-desa-serayu-larangan-pusat-informasi-desa' => 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
            'ekowisata-hutan-pinus-pengadegan' => 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        ];

        $mediaRows = [];

        // Cover foto untuk setiap desa
        foreach ($villageCoverMap as $slug => $url) {
            if (isset($villages[$slug])) {
                $mediaRows[] = [
                    'mediable_id' => $villages[$slug]->id,
                    'mediable_type' => 'App\Models\Village',
                    'file_path' => $url,
                    'alt_text' => 'Foto utama Desa '.$villages[$slug]->name,
                    'is_primary' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        // Cover foto untuk setiap destinasi
        foreach ($destCoverMap as $slug => $url) {
            if (isset($destinations[$slug])) {
                $mediaRows[] = [
                    'mediable_id' => $destinations[$slug]->id,
                    'mediable_type' => 'App\Models\Destination',
                    'file_path' => $url,
                    'alt_text' => 'Foto utama '.$destinations[$slug]->name,
                    'is_primary' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (! empty($mediaRows)) {
            DB::table('media')->insert($mediaRows);
        }
    }
}
