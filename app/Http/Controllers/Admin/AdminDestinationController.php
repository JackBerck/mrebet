<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDestinationRequest;
use App\Http\Requests\Admin\UpdateDestinationRequest;
use App\Models\Destination;
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

        $destinations = Destination::with(['primaryMedia'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->category, fn ($q, $c) => $q->where('category', $c))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/destinations/index', [
            'destinations' => $destinations,
            'filters' => $request->only('search', 'status', 'category'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Destination::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        return Inertia::render('admin/destinations/form', [
            'destination' => null,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(StoreDestinationRequest $request): RedirectResponse
    {
        $this->authorize('create', Destination::class);

        $validated = $request->validated();

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

        return Inertia::render('admin/destinations/form', [
            'destination' => $destination,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(UpdateDestinationRequest $request, Destination $destination): RedirectResponse
    {
        $this->authorize('update', $destination);

        $validated = $request->validated();

        $destination->update($validated);

        $this->handleMediaUploads($request, $destination);

        if ($request->deleted_media_ids) {
            $toDelete = $destination->media()->whereIn('id', $request->deleted_media_ids)->get();
            foreach ($toDelete as $media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
        }

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
