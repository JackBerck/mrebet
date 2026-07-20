import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/public';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface EventPopoverProps {
    date: Date;
    events: Event[];
    children: React.ReactNode;
}

export function EventPopover({ date, events, children }: EventPopoverProps) {
    const [open, setOpen] = useState(false);

    const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: id });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-32px)] sm:w-80 p-0" align="start">
                <div className="bg-(--cream-warm) border-b border-(--line) px-4 py-3">
                    <h4 className="font-semibold text-(--forest-deep)">{formattedDate}</h4>
                    <p className="text-xs text-(--charcoal-soft)">
                        {events.length} acara di hari ini
                    </p>
                </div>
                <div className="max-h-75 overflow-y-auto p-2">
                    {events.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/event/${event.slug}`}
                                    className="block rounded-xl border border-(--line) bg-white p-3 transition-colors hover:border-(--forest-mist)"
                                    onClick={() => setOpen(false)}
                                >
                                    <h5 className="font-semibold text-(--charcoal) text-sm mb-1 line-clamp-2">
                                        {event.title}
                                    </h5>
                                    
                                    {event.start_time && (
                                        <div className="flex items-center gap-1.5 text-xs text-(--charcoal-soft) mb-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                {event.start_time.slice(0, 5)} 
                                                {event.end_time ? ` - ${event.end_time.slice(0, 5)}` : ' - Selesai'} WIB
                                            </span>
                                        </div>
                                    )}
                                    
                                    {event.village && (
                                        <div className="flex items-center gap-1.5 text-xs text-(--charcoal-soft) mb-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{event.village.name}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-(--line)">
                                        <span className={cn(
                                            "text-xs font-medium px-2 py-0.5 rounded-full",
                                            event.ticket_price > 0 
                                                ? "bg-(--forest-mist) text-(--forest)" 
                                                : "bg-(--gold-soft)/30 text-(--gold)"
                                        )}>
                                            {event.ticket_price > 0 
                                                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(event.ticket_price) 
                                                : 'Gratis'}
                                        </span>
                                        <span className="text-[10px] font-semibold text-(--forest) uppercase tracking-wider">
                                            Lihat Detail
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-(--charcoal-soft)">
                            Tidak ada acara di hari ini.
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
