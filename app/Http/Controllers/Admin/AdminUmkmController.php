<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UmkmCategory;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUmkmRequest;
use App\Http\Requests\Admin\UpdateUmkmRequest;
use App\Models\Blog;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Umkm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminUmkmController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        if (! $isAdmin) {
            $umkm = $user->umkm()->first();
            if ($umkm) {
                $umkm->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

                $recentDestinations = Destination::latest()->take(5)->get(['id', 'name', 'slug', 'category', 'status', 'created_at']);
                $recentEvents = Event::latest()->take(5)->get(['id', 'title', 'slug', 'start_date', 'start_time', 'status', 'ticket_price']);
                $recentBlogs = Blog::latest()->take(5)->get(['id', 'title', 'slug', 'status', 'views_count', 'created_at']);

                return Inertia::render('admin/umkms/show', [
                    'umkm' => $umkm,
                    'recentDestinations' => $recentDestinations,
                    'recentEvents' => $recentEvents,
                    'recentBlogs' => $recentBlogs,
                    'isAdmin' => false,
                ]);
            }
        }

        $query = Umkm::with('primaryMedia')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('owner_name', 'like', "%{$s}%"))
            ->when($request->category, fn ($q, $s) => $q->where('category', $s))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s));

        $umkms = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/umkms/index', [
            'umkms' => $umkms,
            'categories' => collect(UmkmCategory::cases())->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()]),
            'filters' => $request->only('search', 'category', 'status'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Umkm::class);

        return Inertia::render('admin/umkms/form', [
            'umkm' => null,
            'categories' => collect(UmkmCategory::cases())->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()]),
            'isAdmin' => request()->user()->role === UserRole::Admin,
        ]);
    }

    public function store(StoreUmkmRequest $request): RedirectResponse
    {
        $this->authorize('create', Umkm::class);

        $umkm = Umkm::create($request->validated());

        $this->handleMediaUploads($request, $umkm);

        return redirect()
            ->route('admin.umkms.edit', $umkm)
            ->with('success', 'UMKM berhasil ditambahkan.');
    }

    public function show(Umkm $umkm): Response
    {
        $this->authorize('view', $umkm);

        $umkm->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        $recentDestinations = Destination::latest()->take(5)->get(['id', 'name', 'slug', 'category', 'status', 'created_at']);
        $recentEvents = Event::latest()->take(5)->get(['id', 'title', 'slug', 'start_date', 'start_time', 'status', 'ticket_price']);
        $recentBlogs = Blog::latest()->take(5)->get(['id', 'title', 'slug', 'status', 'views_count', 'created_at']);

        return Inertia::render('admin/umkms/show', [
            'umkm' => $umkm,
            'recentDestinations' => $recentDestinations,
            'recentEvents' => $recentEvents,
            'recentBlogs' => $recentBlogs,
            'isAdmin' => request()->user()->role === UserRole::Admin,
        ]);
    }

    public function edit(Umkm $umkm): Response
    {
        $this->authorize('update', $umkm);

        $umkm->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        return Inertia::render('admin/umkms/form', [
            'umkm' => $umkm,
            'categories' => collect(UmkmCategory::cases())->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()]),
            'isAdmin' => request()->user()->role === UserRole::Admin,
        ]);
    }

    public function update(UpdateUmkmRequest $request, Umkm $umkm): RedirectResponse
    {
        $this->authorize('update', $umkm);

        $umkm->update($request->validated());

        $this->handleMediaUploads($request, $umkm);

        if ($request->remove_media_ids) {
            $mediaToDelete = $umkm->media()->whereIn('id', $request->remove_media_ids)->get();
            foreach ($mediaToDelete as $media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
        }

        return back()->with('success', 'UMKM berhasil diperbarui.');
    }

    public function destroy(Umkm $umkm): RedirectResponse
    {
        $this->authorize('delete', $umkm);

        $umkm->delete();

        return redirect()
            ->route('admin.umkms.index')
            ->with('success', 'UMKM berhasil dihapus.');
    }

    public function updateStatus(Request $request, Umkm $umkm): RedirectResponse
    {
        $this->authorize('update', $umkm);

        $request->validate(['status' => ['required', Rule::enum(ContentStatus::class)]]);

        $umkm->update(['status' => $request->status]);

        return back()->with('success', 'Status UMKM diperbarui.');
    }

    private function handleMediaUploads(Request $request, Umkm $umkm): void
    {
        if ($request->hasFile('primary_image')) {
            $path = $request->file('primary_image')->store('umkms', 'public');
            $umkm->media()->where('is_primary', true)->update(['is_primary' => false]);
            $umkm->media()->create([
                'file_path' => $path,
                'alt_text' => $umkm->name,
                'is_primary' => true,
            ]);
        }

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('umkms', 'public');
                $umkm->media()->create([
                    'file_path' => $path,
                    'alt_text' => $umkm->name,
                    'is_primary' => false,
                ]);
            }
        }
    }
}
