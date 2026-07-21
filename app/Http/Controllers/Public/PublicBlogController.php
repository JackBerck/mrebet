<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicBlogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $blogs = Blog::with(['author:id,full_name', 'village:id,name'])
            ->where('status', ContentStatus::Published)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/blogs/index', [
            'blogs' => $blogs,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Blog $blog): Response
    {
        abort_if(! $blog->isPublished(), 404);

        $blog->incrementViews();

        $blog->load(['author:id,full_name', 'village:id,name,slug']);

        $relatedBlogs = Blog::with(['author:id,full_name', 'village:id,name'])
            ->where('status', ContentStatus::Published)
            ->where('id', '!=', $blog->id)
            ->where(function ($query) use ($blog) {
                $query->where('village_id', $blog->village_id)
                    ->orWhere('user_id', $blog->user_id);
            })
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('public/blogs/show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }
}
