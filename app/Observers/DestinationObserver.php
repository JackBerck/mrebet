<?php

namespace App\Observers;

use App\Models\Destination;
use App\Support\Spatial;

class DestinationObserver
{
    /**
     * Auto-set POINT spatial column from latitude + longitude before insert.
     */
    public function creating(Destination $destination): void
    {
        $lat = $destination->latitude ?? -7.324;
        $lng = $destination->longitude ?? 109.364;

        $destination->point = Spatial::point($lat, $lng);
    }

    /**
     * Auto-sync POINT if lat/lng changed before update.
     */
    public function updating(Destination $destination): void
    {
        if ($destination->isDirty(['latitude', 'longitude'])) {
            $lat = $destination->latitude ?? -7.324;
            $lng = $destination->longitude ?? 109.364;

            $destination->point = Spatial::point($lat, $lng);
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
