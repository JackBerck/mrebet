<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = DB::table('users')->where('role', 'admin')->first();
        $adminId = $admin?->id;

        $managerSerayu = DB::table('users')->where('email', 'manager.serayularangan@serayularangan.desa.id')->first();

        $blogs = [
            [
                'user_id' => $managerSerayu?->id ?? $adminId,
                'title' => 'Serayu Larangan: Desa Percontohan Anti-Korupsi KPK RI',
                'content' => '<h1>Dari Desa ke Panggung Nasional: Transparansi Serayu Larangan</h1><p>Di antara hamparan sawah dan irigasi tertata rapi di lereng Gunung Slamet, Desa Serayu Larangan berhasil mengukir prestasi nasional yang membanggakan. Desa ini terpilih menjadi salah satu Desa Percontohan Anti-Korupsi oleh Komisi Pemberantasan Korupsi (KPK) RI berkat komitmen transparansi tata kelola pemerintahan desa.</p><h2>Inovasi Digital Pelayanan Publik</h2><p>Masyarakat kini dapat mengakses laporan keuangan desa secara terbuka melalui papan informasi digital di balai desa. Pengajuan surat-menyurat hingga pemantauan progres pembangunan fisik bisa dipantau secara langsung, menciptakan ekosistem pemerintahan yang bersih dan akuntabel.</p><h2>Pariwisata Berkelanjutan & Ekonomi Nira</h2><p>Selain digitalisasi administrasi, Serayu Larangan juga dikenal dengan tradisi olahan nira gula kelapa dan persawahan terasering yang asri, menjadikan desa ini model pemberdayaan ekonomi dan UMKM pedesaan yang unggul.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 640,
                'days_ago' => 5,
            ],
            [
                'user_id' => $managerSerayu?->id ?? $adminId,
                'title' => 'Menjaga Tradisi Penderes Nira Kelapa di Lereng Gunung Slamet',
                'content' => '<h1>Kehangatan Manis Gula Jawa Serayu Larangan</h1><p>Setiap pagi sebelum fajar menyingsing, para penderes kelapa Desa Serayu Larangan telah memanjat puluhan pohon kelapa untuk memetik nira segar. Tradisi ini telah diwariskan secara turun-temurun dan menjadi penopang ekonomi keluarga di desa.</p><h2>Proses Pengolahan Tradisional</h2><p>Nira segar disaring dan direbus di atas tungku kayu bakar selama berjam-jam hingga mengental menjadi karamel gula jawa yang harum. Kualitas gula kelapa Serayu Larangan terkenal murni tanpa bahan pengawet sintetik.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 410,
                'days_ago' => 12,
            ],
        ];

        foreach ($blogs as $data) {
            if (! $data['user_id']) {
                continue;
            }

            $isPublished = $data['status'] === 'published';
            $publishedAt = $isPublished ? Carbon::now()->subDays($data['days_ago']) : null;
            $createdAt = Carbon::now()->subDays($data['days_ago'] + 2);

            DB::table('blogs')->insert([
                'user_id' => $data['user_id'],
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'content' => $data['content'],
                'cover_image' => $data['cover_image'],
                'status' => $data['status'],
                'views_count' => $data['views_count'],
                'published_at' => $publishedAt,
                'created_at' => $createdAt,
                'updated_at' => Carbon::now()->subDays($data['days_ago']),
            ]);
        }
    }
}
