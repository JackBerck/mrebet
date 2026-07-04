<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminEventController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $query = Event::with(['primaryMedia', 'village:id,name'])
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->date_from, fn ($q, $d) => $q->where('start_date', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->where('start_date', '<=', $d))
            ->when(! $isAdmin, fn ($q) => $q->where('village_id', $user->village_id));

        if ($isAdmin && $request->village_id) {
            $query->where('village_id', $request->village_id);
        }

        $events = $query->orderByDesc('start_date')->paginate(15)->withQueryString();

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'villages' => $villages,
            'filters' => $request->only('search', 'status', 'village_id', 'date_from', 'date_to'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Event::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect([['id' => $user->village_id, 'name' => $user->village?->name]]);

        // Destinations scoped to user's village for manager
        $destinations = $isAdmin
            ? collect()
            : Destination::where('village_id', $user->village_id)
                ->where('status', 'published')
                ->orderBy('name')
                ->get(['id', 'name', 'village_id']);

        return Inertia::render('Admin/Events/Form', [
            'event' => null,
            'villages' => $villages,
            'destinations' => $destinations,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $this->authorize('create', Event::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $validated = $request->validated();

        if (! $isAdmin) {
            $validated['village_id'] = $user->village_id;
        }

        $event = Event::create($validated);

        $this->handleMediaUploads($request, $event);

        return redirect()
            ->route('admin.events.edit', $event)
            ->with('success', 'Event berhasil ditambahkan.');
    }

    public function edit(Event $event, Request $request): Response
    {
        $this->authorize('update', $event);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $event->load(['media' => fn ($q) => $q->orderByDesc('is_primary')]);

        $villages = $isAdmin
            ? Village::orderBy('name')->get(['id', 'name'])
            : collect([['id' => $user->village_id, 'name' => $user->village?->name]]);

        $villageId = $isAdmin ? $event->village_id : $user->village_id;

        $destinations = Destination::where('village_id', $villageId)
            ->where('status', 'published')
            ->orderBy('name')
            ->get(['id', 'name', 'village_id']);

        return Inertia::render('Admin/Events/Form', [
            'event' => $event,
            'villages' => $villages,
            'destinations' => $destinations,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $this->authorize('update', $event);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $validated = $request->validated();

        if (! $isAdmin) {
            $validated['village_id'] = $event->village_id;
        }

        $event->update($validated);

        $this->handleMediaUploads($request, $event);

        if ($request->deleted_media_ids) {
            $toDelete = $event->media()->whereIn('id', $request->deleted_media_ids)->get();
            foreach ($toDelete as $media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
        }

        if ($request->primary_media_id) {
            $event->media()->update(['is_primary' => false]);
            $event->media()->where('id', $request->primary_media_id)->update(['is_primary' => true]);
        }

        return back()->with('success', 'Event berhasil diperbarui.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $this->authorize('delete', $event);

        $event->delete();

        return redirect()
            ->route('admin.events.index')
            ->with('success', 'Event berhasil dihapus.');
    }

    public function updateStatus(Request $request, Event $event): RedirectResponse
    {
        $this->authorize('update', $event);

        $request->validate(['status' => ['required', Rule::enum(ContentStatus::class)]]);

        $event->update(['status' => $request->status]);

        return back()->with('success', 'Status event diperbarui.');
    }

    private function handleMediaUploads(Request $request, Event $event): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $existingPrimaryCount = $event->media()->where('is_primary', true)->count();

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('events', 'public');

            $isPrimary = $existingPrimaryCount === 0 && $index === 0;

            $event->media()->create([
                'file_path' => $path,
                'alt_text' => $event->title,
                'is_primary' => $isPrimary,
            ]);

            if ($isPrimary) {
                $existingPrimaryCount = 1;
            }
        }
    }
}
