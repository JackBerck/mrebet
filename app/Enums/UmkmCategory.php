<?php

namespace App\Enums;

enum UmkmCategory: string
{
    case Kuliner = 'kuliner';
    case Kerajinan = 'kerajinan';
    case PertanianOlahan = 'pertanian_olahan';
    case Jasa = 'jasa';
    case Warung = 'warung';
    case Lainnya = 'lainnya';

    public function label(): string
    {
        return match ($this) {
            self::Kuliner => 'Kuliner & Makanan',
            self::Kerajinan => 'Kerajinan & Kesenian',
            self::PertanianOlahan => 'Hasil Tani & Olahan Nira',
            self::Jasa => 'Layanan & Jasa',
            self::Warung => 'Warung & Toko Kelontong',
            self::Lainnya => 'Usaha Lainnya',
        };
    }
}
