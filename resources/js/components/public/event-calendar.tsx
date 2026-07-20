import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, isSameDay, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
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

    const isDateInRange = (date: Date, event: Event) => {
        if (!event.end_date || event.start_date === event.end_date) return false;
        const start = startOfDay(parseISO(event.start_date));
        const end = endOfDay(parseISO(event.end_date));
        return isWithinInterval(date, { start, end });
    };

    // Calculate grid rows dynamically (4, 5, or 6 weeks)
    const totalSlots = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    const days = Array.from({ length: totalSlots }, (_, i) => {
        const dayNumber = i - startingDayOfWeek + 1;
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
            return new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNumber);
        }
        return null;
    });

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

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-(--line) bg-(--cream-soft)">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="py-3 text-center text-xs md:text-sm font-semibold text-(--forest-deep) border-r border-(--line) last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr">
                {days.map((date, index) => {
                    if (!date) {
                        // Calculate dates for previous/next months to fill the empty slots
                        let fillDate;
                        if (index < startingDayOfWeek) {
                            // Previous month
                            const prevMonthDays = getDaysInMonth(subMonths(monthDate, 1));
                            const dayNum = prevMonthDays - (startingDayOfWeek - index - 1);
                            fillDate = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, dayNum);
                        } else {
                            // Next month
                            const dayNum = index - startingDayOfWeek - daysInMonth + 1;
                            fillDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, dayNum);
                        }

                        return (
                            <div key={`empty-${index}`} className="min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-(--line) last:border-r-0 bg-neutral-50/50">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs md:text-sm font-medium text-neutral-300">
                                    {fillDate.getDate()}
                                </span>
                            </div>
                        );
                    }

                    const dayEvents = getEventsForDate(date);
                    const isToday = isSameDay(date, new Date());

                    // Check if this date has a range highlight
                    const hasRangeEvent = dayEvents.some(e => isDateInRange(date, e));

                    return (
                        <EventPopover key={date.toISOString()} date={date} events={dayEvents}>
                            <div 
                                className={cn(
                                    "min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-(--line) last:border-r-0 relative group transition-colors hover:bg-neutral-50 cursor-pointer overflow-hidden",
                                    hasRangeEvent && "bg-(--forest-mist)/30"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={cn(
                                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs md:text-sm font-medium",
                                        isToday 
                                            ? "bg-(--gold) text-(--forest-deep)" 
                                            : "text-(--charcoal)"
                                    )}>
                                        {date.getDate()}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <span className="md:hidden flex h-1.5 w-1.5 rounded-full bg-(--forest) mt-2" />
                                    )}
                                </div>
                                
                                <div className="hidden md:flex flex-col gap-1 mt-2">
                                    {dayEvents.slice(0, 3).map((event, i) => (
                                        <div 
                                            key={`${event.id}-${i}`}
                                            className={cn(
                                                "text-[10px] leading-tight px-1.5 py-1 rounded truncate transition-colors",
                                                isDateInRange(date, event)
                                                    ? "bg-(--forest-mist) text-(--forest-deep) border-l-2 border-l-(--forest)"
                                                    : "bg-white border border-(--line) text-(--charcoal-soft) group-hover:border-(--forest-mist)"
                                            )}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[10px] text-(--charcoal-soft) font-medium pl-1">
                                            +{dayEvents.length - 3} lainnya
                                        </div>
                                    )}
                                </div>
                            </div>
                        </EventPopover>
                    );
                })}
            </div>
        </div>
    );
}
