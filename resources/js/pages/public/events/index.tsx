import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Info } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Event } from '@/types/public';
import { EventCalendar } from '@/components/public/event-calendar';

interface Props {
    events: Event[];
    currentMonth: string;
}

export default function EventsIndex({ events, currentMonth }: Props) {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head>
                <title>Kalender Acara — Wisata Mrebet</title>
                <meta
                    name="description"
                    content="Jelajahi kalender acara dan kegiatan budaya, festival alam, serta event menarik lainnya di desa-desa wisata Kecamatan Mrebet."
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-40 pb-12 lg:pb-20 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-5xl section-padding-x">
                    <div className="mb-10 md:mb-12 max-w-2xl bg-(--forest-deep) text-white p-4 rounded-lg" data-reveal>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            Kalender Acara
                        </h1>
                        <p className="text-base md:text-lg leading-relaxed">
                            Temukan berbagai festival budaya, perayaan alam, hingga pasar tradisional di Mrebet. 
                            Simpan tanggalnya dan jadilah bagian dari cerita desa.
                        </p>
                    </div>

                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-reveal data-reveal-delay="50">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-(--forest-deep)">Agenda Bulan Ini</h2>
                            <p className="text-sm text-(--charcoal-soft) mt-1">Klik pada tanggal untuk melihat detail acara.</p>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-4 text-xs font-medium text-(--charcoal-soft) bg-white px-4 py-2 rounded-full border border-(--line) shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-(--forest)"></span>
                                Event
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-4 h-2.5 rounded bg-(--forest-mist)"></span>
                                Multi-hari
                            </div>
                        </div>
                    </div>

                    <div data-reveal data-reveal-delay="100">
                        <EventCalendar currentMonth={currentMonth} events={events} />
                    </div>

                    <div className="mt-8 flex items-start gap-3 rounded-xl bg-blue-50 p-4 border border-blue-100" data-reveal data-reveal-delay="200">
                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Jadwal acara dapat berubah sewaktu-waktu sesuai dengan kebijakan penyelenggara dan kondisi alam setempat. 
                            Pastikan untuk selalu mengecek informasi terbaru atau menghubungi kontak yang tertera pada detail acara.
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
