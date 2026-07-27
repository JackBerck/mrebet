<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogRequest;
use App\Http\Requests\Admin\UpdateBlogRequest;
use App\Models\Blog;
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

        $blogs = Blog::with(['author:id,full_name'])
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/blogs/index', [
            'blogs' => $blogs,
            'filters' => $request->only('search', 'status'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Blog::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        return Inertia::render('admin/blogs/form', [
            'blog' => null,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(StoreBlogRequest $request): RedirectResponse
    {
        $this->authorize('create', Blog::class);

        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        if ($request->status === ContentStatus::Published->value) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('blogs', 'public');
        }

        $blog = Blog::create($validated);

        return redirect()
            ->route('admin.blogs.edit', $blog)
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Blog $blog, Request $request): Response
    {
        $this->authorize('update', $blog);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        return Inertia::render('admin/blogs/form', [
            'blog' => $blog,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(UpdateBlogRequest $request, Blog $blog): RedirectResponse
    {
        $this->authorize('update', $blog);

        $validated = $request->validated();

        if ($blog->status !== ContentStatus::Published && $request->status === ContentStatus::Published->value) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            if ($blog->cover_image) {
                Storage::disk('public')->delete($blog->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('blogs', 'public');
        }

        $blog->update($validated);

        return back()->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Blog $blog): RedirectResponse
    {
        $this->authorize('delete', $blog);

        if ($blog->cover_image) {
            Storage::disk('public')->delete($blog->cover_image);
        }

        $blog->delete();

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Berita berhasil dihapus.');
    }

    public function updateStatus(Request $request, Blog $blog): RedirectResponse
    {
        $this->authorize('update', $blog);

        $request->validate(['status' => ['required', Rule::enum(ContentStatus::class)]]);

        $data = ['status' => $request->status];
        if ($request->status === ContentStatus::Published->value && ! $blog->published_at) {
            $data['published_at'] = now();
        }

        $blog->update($data);

        return back()->with('success', 'Status berita diperbarui.');
    }
}
