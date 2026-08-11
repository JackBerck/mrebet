<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function getSettings(): array
    {
        return Cache::rememberForever('site_settings', function () {
            $defaults = [
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
            ];

            try {
                $dbSettings = static::pluck('value', 'key')->all();

                return array_merge($defaults, $dbSettings);
            } catch (\Throwable $e) {
                return $defaults;
            }
        });
    }

    public static function setMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            static::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        Cache::forget('site_settings');
    }
}
