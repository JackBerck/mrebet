<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Umkm;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = config('app.url', url('/'));

        $destinations = Destination::where('status', ContentStatus::Published)
            ->select(['slug', 'updated_at'])
            ->get();

        $umkms = Umkm::where('status', ContentStatus::Published)
            ->select(['slug', 'updated_at'])
            ->get();

        $events = Event::where('status', ContentStatus::Published)
            ->select(['slug', 'updated_at'])
            ->get();

        $blogs = Blog::where('status', ContentStatus::Published)
            ->select(['slug', 'updated_at', 'published_at'])
            ->get();

        $staticPages = [
            ['url' => '', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/destinasi', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/umkm', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/event', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/berita', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/peta', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => '/tentang', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/faq', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/panduan', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/kemitraan', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/privacy-policy', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['url' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        $content = view('sitemap', compact(
            'baseUrl',
            'staticPages',
            'destinations',
            'umkms',
            'events',
            'blogs'
        ))->render();

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
