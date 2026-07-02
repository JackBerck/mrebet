<?php

namespace App\Enums;

enum DestinationCategory: string
{
    case Alam = 'alam';
    case Budaya = 'budaya';
    case Buatan = 'buatan';

    public function label(): string
    {
        return match ($this) {
            self::Alam => 'Wisata Alam',
            self::Budaya => 'Wisata Budaya & Religi',
            self::Buatan => 'Wisata Buatan',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::Alam => 'tree-pine',
            self::Budaya => 'landmark',
            self::Buatan => 'ferris-wheel',
        };
    }
}
