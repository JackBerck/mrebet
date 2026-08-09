<?php

namespace App\Concerns;

use Illuminate\Support\Facades\Http;
use Throwable;

trait HasGmapsCoordinates
{
    protected static function bootHasGmapsCoordinates(): void
    {
        static::saving(function (self $model) {
            if ($model->isDirty('gmaps_link') && $model->gmaps_link) {
                $model->resolveGmapsCoordinates();
            }
        });
    }

    public function resolveGmapsCoordinates(): void
    {
        $link = $this->gmaps_link;
        if (! $link) {
            return;
        }

        $finalUrl = $link;
        if (str_contains($link, 'maps.app.goo.gl') || str_contains($link, 'goo.gl')) {
            try {
                $response = Http::timeout(5)->withOptions(['allow_redirects' => true])->get($link);
                $effectiveUri = (string) $response->effectiveUri();
                if ($effectiveUri) {
                    $finalUrl = urldecode($effectiveUri);
                }
            } catch (Throwable) {
                // Ignore timeout or network errors
            }
        }

        // 1. Try pinpoint regex: !3d-7.2908015!4d109.3335108
        if (preg_match('/!3d([-+]?\d+\.\d+)!4d([-+]?\d+\.\d+)/', $finalUrl, $matches)) {
            $this->latitude = (float) $matches[1];
            $this->longitude = (float) $matches[2];

            return;
        }

        // 2. Try map center regex: /@-7.2907331,109.3330722
        if (preg_match('/\/@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/', $finalUrl, $matches)) {
            $this->latitude = (float) $matches[1];
            $this->longitude = (float) $matches[2];

            return;
        }

        // 3. Try query param regex: q=-7.3235410,109.3642100
        if (preg_match('/[-+]?\d+\.\d+,\s*[-+]?\d+\.\d+/', $finalUrl, $matches)) {
            [$lat, $lng] = explode(',', $matches[0]);
            $this->latitude = (float) trim($lat);
            $this->longitude = (float) trim($lng);

            return;
        }
    }
}
