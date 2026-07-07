<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Village;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredDestinations = Destination::with(['village:id,name', 'primaryMedia'])
            ->where('status', 'published')
            ->latest()
            ->take(4)
            ->get(['id', 'name', 'slug', 'category', 'description', 'ticket_price', 'village_id', 'latitude', 'longitude', 'qr_code_target']);

        $upcomingEvents = Event::with('village:id,name')
            ->where('status', 'published')
            ->where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(4)
            ->get(['id', 'title', 'slug', 'description', 'start_date', 'end_date', 'start_time', 'ticket_price', 'organizer', 'village_id']);

        $latestBlogs = Blog::with('author:id,full_name')
            ->where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get(['id', 'title', 'slug', 'cover_image', 'views_count', 'user_id', 'published_at']);

        $stats = [
            'villages' => Village::where('status', 'published')->count(),
            'destinations' => Destination::where('status', 'published')->count(),
            'events' => Event::where('status', 'published')->count(),
        ];

        return Inertia::render('home', [
            'featuredDestinations' => $featuredDestinations,
            'upcomingEvents' => $upcomingEvents,
            'latestBlogs' => $latestBlogs,
            'stats' => $stats,
        ]);
    }
}
