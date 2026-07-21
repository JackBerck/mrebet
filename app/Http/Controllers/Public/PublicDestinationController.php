<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Enums\DestinationCategory;
use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PublicDestinationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $destinations = Destination::with(['primaryMedia', 'village:id,name'])
            ->where('status', ContentStatus::Published)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        // Get categories for filter chips
        $categories = collect(DestinationCategory::cases())->map(function ($cat) {
            return [
                'value' => $cat->value,
                'label' => $cat->label(),
            ];
        });

        // Add category_label to each destination for frontend display
        $destinations->getCollection()->transform(function ($destination) {
            $destination->category_label = $destination->category->label();

            return $destination;
        });

        return Inertia::render('public/destinations/index', [
            'destinations' => $destinations,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function show(Destination $destination): Response
    {
        abort_if(! $destination->isPublished(), 404);

        $destination->load(['media', 'village:id,name,slug']);
        $destination->category_label = $destination->category->label();

        // Load events at this destination
        $events = $destination->events()
            ->with(['primaryMedia'])
            ->where('status', 'published')
            ->whereDate('end_date', '>=', Carbon::today()) // Active or upcoming events
            ->orderBy('start_date', 'asc')
            ->limit(3)
            ->get();

        $relatedDestinations = Destination::with(['primaryMedia', 'village:id,name'])
            ->where('status', ContentStatus::Published)
            ->where('id', '!=', $destination->id)
            ->where(function ($query) use ($destination) {
                $query->where('village_id', $destination->village_id)
                    ->orWhere('category', $destination->category->value);
            })
            ->inRandomOrder() // Mix it up
            ->limit(3)
            ->get();

        $relatedDestinations->transform(function ($dest) {
            $dest->category_label = $dest->category->label();

            return $dest;
        });

        return Inertia::render('public/destinations/show', [
            'destination' => $destination,
            'events' => $events,
            'relatedDestinations' => $relatedDestinations,
        ]);
    }
}
