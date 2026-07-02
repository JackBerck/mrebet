<?php

namespace App\Observers;

use App\Models\Village;
use Illuminate\Support\Facades\DB;

class VillageObserver
{
    /**
     * Auto-set POINT spatial column from latitude + longitude before save.
     * Runs on both creating and updating to keep point in sync.
     */
    public function saving(Village $village): void
    {
        if ($village->latitude !== null && $village->longitude !== null) {
            DB::statement(
                'UPDATE villages SET point = ST_SRID(POINT(?, ?), 4326) WHERE id = ?',
                [$village->longitude, $village->latitude, $village->id]
            );
        }
    }

    /**
     * Handle the Village "created" event.
     * After insert, sync POINT from lat/lng (ID now exists).
     */
    public function created(Village $village): void
    {
        if ($village->latitude !== null && $village->longitude !== null) {
            DB::statement(
                'UPDATE villages SET point = ST_SRID(POINT(?, ?), 4326) WHERE id = ?',
                [$village->longitude, $village->latitude, $village->id]
            );
        }
    }

    /**
     * Handle the Village "updated" event.
     */
    public function updated(Village $village): void
    {
        if ($village->wasChanged(['latitude', 'longitude']) && $village->latitude !== null && $village->longitude !== null) {
            DB::statement(
                'UPDATE villages SET point = ST_SRID(POINT(?, ?), 4326) WHERE id = ?',
                [$village->longitude, $village->latitude, $village->id]
            );
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
