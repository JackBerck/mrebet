import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MapPin, Map, Share2, Ticket, User, Phone, Instagram, Navigation } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Event } from '@/types/public';
import { Button } from '@/components/ui/button';
import { format, parseISO, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { getGoogleMapsEmbedUrl } from '@/lib/map-utils';
import { SafeImage } from '@/components/public/safe-image';
import { QrCodeSidebarCard } from '@/components/public/qr-code-sidebar-card';

interface Props {
    event: Event;
    relatedEvents: Event[];
}

export default function EventShow({ event, relatedEvents }: Props) {
    useMotionReveal();

    const startDate = parseISO(event.start_date);
    const endDate = event.end_date ? parseISO(event.end_date) : startDate;
    const isSingleDay = isSameDay(startDate, endDate);

    const formattedDate = isSingleDay 
        ? format(startDate, 'd MMMM yyyy', { locale: id })
        : `${format(startDate, 'd', { locale: id })} - ${format(endDate, 'd MMMM yyyy', { locale: id })}`;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const embedUrl = getGoogleMapsEmbedUrl(event);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${event.title} - Desa Wisata Serayu Larangan`,
                    text: 'Lihat acara ini di Desa Wisata Serayu Larangan!',
                    url: shareUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Tautan disalin ke papan klip!');
        }
    };

    return (
        <PublicLayout>
            <Head>
                <title>{`${event.title} — Desa Wisata Serayu Larangan`}</title>
                <meta name="description" content={event.title} />
            </Head>

            {/* Top spacing for fixed navbar */}
            <div className="pt-16 md:pt-20 lg:pt-24 bg-(--cream-warm)"></div>

            {/* Back Navigation (un-stickied) */}
            <div className="bg-(--cream-warm) border-b border-(--line) py-4">
                <div className="container mx-auto max-w-7xl section-padding-x flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href={'/event'}
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--charcoal-soft) hover:text-(--forest) transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Kalender
                    </Link>
                    
                    <div className="flex items-center gap-2 text-sm text-(--charcoal-soft)">
                        <Link href="/" className="hover:text-(--forest)">Beranda</Link>
                        <span>/</span>
                        <Link href="/event" className="hover:text-(--forest)">Event</Link>
                        <span>/</span>
                        <span className="truncate max-w-37.5 md:max-w-75 text-(--charcoal) font-medium">{event.title}</span>
                    </div>
                </div>
            </div>

            <article className="py-8 lg:py-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">

                    {/* Header */}
                    <header className="mb-8 md:mb-12" data-reveal>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <div className="flex items-center gap-2 text-(--forest) font-medium bg-(--forest-mist)/50 px-3 py-1.5 rounded-full text-xs">
                                <MapPin className="w-3.5 h-3.5" />
                                Desa Serayu Larangan
                            </div>
                            {event.destination && (
                                <div className="flex items-center gap-2 text-(--gold) font-medium bg-(--gold-soft)/30 px-3 py-1.5 rounded-full text-xs">
                                    <Map className="w-3.5 h-3.5" />
                                    {event.destination.name}
                                </div>
                            )}
                        </div>

                        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-(--forest-deep) leading-tight mb-4 text-balance">
                            {event.title}
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Main Content (8 cols) */}
                        <div className="lg:col-span-8 space-y-8" data-reveal>

                            {/* Cover Image */}
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-200 border border-(--line) shadow-sm">
                                <SafeImage
                                    src={event.primary_media ? `/storage/${event.primary_media.file_path}` : null}
                                    alt={event.title}
                                    fallbackIcon={Calendar}
                                    iconClassName="w-16 h-16"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-(--line) shadow-sm">
                                <h2 className="font-display text-xl font-bold text-(--forest-deep) mb-4">
                                    Tentang Acara
                                </h2>
                                {event.description ? (
                                    <div 
                                        className="prose-html max-w-none"
                                        dangerouslySetInnerHTML={{ __html: event.description }}
                                    />
                                ) : (
                                    <p className="text-(--charcoal-soft) italic">
                                        Belum ada deskripsi untuk acara ini.
                                    </p>
                                )}
                            </div>
                            
                            {/* Gallery (if any other media exist besides primary) */}
                            {event.media && event.media.filter(m => !m.is_primary).length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-display text-xl font-bold text-(--forest-deep)">Galeri</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {event.media.filter(m => !m.is_primary).map(media => (
                                            <div key={media.id} className="aspect-square rounded-xl overflow-hidden border border-(--line)">
                                                <SafeImage 
                                                    src={`/storage/${media.file_path}`} 
                                                    alt="Galeri event" 
                                                    fallbackIcon={Calendar}
                                                    iconClassName="w-8 h-8"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info (4 cols) */}
                        <div className="lg:col-span-4 space-y-6" data-reveal data-reveal-delay="100">
                            
                            {/* Key Info Card */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Tanggal</p>
                                        <p className="font-semibold text-(--charcoal)">{formattedDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Waktu</p>
                                        <p className="font-semibold text-(--charcoal)">
                                            {event.start_time ? (
                                                <>
                                                    {event.start_time.slice(0, 5)} 
                                                    {event.end_time ? ` - ${event.end_time.slice(0, 5)}` : ' - Selesai'} WIB
                                                </>
                                            ) : 'Menyesuaikan'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Lokasi</p>
                                        <p className="font-semibold text-(--charcoal)">
                                            {event.address || (event.destination ? event.destination.name : 'Desa Serayu Larangan')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--gold-soft)/30 flex items-center justify-center shrink-0 text-(--gold)">
                                        <Ticket className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Tiket Masuk</p>
                                        <p className="font-semibold text-(--charcoal)">
                                            {event.ticket_price > 0 
                                                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(event.ticket_price) 
                                                : 'Gratis'}
                                        </p>
                                    </div>
                                </div>

                                {event.gmaps_link && (
                                    <div className="pt-4 border-t border-(--line)">
                                        <Button asChild className="w-full bg-(--forest) hover:bg-(--forest-deep) text-white font-semibold">
                                            <a href={event.gmaps_link} target="_blank" rel="noopener noreferrer">
                                                <Navigation className="w-4 h-4 mr-2" />
                                                Petunjuk Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Map Preview Card */}
                            {embedUrl && (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-4">
                                    <h3 className="font-display text-base font-bold text-(--forest-deep) flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-(--forest)" />
                                        Peta Lokasi Acara
                                    </h3>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-(--line) bg-neutral-100">
                                        <iframe
                                            title={`Peta Google Maps ${event.title}`}
                                            width="100%"
                                            height="100%"
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                            allowFullScreen
                                            src={embedUrl}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Organizer Card */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm">
                                <h3 className="font-display text-lg font-bold text-(--forest-deep) mb-4">Penyelenggara</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-(--charcoal-soft)" />
                                        <span className="text-sm font-medium text-(--charcoal)">
                                            {event.organizer || 'Pemerintah Desa'}
                                        </span>
                                    </div>
                                    
                                    {event.contact_person && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-(--charcoal-soft)" />
                                            <a href={`https://wa.me/${event.contact_person.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-(--forest) hover:underline font-medium">
                                                {event.contact_person}
                                            </a>
                                        </div>
                                    )}
                                    
                                    {event.instagram && (
                                        <div className="flex items-center gap-3">
                                            <Instagram className="w-4 h-4 text-(--charcoal-soft)" />
                                            <a href={`https://instagram.com/${event.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-sm text-(--forest) hover:underline font-medium">
                                                {event.instagram}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* QR Code Card */}
                            <QrCodeSidebarCard
                                title={event.title}
                                category="Event & Acara"
                                targetUrl={shareUrl}
                                slug={event.slug}
                            />

                            {/* Share Banner */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm text-center">
                                <p className="text-sm font-semibold text-(--charcoal) mb-3">Bagikan Acara Ini</p>
                                <Button variant="outline" className="w-full border-(--line) hover:bg-(--cream-warm) hover:text-(--forest)" onClick={handleShare}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Bagikan Halaman
                                </Button>
                            </div>

                        </div>
                    </div>

                    {/* Related Events */}
                    {relatedEvents && relatedEvents.length > 0 && (
                        <div className="mt-16 pt-16 border-t border-(--line)" data-reveal>
                            <h2 className="font-display text-2xl font-bold text-(--forest-deep) mb-8">
                                Acara Lainnya di Desa Ini
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedEvents.map(related => (
                                    <Link key={related.id} href={`/event/${related.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-(--line) hover:border-(--forest-mist) transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
                                        <div className="aspect-video w-full overflow-hidden bg-neutral-200">
                                            <SafeImage
                                                src={related.primary_media ? `/storage/${related.primary_media.file_path}` : null}
                                                alt={related.title}
                                                fallbackIcon={Calendar}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-5 flex flex-col grow">
                                            <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-2 mb-3">{related.title}</h3>
                                            <div className="mt-auto space-y-2 text-sm text-(--charcoal-soft)">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 shrink-0" />
                                                    <span>{format(parseISO(related.start_date), 'd MMM yyyy', { locale: id })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 shrink-0" />
                                                    <span>Desa Serayu Larangan</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </PublicLayout>
    );
}
