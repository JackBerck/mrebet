<?php

namespace App\Observers;

use App\Models\Village;
use Illuminate\Support\Facades\DB;

class VillageObserver
{
    /**
     * Auto-set POINT spatial column from latitude + longitude before insert.
     */
    public function creating(Village $village): void
    {
        $lat = $village->latitude ?? -7.324;
        $lng = $village->longitude ?? 109.364;

        $village->point = DB::raw("ST_SRID(POINT({$lng}, {$lat}), 4326)");
    }

    /**
     * Auto-sync POINT if lat/lng changed before update.
     */
    public function updating(Village $village): void
    {
        if ($village->isDirty(['latitude', 'longitude'])) {
            $lat = $village->latitude ?? -7.324;
            $lng = $village->longitude ?? 109.364;

            $village->point = DB::raw("ST_SRID(POINT({$lng}, {$lat}), 4326)");
        }
    }

    /**
     * Handle the Village "deleted" event.
     */
    public function deleted(Village $village): void
    {
        //
    }

    /**
     * Handle the Village "restored" event.
     */
    public function restored(Village $village): void
    {
        //
    }

    /**
     * Handle the Village "force deleted" event.
     */
    public function forceDeleted(Village $village): void
    {
        //
    }
}
