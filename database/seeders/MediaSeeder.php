<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $umkms = DB::table('umkms')->get()->keyBy('slug');
        $destinations = DB::table('destinations')->get()->keyBy('slug');

        $umkmCoverMap = [
            'sentra-gula-jawa-gula-semut-murni-serayu-larangan' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            'warung-makan-sambal-nira-mbok-sri' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
            'kerajinan-anyaman-bambu-tampah-serayu' => 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800',
            'toko-oleh-oleh-batik-tulis-serayu-larangan' => 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
        ];

        $destCoverMap = [
            'agrowisata-edukasi-nira-serayu-larangan' => 'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800',
            'spot-persawahan-terasering-serayu-larangan' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'sentra-transparansi-balai-desa-serayu-larangan' => 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
        ];

        $mediaRows = [];

        foreach ($umkms as $slug => $umkm) {
            $url = $umkmCoverMap[$slug] ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
            $mediaRows[] = [
                'mediable_id' => $umkm->id,
                'mediable_type' => 'App\Models\Umkm',
                'file_path' => $url,
                'alt_text' => 'Foto utama '.$umkm->name,
                'is_primary' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach ($destinations as $slug => $dest) {
            $url = $destCoverMap[$slug] ?? 'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800';
            $mediaRows[] = [
                'mediable_id' => $dest->id,
                'mediable_type' => 'App\Models\Destination',
                'file_path' => $url,
                'alt_text' => 'Foto utama '.$dest->name,
                'is_primary' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (! empty($mediaRows)) {
            DB::table('media')->insert($mediaRows);
        }
    }
}
