<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogRequest;
use App\Http\Requests\Admin\UpdateBlogRequest;
use App\Models\Blog;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminBlogController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $query = Blog::with(['author:id,full_name', 'village:id,name'])
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when(! $isAdmin, fn ($q) => $q->where('village_id', $user->village_id));

        if ($isAdmin && $request->village_id) {
            $query->where('village_id', $request->village_id);
        }

        $blogs = $query->latest()->paginate(15)->withQueryString();

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect();

        return Inertia::render('admin/blogs/index', [
            'blogs' => $blogs,
            'villages' => $villages,
            'filters' => $request->only('search', 'status', 'village_id'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Blog::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect([['id' => $user->village_id, 'name' => $user->village?->name]]);

        return Inertia::render('admin/blogs/form', [
            'blog' => null,
            'villages' => $villages,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(StoreBlogRequest $request): RedirectResponse
    {
        $this->authorize('create', Blog::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $validated = $request->safe()->except('cover_image');

        // Manager auto-assign village
        if (! $isAdmin) {
            $validated['village_id'] = $user->village_id;
        }

        $validated['user_id'] = $user->id;

        // Auto-set published_at when publishing
        if ($validated['status'] === ContentStatus::Published->value) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('blogs', 'public');
        }

        $blog = Blog::create($validated);

        return redirect()
            ->route('admin.blogs.edit', $blog)
            ->with('success', 'Artikel berhasil ditambahkan.');
    }

    public function edit(Blog $blog, Request $request): Response
    {
        $this->authorize('update', $blog);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect([['id' => $user->village_id, 'name' => $user->village?->name]]);

        return Inertia::render('admin/blogs/form', [
            'blog' => $blog,
            'villages' => $villages,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(UpdateBlogRequest $request, Blog $blog): RedirectResponse
    {
        $this->authorize('update', $blog);

        $validated = $request->safe()->except(['cover_image', 'remove_cover']);

        // Auto-set published_at on first publish
        if ($validated['status'] === ContentStatus::Published->value && ! $blog->published_at) {
            $validated['published_at'] = now();
        }

        // Remove old cover if requested
        if ($request->boolean('remove_cover') && $blog->cover_image) {
            Storage::disk('public')->delete($blog->cover_image);
            $validated['cover_image'] = null;
        }

        // Upload new cover
        if ($request->hasFile('cover_image')) {
            if ($blog->cover_image) {
                Storage::disk('public')->delete($blog->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('blogs', 'public');
        }

        $blog->update($validated);

        return back()->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Blog $blog): RedirectResponse
    {
        $this->authorize('delete', $blog);

        // Delete cover image from disk
        if ($blog->cover_image) {
            Storage::disk('public')->delete($blog->cover_image);
        }

        $blog->delete();

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Artikel berhasil dihapus.');
    }

    public function updateStatus(Request $request, Blog $blog): RedirectResponse
    {
        $this->authorize('update', $blog);

        $request->validate(['status' => ['required', Rule::enum(ContentStatus::class)]]);

        $updates = ['status' => $request->status];

        if ($request->status === ContentStatus::Published->value && ! $blog->published_at) {
            $updates['published_at'] = now();
        }

        $blog->update($updates);

        return back()->with('success', 'Status artikel diperbarui.');
    }
}
