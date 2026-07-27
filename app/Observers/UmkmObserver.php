<?php

namespace App\Observers;

use App\Models\Umkm;
use App\Support\Spatial;

class UmkmObserver
{
    public function creating(Umkm $umkm): void
    {
        $lat = $umkm->latitude ?? -7.3235;
        $lng = $umkm->longitude ?? 109.3642;

        $umkm->point = Spatial::point($lat, $lng);
    }

    public function updating(Umkm $umkm): void
    {
        if ($umkm->isDirty(['latitude', 'longitude'])) {
            $lat = $umkm->latitude ?? -7.3235;
            $lng = $umkm->longitude ?? 109.3642;

            $umkm->point = Spatial::point($lat, $lng);
        }
    }
}
