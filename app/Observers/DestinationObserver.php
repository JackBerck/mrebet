<?php

namespace App\Observers;

use App\Models\Destination;
use Illuminate\Support\Facades\DB;

class DestinationObserver
{
    /**
     * Auto-set POINT spatial column from latitude + longitude after insert.
     */
    public function created(Destination $destination): void
    {
        if ($destination->latitude !== null && $destination->longitude !== null) {
            DB::statement(
                'UPDATE destinations SET point = ST_SRID(POINT(?, ?), 4326) WHERE id = ?',
                [$destination->longitude, $destination->latitude, $destination->id]
            );
        }
    }

    /**
     * Auto-sync POINT if lat/lng changed on update.
     */
    public function updated(Destination $destination): void
    {
        if ($destination->wasChanged(['latitude', 'longitude']) && $destination->latitude !== null && $destination->longitude !== null) {
            DB::statement(
                'UPDATE destinations SET point = ST_SRID(POINT(?, ?), 4326) WHERE id = ?',
                [$destination->longitude, $destination->latitude, $destination->id]
            );
        }
    }

    /**
     * Handle the Destination "deleted" event.
     */
    public function deleted(Destination $destination): void
    {
        //
    }

    /**
     * Handle the Destination "restored" event.
     */
    public function restored(Destination $destination): void
    {
        //
    }

    /**
     * Handle the Destination "force deleted" event.
     */
    public function forceDeleted(Destination $destination): void
    {
        //
    }
}
