<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Enums\DestinationCategory;
use App\Enums\UmkmCategory;
use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Umkm;
use Inertia\Inertia;
use Inertia\Response;

class PublicMapController extends Controller
{
    public function index(): Response
    {
        $destinations = Destination::with(['primaryMedia', 'umkm:id,name,slug'])
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
                    'gmaps_link' => $destination->gmaps_link,
                    'umkm_name' => $destination->umkm?->name,
                    'umkm_slug' => $destination->umkm?->slug,
                    'primary_media' => $destination->primaryMedia ? [
                        'file_path' => $destination->primaryMedia->file_path,
                    ] : null,
                ];
            });

        $umkms = Umkm::with(['primaryMedia'])
            ->where('status', ContentStatus::Published)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(function ($umkm) {
                return [
                    'id' => $umkm->id,
                    'type' => 'umkm',
                    'name' => $umkm->name,
                    'slug' => $umkm->slug,
                    'category' => $umkm->category?->value,
                    'category_label' => $umkm->category?->label(),
                    'owner_name' => $umkm->owner_name,
                    'price_range' => $umkm->price_range,
                    'latitude' => (float) $umkm->latitude,
                    'longitude' => (float) $umkm->longitude,
                    'gmaps_link' => $umkm->gmaps_link,
                    'primary_media' => $umkm->primaryMedia ? [
                        'file_path' => $umkm->primaryMedia->file_path,
                    ] : null,
                ];
            });

        $categories = collect(DestinationCategory::cases())->map(fn ($cat) => [
            'value' => $cat->value,
            'label' => $cat->label(),
        ]);

        $umkmCategories = collect(UmkmCategory::cases())->map(fn ($cat) => [
            'value' => $cat->value,
            'label' => $cat->label(),
        ]);

        return Inertia::render('public/map/index', [
            'destinations' => $destinations,
            'umkms' => $umkms,
            'categories' => $categories,
            'umkmCategories' => $umkmCategories,
        ]);
    }
}
