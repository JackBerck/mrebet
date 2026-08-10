import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft, MapPin, Ticket, Map as MapIcon,
    Share2, Calendar, Clock, Phone, Globe, Info,
    Navigation, QrCode, CheckCircle2, ArrowRight
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Destination, Event } from '@/types/public';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import React, { Suspense, lazy } from 'react';
import { getGoogleMapsEmbedUrl } from '@/lib/map-utils';
import { SafeImage } from '@/components/public/safe-image';

// Lazy load map component to avoid SSR issues with Leaflet
const DestinationMap = lazy(() => import('@/components/public/destination-map'));

interface Props {
    destination: Destination;
    events: Event[];
    relatedDestinations: Destination[];
}

export default function DestinationShow({ destination, events, relatedDestinations }: Props) {
    useMotionReveal();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const ticketPrice = parseFloat(destination.ticket_price);
    const embedUrl = getGoogleMapsEmbedUrl(destination);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${destination.name} - Desa Wisata Serayu Larangan`,
                    text: 'Lihat destinasi wisata ini di Desa Wisata Serayu Larangan!',
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

    // SEO Data
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": destination.name,
        "description": destination.description ? destination.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : '',
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": destination.latitude,
            "longitude": destination.longitude,
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": 'Serayu Larangan',
            "addressRegion": "Jawa Tengah",
            "addressCountry": "ID"
        }
    };

    const excerpt = destination.description
        ? destination.description.replace(/<[^>]*>?/gm, '').trim().substring(0, 150) + '...'
        : `Kunjungi ${destination.name} di Desa Serayu Larangan.`;

    return (
        <PublicLayout>
            <Head>
                <title>{`${destination.name} | Desa Wisata Serayu Larangan`}</title>
                <meta name="description" content={excerpt} />
                <link rel="canonical" href={shareUrl} />

                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={destination.name} />
                <meta property="og:description" content={excerpt} />
                <meta
                    property="og:image"
                    content={destination.primary_media ? `/storage/${destination.primary_media.file_path}` : '/default-og.jpg'}
                />
                <meta property="og:url" content={shareUrl} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={destination.name} />
                <meta name="twitter:description" content={excerpt} />
                <meta
                    name="twitter:image"
                    content={destination.primary_media ? `/storage/${destination.primary_media.file_path}` : '/default-og.jpg'}
                />

                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            {/* Top spacing */}
            <div className="pt-16 md:pt-20 lg:pt-24 bg-(--cream-warm)"></div>

            {/* Back Navigation (un-stickied) */}
            <div className="bg-(--cream-warm) border-b border-(--line) py-4">
                <div className="container mx-auto max-w-7xl section-padding-x flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/destinasi"
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--charcoal-soft) hover:text-(--forest) transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Destinasi
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-(--charcoal-soft)">
                        <Link href="/" className="hover:text-(--forest)">Beranda</Link>
                        <span>/</span>
                        <Link href="/destinasi" className="hover:text-(--forest)">Destinasi</Link>
                        <span>/</span>
                        <span className="truncate max-w-37.5 md:max-w-75 text-(--charcoal) font-medium">{destination.name}</span>
                    </div>
                </div>
            </div>

            <article className="py-8 lg:py-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">

                    {/* Header */}
                    <header className="mb-8 md:mb-12" data-reveal>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-(--forest-deep) text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                {destination.category_label}
                            </span>
                            <div className="flex items-center gap-1.5 text-(--forest) font-medium bg-(--forest-mist)/50 px-3 py-1.5 rounded-full text-xs">
                                <MapPin className="w-3.5 h-3.5" />
                                Desa Serayu Larangan
                            </div>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-(--forest-deep) leading-tight mb-4 text-balance">
                            {destination.name}
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Main Content (Left - 8 cols) */}
                        <div className="lg:col-span-8 space-y-8 md:space-y-12">

                            {/* Gallery */}
                            <div className="space-y-4" data-reveal>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-200 border border-(--line) shadow-sm">
                                    <SafeImage
                                        src={destination.primary_media ? `/storage/${destination.primary_media.file_path}` : null}
                                        alt={destination.name}
                                        fallbackIcon={MapIcon}
                                        iconClassName="w-16 h-16"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {destination.media && destination.media.filter(m => !m.is_primary).length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {destination.media.filter(m => !m.is_primary).map((media) => (
                                            <div key={media.id} className="aspect-square rounded-xl overflow-hidden border border-(--line) bg-neutral-100">
                                                <SafeImage
                                                    src={`/storage/${media.file_path}`}
                                                    alt="Galeri Destinasi"
                                                    fallbackIcon={MapIcon}
                                                    iconClassName="w-8 h-8"
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 border border-(--line) shadow-sm" data-reveal>
                                <h2 className="font-display text-2xl font-bold text-(--forest-deep) mb-6 flex items-center gap-2">
                                    <Info className="w-6 h-6 text-(--forest)" />
                                    Tentang Destinasi
                                </h2>

                                {destination.description ? (
                                    <div
                                        className="prose-html max-w-none"
                                        dangerouslySetInnerHTML={{ __html: destination.description }}
                                    />
                                ) : (
                                    <p className="text-(--charcoal-soft) italic">
                                        Belum ada deskripsi untuk destinasi ini.
                                    </p>
                                )}
                            </div>

                            {/* Facilities */}
                            {destination.facilities && destination.facilities.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 md:p-8 border border-(--line) shadow-sm" data-reveal>
                                    <h2 className="font-display text-2xl font-bold text-(--forest-deep) mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="w-6 h-6 text-(--forest)" />
                                        Fasilitas Tersedia
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {destination.facilities.map((facility, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-(--cream-warm) border border-(--line) px-4 py-2 rounded-full text-sm font-medium text-(--charcoal)">
                                                <CheckCircle2 className="w-4 h-4 text-(--forest)" />
                                                {facility}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Events at this destination */}
                            {events && events.length > 0 && (
                                <div className="bg-(--cream-soft) rounded-2xl p-6 md:p-8 border border-(--line) shadow-sm" data-reveal>
                                    <h2 className="font-display text-2xl font-bold text-(--forest-deep) mb-6 flex items-center gap-2">
                                        <Calendar className="w-6 h-6 text-(--forest)" />
                                        Acara di Lokasi Ini
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {events.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={`/event/${event.slug}`}
                                                className="bg-white rounded-xl border border-(--line) p-4 flex gap-4 hover:border-(--forest-mist) hover:shadow-md transition-all group"
                                            >
                                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                                                    <SafeImage
                                                        src={event.primary_media ? `/storage/${event.primary_media.file_path}` : null}
                                                        alt={event.title}
                                                        fallbackIcon={Calendar}
                                                        iconClassName="w-6 h-6"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-2 mb-1">{event.title}</h3>
                                                    <span className="text-xs font-medium text-(--charcoal-soft) bg-(--cream-warm) w-fit px-2 py-0.5 rounded">
                                                        {format(parseISO(event.start_date), 'd MMM yyyy', { locale: localeId })}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar (Right - 4 cols) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Key Info Card */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-6" data-reveal data-reveal-delay="100">

                                {/* Ticket Price */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--gold-soft)/30 flex items-center justify-center shrink-0 text-(--gold)">
                                        <Ticket className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Tiket Masuk</p>
                                        <p className="font-semibold text-lg text-(--charcoal)">
                                            {ticketPrice > 0
                                                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ticketPrice)
                                                : 'Gratis'}
                                        </p>
                                        {destination.ticket_info && (
                                            <p className="text-xs text-(--charcoal-soft) mt-1">{destination.ticket_info}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Operational Hours */}
                                {(destination.open_time || destination.close_time || destination.operational_days) && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Jam Operasional</p>

                                            {destination.open_time && destination.close_time && (
                                                <p className="font-semibold text-(--charcoal)">
                                                    {destination.open_time.slice(0, 5)} - {destination.close_time.slice(0, 5)} WIB
                                                </p>
                                            )}

                                            {destination.operational_days && (
                                                <p className="text-sm text-(--charcoal-soft) mt-1">
                                                    Setiap {destination.operational_days}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Location Text */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Lokasi</p>
                                        <p className="font-semibold text-(--charcoal)">Desa Serayu Larangan</p>
                                        <p className="text-sm text-(--charcoal-soft) mt-0.5">Kec. Mrebet, Kab. Purbalingga</p>
                                    </div>
                                </div>

                                {destination.gmaps_link && (
                                    <div className="pt-4 border-t border-(--line)">
                                        <Button asChild className="w-full bg-(--forest) hover:bg-(--forest-deep) text-white font-semibold">
                                            <a href={destination.gmaps_link} target="_blank" rel="noopener noreferrer">
                                                <Navigation className="w-4 h-4 mr-2" />
                                                Petunjuk Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Map Preview Card */}
                            {destination.gmaps_link ? (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-4">
                                    <h3 className="font-display text-base font-bold text-(--forest-deep) flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-(--forest)" />
                                        Peta Lokasi Destinasi
                                    </h3>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-(--line) bg-neutral-100">
                                        <iframe
                                            title={`Peta Google Maps ${destination.name}`}
                                            width="100%"
                                            height="100%"
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                            allowFullScreen
                                            src={embedUrl}
                                        />
                                    </div>
                                </div>
                            ) : destination.latitude && destination.longitude ? (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-4">
                                    <h3 className="font-display text-base font-bold text-(--forest-deep) flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-(--forest)" />
                                        Peta Lokasi Destinasi
                                    </h3>
                                    <div className="h-56 w-full rounded-xl overflow-hidden border border-(--line)">
                                        <Suspense fallback={<div className="w-full h-full bg-neutral-100 animate-pulse" />}>
                                            <DestinationMap
                                                latitude={destination.latitude}
                                                longitude={destination.longitude}
                                                title={destination.name}
                                            />
                                        </Suspense>
                                    </div>
                                </div>
                            ) : null}

                            {/* Share Banner */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm text-center">
                                <p className="text-sm font-semibold text-(--charcoal) mb-3">Bagikan Destinasi Ini</p>
                                <Button variant="outline" className="w-full border-(--line) hover:bg-(--cream-warm) hover:text-(--forest)" onClick={handleShare}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Bagikan Halaman
                                </Button>
                            </div>
                        </div>

                        {/* Related Destinations */}
                        {relatedDestinations && relatedDestinations.length > 0 && (
                            <div className="mt-20 pt-16 border-t border-(--line)" data-reveal>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                    <h2 className="font-display text-2xl font-bold text-(--forest-deep)">
                                        Destinasi Terkait
                                    </h2>
                                    <Link href="/destinasi" className="text-sm font-semibold text-(--forest) hover:text-(--forest-deep) transition-colors flex items-center gap-1">
                                        Lihat Lainnya
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedDestinations.map(related => (
                                        <Link
                                            key={related.id}
                                            href={`/destinasi/${related.slug}`}
                                            className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                        >
                                            <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-200">
                                                <SafeImage
                                                    src={related.primary_media ? `/storage/${related.primary_media.file_path}` : null}
                                                    alt={related.name}
                                                    fallbackIcon={MapIcon}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-white/90 backdrop-blur text-(--forest-deep) text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                                                        {related.category_label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col grow">
                                                <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-1 mb-2">{related.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-(--charcoal-soft) mb-3">
                                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="truncate">Serayu Larangan</span>
                                                </div>
                                                <div className="mt-auto pt-3 border-t border-(--line) flex items-center gap-1.5 text-xs font-semibold text-(--charcoal)">
                                                    <Ticket className="w-3.5 h-3.5 text-(--gold)" />
                                                    <span>
                                                        {parseFloat(related.ticket_price) > 0
                                                            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(related.ticket_price))
                                                            : 'Gratis'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </PublicLayout>
    );
}
