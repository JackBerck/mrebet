<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PublicVillageController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $villages = Village::with(['primaryMedia'])
            ->withCount([
                'destinations' => function ($query) {
                    $query->where('status', ContentStatus::Published);
                },
                'events' => function ($query) {
                    $query->where('status', ContentStatus::Published);
                },
            ])
            ->where('status', ContentStatus::Published)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/villages/index', [
            'villages' => $villages,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(Village $village): Response
    {
        abort_if(! $village->isPublished(), 404);

        $village->load(['media']);

        // Load destinations in this village
        $destinations = $village->destinations()
            ->with(['primaryMedia'])
            ->where('status', ContentStatus::Published)
            ->latest()
            ->limit(6)
            ->get();

        $destinations->transform(function ($dest) {
            $dest->category_label = $dest->category->label();

            return $dest;
        });

        // Load upcoming/active events in this village
        $events = $village->events()
            ->with(['primaryMedia'])
            ->where('status', ContentStatus::Published)
            ->whereDate('end_date', '>=', Carbon::today())
            ->orderBy('start_date', 'asc')
            ->limit(4)
            ->get();

        // Load blogs related to this village
        $blogs = $village->blogs()
            ->with(['author:id,full_name'])
            ->where('status', ContentStatus::Published)
            ->latest('published_at')
            ->limit(3)
            ->get();

        // Other villages for recommendation
        $relatedVillages = Village::with(['primaryMedia'])
            ->withCount([
                'destinations' => function ($query) {
                    $query->where('status', ContentStatus::Published);
                },
            ])
            ->where('status', ContentStatus::Published)
            ->where('id', '!=', $village->id)
            ->inRandomOrder()
            ->limit(3)
            ->get();

        return Inertia::render('public/villages/show', [
            'village' => $village,
            'destinations' => $destinations,
            'events' => $events,
            'blogs' => $blogs,
            'relatedVillages' => $relatedVillages,
        ]);
    }
}
