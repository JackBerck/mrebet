<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PublicEventController extends Controller
{
    public function index(Request $request): Response
    {
        $month = $request->input('month', Carbon::now()->format('Y-m'));

        try {
            $parsedDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        } catch (\Exception $e) {
            $parsedDate = Carbon::now()->startOfMonth();
            $month = $parsedDate->format('Y-m');
        }

        $startDate = $parsedDate->copy()->startOfMonth();
        $endDate = $parsedDate->copy()->endOfMonth();

        // Get events that overlap with this month
        $events = Event::with(['primaryMedia', 'village:id,name'])
            ->where('status', ContentStatus::Published)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<', $startDate)
                            ->where('end_date', '>', $endDate);
                    });
            })
            ->orderBy('start_date')
            ->get();

        return Inertia::render('public/events/index', [
            'events' => $events,
            'currentMonth' => $month,
        ]);
    }

    public function show(Event $event): Response
    {
        abort_if($event->status !== ContentStatus::Published, 404);

        $event->load(['media', 'village:id,name,slug', 'destination:id,name,slug']);

        $relatedEvents = Event::with(['primaryMedia', 'village:id,name'])
            ->where('status', ContentStatus::Published)
            ->where('id', '!=', $event->id)
            ->where('village_id', $event->village_id)
            ->whereDate('start_date', '>=', Carbon::today())
            ->orderBy('start_date', 'asc')
            ->limit(3)
            ->get();

        return Inertia::render('public/events/show', [
            'event' => $event,
            'relatedEvents' => $relatedEvents,
        ]);
    }
}
