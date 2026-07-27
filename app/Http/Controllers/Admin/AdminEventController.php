<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Destination;
use App\Models\Event;
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

        $events = Event::with(['primaryMedia', 'destination:id,name'])
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $destinations = Destination::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/events/index', [
            'events' => $events,
            'destinations' => $destinations,
            'filters' => $request->only('search', 'status'),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Event::class);

        $user = $request->user();
        $isAdmin = $user->role === UserRole::Admin;

        $destinations = Destination::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/events/form', [
            'event' => null,
            'destinations' => $destinations,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $this->authorize('create', Event::class);

        $validated = $request->validated();

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

        $destinations = Destination::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/events/form', [
            'event' => $event,
            'destinations' => $destinations,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $this->authorize('update', $event);

        $validated = $request->validated();

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
