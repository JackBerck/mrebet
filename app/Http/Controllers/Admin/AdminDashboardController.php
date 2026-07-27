<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $stats = [
            'umkms' => Umkm::count(),
            'destinations' => Destination::count(),
            'events' => Event::count(),
            'blogs' => Blog::count(),
            'published_umkms' => Umkm::where('status', 'published')->count(),
            'draft_umkms' => Umkm::where('status', 'draft')->count(),
            'published_destinations' => Destination::where('status', 'published')->count(),
            'draft_destinations' => Destination::where('status', 'draft')->count(),
            'published_events' => Event::where('status', 'published')->count(),
            'draft_events' => Event::where('status', 'draft')->count(),
            'published_blogs' => Blog::where('status', 'published')->count(),
            'draft_blogs' => Blog::where('status', 'draft')->count(),
        ];

        $recentUmkms = Umkm::with('primaryMedia')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'slug', 'category', 'status', 'owner_name', 'created_at']);

        $upcomingEvents = Event::where('status', 'published')
            ->where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(4)
            ->get(['id', 'title', 'slug', 'start_date', 'start_time', 'ticket_price']);

        $recentDestinations = Destination::latest()
            ->take(5)
            ->get(['id', 'name', 'slug', 'category', 'status', 'created_at']);

        $recentBlogs = Blog::with('author:id,full_name')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'status', 'views_count', 'user_id', 'created_at']);

        return Inertia::render('admin/dashboard', [
            'isAdmin' => $isAdmin,
            'stats' => $stats,
            'recentUmkms' => $recentUmkms,
            'upcomingEvents' => $upcomingEvents,
            'recentDestinations' => $recentDestinations,
            'recentBlogs' => $recentBlogs,
        ]);
    }
}
