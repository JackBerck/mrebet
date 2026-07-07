<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVillageRequest;
use App\Http\Requests\Admin\UpdateVillageRequest;
use App\Models\Media;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminVillageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        if (! $isAdmin) {
            $village = $user->village()->first();
            $village->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

            $recentDestinations = $village->destinations()->latest()->take(5)->get(['id', 'name', 'slug', 'category', 'status', 'created_at']);
            $recentEvents = $village->events()->latest()->take(5)->get(['id', 'title', 'slug', 'start_date', 'start_time', 'status', 'ticket_price']);
            $recentBlogs = $village->blogs()->latest()->take(5)->get(['id', 'title', 'slug', 'status', 'views_count', 'created_at']);

            return Inertia::render('admin/villages/show', [
                'village' => $village,
                'recentDestinations' => $recentDestinations,
                'recentEvents' => $recentEvents,
                'recentBlogs' => $recentBlogs,
                'isAdmin' => false,
            ]);
        }

        $query = Village::with('primaryMedia')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s));

        $villages = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/villages/index', [
            'villages' => $villages,
            'filters' => $request->only('search', 'status'),
            'isAdmin' => true,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Village::class);

        return Inertia::render('admin/villages/form', [
            'village' => null,
            'isAdmin' => request()->user()->role === UserRole::Admin,
        ]);
    }

    public function store(StoreVillageRequest $request): RedirectResponse
    {
        $this->authorize('create', Village::class);

        $village = Village::create($request->validated());

        $this->handleMediaUploads($request, $village);

        return redirect()
            ->route('admin.villages.edit', $village)
            ->with('success', 'Desa berhasil ditambahkan.');
    }

    public function show(Village $village): Response
    {
        // View logic works for both Admin and Manager since manager is restricted via global scope or UI
        // Wait, AdminVillageController has an implicit policy, we should authorize 'view'.
        // Let's use 'view' or 'update' since there's no view policy for villages explicitly mentioned.
        // Actually, 'update' is fine, or we can just not authorize since they can only see this if they can access it.
        $this->authorize('update', $village);

        $village->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        $recentDestinations = $village->destinations()->latest()->take(5)->get(['id', 'name', 'slug', 'category', 'status', 'created_at']);
        $recentEvents = $village->events()->latest()->take(5)->get(['id', 'title', 'slug', 'start_date', 'start_time', 'status', 'ticket_price']);
        $recentBlogs = $village->blogs()->latest()->take(5)->get(['id', 'title', 'slug', 'status', 'views_count', 'created_at']);

        return Inertia::render('admin/villages/show', [
            'village' => $village,
            'recentDestinations' => $recentDestinations,
            'recentEvents' => $recentEvents,
            'recentBlogs' => $recentBlogs,
            'isAdmin' => request()->user()->role === UserRole::Admin,
        ]);
    }

    public function edit(Village $village): Response
    {
        $this->authorize('update', $village);

        $village->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        return Inertia::render('admin/villages/form', [
            'village' => $village,
            'isAdmin' => request()->user()->role === UserRole::Admin,
        ]);
    }

    public function update(UpdateVillageRequest $request, Village $village): RedirectResponse
    {
        $this->authorize('update', $village);

        $village->update($request->validated());

        $this->handleMediaUploads($request, $village);

        // Handle deleted media
        if ($request->deleted_media_ids) {
            $mediaToDelete = $village->media()->whereIn('id', $request->deleted_media_ids)->get();
            foreach ($mediaToDelete as $media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
        }

        // Handle primary media change
        if ($request->primary_media_id) {
            $village->media()->update(['is_primary' => false]);
            $village->media()->where('id', $request->primary_media_id)->update(['is_primary' => true]);
        }

        return back()->with('success', 'Desa berhasil diperbarui.');
    }

    public function editManager(Request $request): Response
    {
        $village = $request->user()->village()->first();

        abort_if(! $village, 403, 'Anda tidak memiliki desa untuk dikelola.');

        return $this->edit($village);
    }

    public function updateManager(UpdateVillageRequest $request): RedirectResponse
    {
        $village = $request->user()->village()->first();

        abort_if(! $village, 403, 'Anda tidak memiliki desa untuk dikelola.');

        return $this->update($request, $village);
    }

    public function destroy(Village $village): RedirectResponse
    {
        $this->authorize('delete', $village);

        $village->delete();

        return redirect()
            ->route('admin.villages.index')
            ->with('success', 'Desa berhasil dihapus.');
    }

    public function updateStatus(Request $request, Village $village): RedirectResponse
    {
        $this->authorize('update', $village);

        $request->validate(['status' => ['required', Rule::enum(ContentStatus::class)]]);

        $village->update(['status' => $request->status]);

        return back()->with('success', 'Status desa diperbarui.');
    }

    private function handleMediaUploads(Request $request, Village $village): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $existingPrimaryCount = $village->media()->where('is_primary', true)->count();

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('villages', 'public');

            $isPrimary = $existingPrimaryCount === 0 && $index === 0;

            $village->media()->create([
                'file_path' => $path,
                'alt_text' => $village->name,
                'is_primary' => $isPrimary,
            ]);

            if ($isPrimary) {
                $existingPrimaryCount = 1;
            }
        }
    }
}
