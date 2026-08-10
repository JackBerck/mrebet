import { Link } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Event } from '@/types';

export type UpcomingEventItem = Pick<
    Event,
    'id' | 'title' | 'slug' | 'start_date' | 'start_time' | 'ticket_price'
>;

interface UpcomingEventsCardProps {
    events: UpcomingEventItem[];
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
    return (
        <Card className="col-span-1 border-(--line) shadow-none lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-display text-lg text-(--forest-deep)">
                    Event Mendatang
                </CardTitle>
                <CardDescription>
                    Event yang akan berlangsung
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {events.length === 0 ? (
                    <p className="text-sm text-(--charcoal-soft)">
                        Tidak ada event mendatang.
                    </p>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 rounded-lg border border-(--line) p-3"
                        >
                            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-(--gold-soft) text-center">
                                <span className="text-[10px] font-semibold text-(--forest) uppercase">
                                    {new Date(event.start_date).toLocaleDateString('id-ID', {
                                        month: 'short',
                                    })}
                                </span>
                                <span className="text-lg leading-none font-bold text-(--forest-deep)">
                                    {new Date(event.start_date).getDate()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[oklch(0.22_0.01_85)]">
                                    {event.title}
                                </p>
                                <p className="text-xs text-(--charcoal-soft)">
                                    {event.start_time
                                        ? event.start_time.slice(0, 5) + ' WIB'
                                        : 'Sepanjang hari'}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full"
                    asChild
                >
                    <Link href="/admin/events">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Semua Event
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
