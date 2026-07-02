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
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();

        // Pakai akun admin sebagai penulis default semua blog seed
        $admin = DB::table('users')->where('role', 'admin')->first();
        $adminId = $admin?->id;

        // Manager masing-masing desa sebagai penulis blog desa mereka
        $managerOnje = DB::table('users')->where('email', 'manager.onje@mrebet.id')->first();
        $managerCipaku = DB::table('users')->where('email', 'manager.cipaku@mrebet.id')->first();
        $managerMrebet = DB::table('users')->where('email', 'manager.mrebet@mrebet.id')->first();
        $managerSerayu = DB::table('users')->where('email', 'manager.serayularangan@mrebet.id')->first();

        $blogs = [
            [
                'user_id' => $managerOnje?->id ?? $adminId,
                'village_id' => $villageOnje?->id,
                'title' => 'Menelusuri Jejak Sejarah Kadipaten Onje, Cikal Bakal Purbalingga',
                'content' => '<h1>Desa Onje: Akar Peradaban Purbalingga</h1><p>Jauh sebelum Kabupaten Purbalingga terbentuk seperti sekarang, terdapat sebuah wilayah kuno yang menjadi pusat pemerintahan dan kebudayaan di tepian Sungai Klawing. Inilah Desa Onje, sebuah desa kecil di Kecamatan Mrebet yang menyimpan warisan sejarah luar biasa sebagai cikal bakal terbentuknya Kabupaten Purbalingga.</p><h2>Kompleks Masjid Kuno Raden Sayyid Kuning</h2><p>Salah satu peninggalan paling berharga adalah Masjid Kuno Raden Sayyid Kuning yang diperkirakan dibangun pada abad ke-16. Masjid ini memiliki arsitektur unik dengan tiang soko guru dari kayu jati tua dan atap limasan berlapis yang mencerminkan perpaduan budaya Hindu-Islam pada masa transisi.</p><h2>Makam Adipati Onje dan Tradisi Grebeg</h2><p>Di kompleks yang sama, terdapat makam para Adipati Onje yang menjadi tujuan ziarah masyarakat dari berbagai daerah, terutama menjelang bulan Ramadhan. Tradisi Grebeg Onje yang digelar setiap tahun menjadi puncak ekspresi budaya masyarakat Onje dalam melestarikan warisan leluhur mereka.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 342,
                'days_ago' => 15,
            ],
            [
                'user_id' => $managerSerayu?->id ?? $adminId,
                'village_id' => $villageSerayuLarangan?->id,
                'title' => 'Serayu Larangan: Desa Percontohan Anti-Korupsi KPK RI',
                'content' => '<h1>Dari Desa ke Panggung Nasional: Transparansi Serayu Larangan</h1><p>Di antara hamparan sawah dan irigasi tertata rapi Kecamatan Mrebet, Desa Serayu Larangan berhasil mengukir prestasi nasional yang membanggakan. Desa ini terpilih menjadi salah satu Desa Percontohan Anti-Korupsi oleh Komisi Pemberantasan Korupsi (KPK) RI berkat komitmennya dalam transparansi tata kelola pemerintahan desa.</p><h2>Inovasi Digital Pelayanan Publik</h2><p>Masyarakat kini dapat mengakses laporan keuangan desa secara real-time melalui papan informasi digital yang terpasang di balai desa. Pengajuan surat menyurat hingga pemantauan progres pembangunan fisik bisa dipantau secara langsung, menciptakan ekosistem pemerintahan yang bersih dan akuntabel.</p><h2>Tata Kelola Irigasi Pertanian yang Maju</h2><p>Selain digitalisasi administrasi, Serayu Larangan juga dikenal dengan sistem irigasi pertanian modernnya yang mendukung produktivitas pertanian lokal. Potensi ini menjadikan desa ini bukan hanya contoh tata kelola yang baik, tetapi juga model pemberdayaan ekonomi desa berbasis pertanian.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 512,
                'days_ago' => 8,
            ],
            [
                'user_id' => $managerCipaku?->id ?? $adminId,
                'village_id' => $villageCipaku?->id,
                'title' => 'Mengungkap Misteri Tulisan Kuno di Situs Batu Tulis Cipaku',
                'content' => '<h1>Peradaban Kuno Tersembunyi di Desa Cipaku</h1><p>Di sudut tenang Desa Cipaku, Kecamatan Mrebet, tersimpan sebuah rahasia arkeologis yang telah bertahan selama berabad-abad. Situs Batu Tulis Cipaku, sebuah batu besar purba berukir karakter yang menyerupai aksara Jawa Kuno atau Palawa, menjadi bukti nyata bahwa peradaban melek literasi sudah ada di wilayah Purbalingga jauh sebelum era modern.</p><h2>Penelitian Arkeologis yang Berkelanjutan</h2><p>Para ahli dari Balai Pelestarian Kebudayaan Wilayah IX Jawa Tengah secara berkala melakukan kajian terhadap situs ini. Meski beberapa bagian ukiran mulai terkikis cuaca, struktur utama batu masih terjaga cukup baik berkat upaya pelestarian komunitas lokal.</p><h2>Wisata Edukasi yang Berkembang</h2><p>Komunitas pemerhati sejarah Purbalingga secara aktif menyelenggarakan wisata edukasi ke situs ini, melibatkan pelajar dari berbagai sekolah di Kecamatan Mrebet. Kegiatan ini bertujuan menumbuhkan rasa bangga generasi muda terhadap kekayaan sejarah lokal mereka.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 189,
                'days_ago' => 22,
            ],
            [
                'user_id' => $managerMrebet?->id ?? $adminId,
                'village_id' => $villageMrebet?->id,
                'title' => 'Masjid Muhammad Cheng Hoo Mrebet: Simbol Harmoni di Jalur Utama',
                'content' => '<h1>Ikon Akulturasi Budaya di Jantung Mrebet</h1><p>Bagi siapapun yang melintas di jalan raya utama Kecamatan Mrebet, bangunan megah dengan dominasi warna merah, hijau, dan kuning berornamen khas kelenteng Tionghoa pasti langsung mencuri perhatian. Inilah Masjid Muhammad Cheng Hoo, masjid yang berdiri sebagai simbol nyata harmoni budaya dan toleransi antarumat beragama di Purbalingga.</p><h2>Arsitektur yang Memukau</h2><p>Masjid ini menggabungkan elemen arsitektur khas Tionghoa — atap melengkung, ornamen naga, dan palet warna cerah — dengan interior yang sepenuhnya Islami. Perpaduan ini bukan hanya indah secara estetika, tetapi juga menjadi pernyataan kuat bahwa Islam di Nusantara tumbuh dengan merangkul keanekaragaman budaya.</p><h2>Pusat Transit dan UMKM Lokal</h2><p>Area pelataran masjid berkembang menjadi rest area organik yang menampung puluhan pelaku UMKM asli Kecamatan Mrebet. Dari oleh-oleh khas Purbalingga hingga jajanan tradisional Banyumasan, semuanya tersedia di sini, menjadikan Cheng Hoo bukan sekadar destinasi religi tetapi juga penggerak ekonomi lokal.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 725,
                'days_ago' => 5,
            ],
            [
                'user_id' => $adminId,
                'village_id' => $villagePengadegan?->id,
                'title' => 'Ekowisata Hutan Pinus Pengadegan: Sejuk di Lereng Gunung Slamet',
                'content' => '<h1>Melarikan Diri ke Rimbunnya Hutan Pinus Pengadegan</h1><p>Bagi warga Purbalingga yang merindukan udara sejuk dan suasana alam yang tenang tanpa perlu menempuh perjalanan jauh, Ekowisata Hutan Pinus Pengadegan adalah jawabannya. Terletak di lereng bawah Gunung Slamet, kawasan hutan pinus ini menawarkan pengalaman alam autentik yang kini semakin populer di kalangan wisatawan lokal.</p><h2>Jalur Trekking dan Spot Foto</h2><p>Tersedia jalur trekking ringan yang cocok untuk semua usia, melewati jejeran pohon pinus menjulang tinggi dengan aroma khas daun pinus yang menyegarkan. Di beberapa titik strategis, terdapat spot foto yang instagramable dengan latar belakang puncak Gunung Slamet yang anggun.</p><h2>Kopi Sore dengan Panorama Gunung</h2><p>Yang menjadi keistimewaan tersendiri adalah menikmati kopi lokal Purbalingga di warung sederhana di dalam hutan sambil menatap siluet Gunung Slamet saat sore hari. Momen ini menjadi favorit para pengunjung yang mencari ketenangan di akhir pekan.</p>',
                'cover_image' => null,
                'status' => 'published',
                'views_count' => 98,
                'days_ago' => 3,
            ],
            // Draft — untuk testing tampilan draft di admin panel
            [
                'user_id' => $managerCipaku?->id ?? $adminId,
                'village_id' => $villageCipaku?->id,
                'title' => 'Potensi Agrowisata Cipaku yang Belum Terekspos (DRAFT)',
                'content' => '<h1>Potensi Tersembunyi Cipaku</h1><p>Artikel ini masih dalam tahap penulisan. Akan membahas potensi agrowisata Desa Cipaku yang belum banyak diketahui wisatawan, termasuk kebun salak, pertanian organik, dan home industry pengolahan hasil bumi setempat.</p>',
                'cover_image' => null,
                'status' => 'draft',
                'views_count' => 0,
                'days_ago' => 1,
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
