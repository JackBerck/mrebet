<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Enums\DestinationCategory;
use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Village;
use Inertia\Inertia;
use Inertia\Response;

class PublicMapController extends Controller
{
    public function index(): Response
    {
        // Load destinations with coordinates
        $destinations = Destination::with(['primaryMedia', 'village:id,name,slug'])
            ->where('status', ContentStatus::Published)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(function ($destination) {
                return [
                    'id' => $destination->id,
                    'type' => 'destination',
                    'name' => $destination->name,
                    'slug' => $destination->slug,
                    'category' => $destination->category->value,
                    'category_label' => $destination->category->label(),
                    'ticket_price' => (float) $destination->ticket_price,
                    'ticket_info' => $destination->ticket_info,
                    'open_time' => $destination->open_time ? substr($destination->open_time, 0, 5) : null,
                    'close_time' => $destination->close_time ? substr($destination->close_time, 0, 5) : null,
                    'latitude' => (float) $destination->latitude,
                    'longitude' => (float) $destination->longitude,
                    'village_name' => $destination->village?->name,
                    'village_slug' => $destination->village?->slug,
                    'primary_media' => $destination->primaryMedia ? [
                        'file_path' => $destination->primaryMedia->file_path,
                    ] : null,
                ];
            });

        // Load villages with coordinates
        $villages = Village::with(['primaryMedia'])
            ->withCount([
                'destinations' => function ($query) {
                    $query->where('status', ContentStatus::Published);
                },
            ])
            ->where('status', ContentStatus::Published)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(function ($village) {
                return [
                    'id' => $village->id,
                    'type' => 'village',
                    'name' => $village->name,
                    'slug' => $village->slug,
                    'latitude' => (float) $village->latitude,
                    'longitude' => (float) $village->longitude,
                    'destinations_count' => $village->destinations_count,
                    'primary_media' => $village->primaryMedia ? [
                        'file_path' => $village->primaryMedia->file_path,
                    ] : null,
                ];
            });

        $categories = collect(DestinationCategory::cases())->map(function ($cat) {
            return [
                'value' => $cat->value,
                'label' => $cat->label(),
            ];
        });

        return Inertia::render('public/map/index', [
            'destinations' => $destinations,
            'villages' => $villages,
            'categories' => $categories,
        ]);
    }
}
