<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDestinationRequest;
use App\Http\Requests\Admin\UpdateDestinationRequest;
use App\Models\Destination;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminDestinationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $query = Destination::with(['primaryMedia', 'village:id,name'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->category, fn ($q, $c) => $q->where('category', $c))
            ->when(! $isAdmin, fn ($q) => $q->where('village_id', $user->village_id));

        if ($isAdmin && $request->village_id) {
            $query->where('village_id', $request->village_id);
        }

        $destinations = $query->latest()->paginate(15)->withQueryString();

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect();

        return Inertia::render('Admin/Destinations/Index', [
            'destinations' => $destinations,
            'villages' => $villages,
            'filters' => $request->only('search', 'status', 'category', 'village_id'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Destination::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect([['id' => $user->village_id, 'name' => $user->village?->name]]);

        return Inertia::render('Admin/Destinations/Form', [
            'destination' => null,
            'villages' => $villages,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(StoreDestinationRequest $request): RedirectResponse
    {
        $this->authorize('create', Destination::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $validated = $request->validated();

        // Manager always uses their own village
        if (! $isAdmin) {
            $validated['village_id'] = $user->village_id;
        }

        $destination = Destination::create($validated);

        $this->handleMediaUploads($request, $destination);

        return redirect()
            ->route('admin.destinations.edit', $destination)
            ->with('success', 'Destinasi berhasil ditambahkan.');
    }

    public function edit(Destination $destination, Request $request): Response
    {
        $this->authorize('update', $destination);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $destination->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect([['id' => $user->village_id, 'name' => $user->village?->name]]);

        return Inertia::render('Admin/Destinations/Form', [
            'destination' => $destination,
            'villages' => $villages,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(UpdateDestinationRequest $request, Destination $destination): RedirectResponse
    {
        $this->authorize('update', $destination);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $validated = $request->validated();

        if (! $isAdmin) {
            $validated['village_id'] = $destination->village_id;
        }

        $destination->update($validated);

        $this->handleMediaUploads($request, $destination);

        // Delete removed media
        if ($request->deleted_media_ids) {
            $toDelete = $destination->media()->whereIn('id', $request->deleted_media_ids)->get();
            foreach ($toDelete as $media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
        }

        // Update primary media
        if ($request->primary_media_id) {
            $destination->media()->update(['is_primary' => false]);
            $destination->media()->where('id', $request->primary_media_id)->update(['is_primary' => true]);
        }

        return back()->with('success', 'Destinasi berhasil diperbarui.');
    }

    public function destroy(Destination $destination): RedirectResponse
    {
        $this->authorize('delete', $destination);

        $destination->delete();

        return redirect()
            ->route('admin.destinations.index')
            ->with('success', 'Destinasi berhasil dihapus.');
    }

    public function updateStatus(Request $request, Destination $destination): RedirectResponse
    {
        $this->authorize('update', $destination);

        $request->validate(['status' => ['required', Rule::enum(ContentStatus::class)]]);

        $destination->update(['status' => $request->status]);

        return back()->with('success', 'Status destinasi diperbarui.');
    }

    private function handleMediaUploads(Request $request, Destination $destination): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $existingPrimaryCount = $destination->media()->where('is_primary', true)->count();

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('destinations', 'public');

            $isPrimary = $existingPrimaryCount === 0 && $index === 0;

            $destination->media()->create([
                'file_path' => $path,
                'alt_text' => $destination->name,
                'is_primary' => $isPrimary,
            ]);

            if ($isPrimary) {
                $existingPrimaryCount = 1;
            }
        }
    }
}
