<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        if ($isAdmin) {
            $stats = [
                'villages' => Village::count(),
                'destinations' => Destination::count(),
                'events' => Event::count(),
                'blogs' => Blog::count(),
                'published_villages' => Village::where('status', 'published')->count(),
                'draft_villages' => Village::where('status', 'draft')->count(),
                'published_destinations' => Destination::where('status', 'published')->count(),
                'draft_destinations' => Destination::where('status', 'draft')->count(),
                'published_events' => Event::where('status', 'published')->count(),
                'draft_events' => Event::where('status', 'draft')->count(),
                'published_blogs' => Blog::where('status', 'published')->count(),
                'draft_blogs' => Blog::where('status', 'draft')->count(),
            ];

            $recentVillages = Village::with('primaryMedia')
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'slug', 'status', 'head_name', 'created_at']);

            $upcomingEvents = Event::with('village:id,name')
                ->where('status', 'published')
                ->where('start_date', '>=', now())
                ->orderBy('start_date')
                ->take(4)
                ->get(['id', 'title', 'slug', 'start_date', 'start_time', 'village_id', 'ticket_price']);

            $recentDestinations = Destination::with('village:id,name')
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'slug', 'category', 'status', 'village_id', 'created_at']);

            $recentBlogs = Blog::with('author:id,full_name')
                ->latest()
                ->take(5)
                ->get(['id', 'title', 'slug', 'status', 'views_count', 'user_id', 'created_at']);

            return Inertia::render('Admin/Dashboard', [
                'isAdmin' => true,
                'stats' => $stats,
                'recentVillages' => $recentVillages,
                'upcomingEvents' => $upcomingEvents,
                'recentDestinations' => $recentDestinations,
                'recentBlogs' => $recentBlogs,
            ]);
        }

        // Manager view — scoped to own village
        $village = $user->village()->with('media')->first();

        $stats = [
            'destinations' => Destination::where('village_id', $user->village_id)->count(),
            'events' => Event::where('village_id', $user->village_id)->count(),
            'blogs' => Blog::where('village_id', $user->village_id)->count(),
            'published_destinations' => Destination::where('village_id', $user->village_id)->where('status', 'published')->count(),
            'draft_destinations' => Destination::where('village_id', $user->village_id)->where('status', 'draft')->count(),
            'published_events' => Event::where('village_id', $user->village_id)->where('status', 'published')->count(),
            'draft_events' => Event::where('village_id', $user->village_id)->where('status', 'draft')->count(),
            'published_blogs' => Blog::where('village_id', $user->village_id)->where('status', 'published')->count(),
            'draft_blogs' => Blog::where('village_id', $user->village_id)->where('status', 'draft')->count(),
        ];

        $recentDestinations = Destination::where('village_id', $user->village_id)
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'slug', 'category', 'status', 'created_at']);

        $recentBlogs = Blog::where('village_id', $user->village_id)
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'status', 'views_count', 'created_at']);

        $upcomingEvents = Event::where('village_id', $user->village_id)
            ->where('status', 'published')
            ->where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(3)
            ->get(['id', 'title', 'slug', 'start_date', 'start_time', 'ticket_price']);

        return Inertia::render('Admin/Dashboard', [
            'isAdmin' => false,
            'stats' => $stats,
            'village' => $village,
            'upcomingEvents' => $upcomingEvents,
            'recentDestinations' => $recentDestinations,
            'recentBlogs' => $recentBlogs,
        ]);
    }
}
