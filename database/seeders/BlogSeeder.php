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
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();

        $admin = DB::table('users')->where('role', 'admin')->first();
        $adminId = $admin?->id;

        $managerSerayu = DB::table('users')->where('email', 'manager.serayularangan@serayularangan.desa.id')->first();
        $managerOnje = DB::table('users')->where('email', 'manager.onje@serayularangan.desa.id')->first();
        $managerCipaku = DB::table('users')->where('email', 'manager.cipaku@serayularangan.desa.id')->first();

        $blogs = [
            [
                'user_id' => $managerSerayu?->id ?? $adminId,
                'village_id' => $villageSerayuLarangan?->id,
                'title' => 'Serayu Larangan: Desa Percontohan Anti-Korupsi KPK RI',
                'content' => '<h1>Dari Desa ke Panggung Nasional: Transparansi Serayu Larangan</h1><p>Di antara hamparan sawah dan irigasi tertata rapi di lereng Gunung Slamet, Desa Serayu Larangan berhasil mengukir prestasi nasional yang membanggakan. Desa ini terpilih menjadi salah satu Desa Percontohan Anti-Korupsi oleh Komisi Pemberantasan Korupsi (KPK) RI berkat komitmen transparansi tata kelola pemerintahan desa.</p><h2>Inovasi Digital Pelayanan Publik</h2><p>Masyarakat kini dapat mengakses laporan keuangan desa secara terbuka melalui papan informasi digital di balai desa. Pengajuan surat-menyurat hingga pemantauan progres pembangunan fisik bisa dipantau secara langsung, menciptakan ekosistem pemerintahan yang bersih dan akuntabel.</p><h2>Pariwisata Berkelanjutan & Ekonomi Nira</h2><p>Selain digitalisasi administrasi, Serayu Larangan juga dikenal dengan tradisi olahan nira gula kelapa dan persawahan terasering yang asri, menjadikan desa ini model pemberdayaan ekonomi dan pariwisata pedesaan yang unggul.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 640,
                'days_ago' => 5,
            ],
            [
                'user_id' => $managerSerayu?->id ?? $adminId,
                'village_id' => $villageSerayuLarangan?->id,
                'title' => 'Menjaga Tradisi Penderes Nira Kelapa di Lereng Gunung Slamet',
                'content' => '<h1>Kehangatan Manis Gula Jawa Serayu Larangan</h1><p>Setiap pagi sebelum fajar menyingsing, para penderes kelapa Desa Serayu Larangan telah memanjat puluhan pohon kelapa untuk memetik nira segar. Tradisi ini telah diwariskan secara turun-temurun dan menjadi penopang ekonomi keluarga di desa.</p><h2>Proses Pengolahan Tradisional</h2><p>Nira segar disaring dan direbus di atas tungku kayu bakar selama berjam-jam hingga mengental menjadi karamel gula jawa yang harum. Kualitas gula kelapa Serayu Larangan terkenal murni tanpa bahan pengawet sintetik.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 410,
                'days_ago' => 12,
            ],
            [
                'user_id' => $managerOnje?->id ?? $adminId,
                'village_id' => $villageOnje?->id,
                'title' => 'Menelusuri Jejak Sejarah Kadipaten Onje, Cikal Bakal Purbalingga',
                'content' => '<h1>Desa Onje: Akar Peradaban Purbalingga</h1><p>Jauh sebelum Kabupaten Purbalingga terbentuk seperti sekarang, terdapat sebuah wilayah kuno yang menjadi pusat pemerintahan dan kebudayaan di tepian Sungai Klawing. Inilah Desa Onje yang menyimpan warisan sejarah luar biasa.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 342,
                'days_ago' => 18,
            ],
            [
                'user_id' => $managerCipaku?->id ?? $adminId,
                'village_id' => $villageCipaku?->id,
                'title' => 'Mengungkap Misteri Tulisan Kuno di Situs Batu Tulis Cipaku',
                'content' => '<h1>Peradaban Kuno Tersembunyi di Desa Cipaku</h1><p>Di sudut tenang Desa Cipaku, tersimpan sebuah rahasia arkeologis yang telah bertahan selama berabad-abad. Situs Batu Tulis Cipaku menjadi bukti nyata peradaban kuno di lereng Gunung Slamet.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 189,
                'days_ago' => 25,
            ],
            [
                'user_id' => $adminId,
                'village_id' => $villagePengadegan?->id,
                'title' => 'Ekowisata Hutan Pinus Pengadegan: Sejuk di Lereng Gunung Slamet',
                'content' => '<h1>Melarikan Diri ke Rimbunnya Hutan Pinus Pengadegan</h1><p>Terletak di lereng bawah Gunung Slamet, kawasan hutan pinus ini menawarkan pengalaman alam autentik yang kini semakin populer di kalangan wisatawan lokal.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 112,
                'days_ago' => 3,
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
                'village_id' => $data['village_id'],
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
