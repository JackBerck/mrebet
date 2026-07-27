import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, isSameDay, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/public';
import { EventPopover } from './event-popover';
import { router } from '@inertiajs/react';

interface EventCalendarProps {
    currentMonth: string; // YYYY-MM
    events: Event[];
}

const DAYS_OF_WEEK = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

// Presets warna block untuk multi-day event yang kontras & profesional
const MULTI_DAY_COLORS = [
    { bg: 'bg-emerald-700 text-white hover:bg-emerald-800', border: 'border-emerald-800' },
    { bg: 'bg-teal-700 text-white hover:bg-teal-800', border: 'border-teal-800' },
    { bg: 'bg-amber-600 text-white hover:bg-amber-700', border: 'border-amber-700' },
    { bg: 'bg-indigo-700 text-white hover:bg-indigo-800', border: 'border-indigo-800' },
];

const COL_START_MAP: Record<number, string> = {
    0: 'col-start-1',
    1: 'col-start-2',
    2: 'col-start-3',
    3: 'col-start-4',
    4: 'col-start-5',
    5: 'col-start-6',
    6: 'col-start-7',
};

const COL_SPAN_MAP: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
};

interface EventSpan {
    event: Event;
    startCol: number; // 0..6
    endCol: number;   // 0..6
    colSpan: number;  // 1..7
    isMultiDay: boolean;
    isStartOfEvent: boolean;
    isEndOfEvent: boolean;
    rowSlot: number;
}

function getWeekSpans(weekDays: (Date | null)[], events: Event[]): EventSpan[] {
    const validDates = weekDays.filter((d): d is Date => d !== null);
    if (validDates.length === 0) return [];

    const weekStart = startOfDay(validDates[0]);
    const weekEnd = endOfDay(validDates[validDates.length - 1]);

    const activeEvents = events.filter(e => {
        const eStart = startOfDay(parseISO(e.start_date));
        const eEnd = e.end_date ? endOfDay(parseISO(e.end_date)) : eStart;
        return eStart <= weekEnd && eEnd >= weekStart;
    });

    const rawSpans = activeEvents.map(e => {
        const eStart = startOfDay(parseISO(e.start_date));
        const eEnd = e.end_date ? endOfDay(parseISO(e.end_date)) : eStart;

        let startCol = 0;
        let endCol = 6;

        for (let c = 0; c < 7; c++) {
            const dayDate = weekDays[c];
            if (dayDate && dayDate >= eStart) {
                startCol = c;
                break;
            }
        }
        for (let c = 6; c >= 0; c--) {
            const dayDate = weekDays[c];
            if (dayDate && dayDate <= eEnd) {
                endCol = c;
                break;
            }
        }

        const isMulti = Boolean(e.end_date && e.start_date !== e.end_date);
        const isStartOfEvent = isSameDay(eStart, weekDays[startCol] || eStart);
        const isEndOfEvent = isSameDay(eEnd, weekDays[endCol] || eEnd);

        return {
            event: e,
            startCol,
            endCol,
            colSpan: Math.max(1, endCol - startCol + 1),
            isMultiDay: isMulti,
            isStartOfEvent,
            isEndOfEvent,
            rowSlot: 0,
        };
    });

    // Sort: Multi-day first (longer span), then startCol
    rawSpans.sort((a, b) => {
        if (a.isMultiDay !== b.isMultiDay) return a.isMultiDay ? -1 : 1;
        if (a.colSpan !== b.colSpan) return b.colSpan - a.colSpan;
        return a.startCol - b.startCol;
    });

    // Assign non-overlapping row slots
    const slots: (number[])[] = [];

    const finalSpans: EventSpan[] = [];
    for (const span of rawSpans) {
        let slot = 0;
        while (true) {
            if (!slots[slot]) slots[slot] = new Array(7).fill(0);
            let ok = true;
            for (let c = span.startCol; c <= span.endCol; c++) {
                if (slots[slot][c] !== 0) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                for (let c = span.startCol; c <= span.endCol; c++) {
                    slots[slot][c] = span.event.id;
                }
                span.rowSlot = slot;
                break;
            }
            slot++;
        }
        finalSpans.push(span);
    }

    return finalSpans;
}

export function EventCalendar({ currentMonth, events }: EventCalendarProps) {
    const monthDate = parseISO(`${currentMonth}-01`);
    const daysInMonth = getDaysInMonth(monthDate);
    const startDayOfMonth = startOfMonth(monthDate);
    
    // getDay returns 0 for Sunday, 1 for Monday. We want Monday=0, Sunday=6
    let startingDayOfWeek = getDay(startDayOfMonth) - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev' ? subMonths(monthDate, 1) : addMonths(monthDate, 1);
        const newMonthStr = format(newDate, 'yyyy-MM');
        
        router.get('/event', { month: newMonthStr }, { preserveScroll: true, preserveState: true });
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const start = startOfDay(parseISO(event.start_date));
            const end = event.end_date ? endOfDay(parseISO(event.end_date)) : endOfDay(start);
            return isWithinInterval(date, { start, end });
        });
    };

    // Calculate grid slots
    const totalSlots = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    const days = Array.from({ length: totalSlots }, (_, i) => {
        const dayNumber = i - startingDayOfWeek + 1;
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
            return new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNumber);
        }
        return null;
    });

    // Chunk into 7-day weeks
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <div className="w-full bg-white rounded-2xl border border-(--line) shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-(--line) bg-(--cream-warm)">
                <h3 className="font-display text-xl md:text-2xl font-bold text-(--forest-deep) capitalize">
                    {format(monthDate, 'MMMM yyyy', { locale: id })}
                </h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')} className="h-9 w-9 border-(--line)">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('next')} className="h-9 w-9 border-(--line)">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Days Header */}
            <div className="grid grid-cols-7 border-b border-(--line) bg-(--cream-soft)">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="py-3 text-center text-xs md:text-sm font-semibold text-(--forest-deep) border-r border-(--line) last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Weeks */}
            <div className="flex flex-col divide-y divide-(--line)">
                {weeks.map((weekDays, weekIdx) => {
                    const spans = getWeekSpans(weekDays, events);

                    return (
                        <div key={`week-${weekIdx}`} className="relative min-h-[110px] md:min-h-[135px] flex flex-col justify-between">
                            {/* Grid Cell Backgrounds & Date Numbers */}
                            <div className="grid grid-cols-7 h-full absolute inset-0 pointer-events-none">
                                {weekDays.map((date, colIdx) => {
                                    if (!date) {
                                        return (
                                            <div 
                                                key={`empty-${weekIdx}-${colIdx}`} 
                                                className="border-r border-(--line) last:border-r-0 bg-neutral-50/50 p-2"
                                            />
                                        );
                                    }

                                    const dayEvents = getEventsForDate(date);
                                    const isToday = isSameDay(date, new Date());

                                    return (
                                        <EventPopover key={date.toISOString()} date={date} events={dayEvents}>
                                            <div 
                                                className={cn(
                                                    "border-r border-(--line) last:border-r-0 p-2 pointer-events-auto h-full flex flex-col justify-between cursor-pointer transition-colors hover:bg-neutral-50/80",
                                                    isToday && "bg-(--cream-soft)/40"
                                                )}
                                            >
                                                {/* Date Header */}
                                                <div className="flex justify-between items-center">
                                                    <span className={cn(
                                                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs md:text-sm font-semibold transition-all",
                                                        isToday 
                                                            ? "bg-(--forest) text-white shadow-xs" 
                                                            : "text-(--charcoal)"
                                                    )}>
                                                        {date.getDate()}
                                                    </span>

                                                    {/* Mobile Indicators */}
                                                    {dayEvents.length > 0 && (
                                                        <div className="flex items-center gap-1 md:hidden">
                                                            {dayEvents.slice(0, 3).map((ev, i) => (
                                                                <span 
                                                                    key={i} 
                                                                    className={cn(
                                                                        "h-2 rounded-full",
                                                                        ev.end_date && ev.end_date !== ev.start_date ? "w-3 bg-emerald-600" : "w-2 bg-(--gold)"
                                                                    )} 
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </EventPopover>
                                    );
                                })}
                            </div>

                            {/* Desktop Overlay Event Bars (Continuous Spanning across columns) */}
                            <div className="hidden md:block relative pt-9 pb-2 px-1 z-10 pointer-events-none">
                                <div className="grid grid-cols-7 gap-y-1.5 auto-rows-[26px]">
                                    {spans.slice(0, 6).map((span) => {
                                        const colorStyle = MULTI_DAY_COLORS[span.event.id % MULTI_DAY_COLORS.length];
                                        const colStartClass = COL_START_MAP[span.startCol] || 'col-start-1';
                                        const colSpanClass = COL_SPAN_MAP[span.colSpan] || 'col-span-1';

                                        if (span.isMultiDay) {
                                            return (
                                                <div
                                                    key={`span-${span.event.id}-${weekIdx}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.get(`/event/${span.event.slug}`);
                                                    }}
                                                    style={{ gridRow: span.rowSlot + 1 }}
                                                    className={cn(
                                                        "pointer-events-auto h-6 text-[11px] font-semibold leading-none flex items-center shadow-2xs transition-all cursor-pointer hover:opacity-95 hover:scale-[1.005]",
                                                        colorStyle.bg,
                                                        colStartClass,
                                                        colSpanClass,
                                                        span.isStartOfEvent ? "rounded-l-md ml-1 pl-2.5" : "rounded-l-none -ml-1 pl-3",
                                                        span.isEndOfEvent ? "rounded-r-md mr-1 pr-2.5" : "rounded-r-none -mr-1 pr-3"
                                                    )}
                                                    title={span.event.title}
                                                >
                                                    <span className="truncate w-full flex items-center gap-1.5">
                                                        <span className="text-[10px] opacity-80 shrink-0">▶</span>
                                                        <span className="truncate font-semibold">{span.event.title}</span>
                                                    </span>
                                                </div>
                                            );
                                        }

                                        // Single day event chip
                                        return (
                                            <div
                                                key={`span-${span.event.id}-${weekIdx}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.get(`/event/${span.event.slug}`);
                                                }}
                                                style={{ gridRow: span.rowSlot + 1 }}
                                                className={cn(
                                                    "pointer-events-auto h-6 text-[11px] font-medium leading-none px-2 rounded-md bg-white border border-(--line) text-(--charcoal) hover:border-(--forest-mist) flex items-center gap-1.5 shadow-2xs truncate cursor-pointer transition-all mx-1",
                                                    colStartClass,
                                                    "col-span-1"
                                                )}
                                                title={span.event.title}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-(--gold) shrink-0" />
                                                <span className="truncate">{span.event.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
