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

        $query = Village::with('primaryMedia')
            ->when(! $isAdmin, fn ($q) => $q->where('id', $user->village_id))
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s));

        $villages = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Villages/Index', [
            'villages' => $villages,
            'filters' => $request->only('search', 'status'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Village::class);

        return Inertia::render('Admin/Villages/Form', [
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

    public function edit(Village $village): Response
    {
        $this->authorize('update', $village);

        $village->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        return Inertia::render('Admin/Villages/Form', [
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
