<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::setMany([
            'site_name' => 'Desa Wisata Serayu Larangan',
            'contact_phone' => '+62 813-9848-0422',
            'contact_whatsapp' => '6281398480422',
            'contact_email' => 'info@serayularangan.desa.id',
            'contact_address' => 'Desa Serayu Larangan, Kec. Mrebet, Kab. Purbalingga, Jawa Tengah 53352',
            'gmaps_link' => 'https://maps.app.goo.gl/FMsGayqxuncMJUuU7',
            'operational_hours' => 'Senin - Minggu: 08.00 - 17.00 WIB',
            'instagram_url' => 'https://instagram.com',
            'facebook_url' => 'https://facebook.com',
            'youtube_url' => 'https://youtube.com',
            'tiktok_url' => 'https://tiktok.com',
        ]);
    }
}
