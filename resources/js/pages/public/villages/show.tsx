import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, MapPin, Landmark, UserCheck, PhoneCall, 
    Share2, Calendar, Map as MapIcon, ArrowRight, Navigation, 
    Facebook, Twitter, BookOpen, Ticket, QrCode
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Village, Destination, Event, Blog } from '@/types/public';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import React, { Suspense, lazy } from 'react';

const DestinationMap = lazy(() => import('@/components/public/destination-map'));

interface Props {
    village: Village;
    destinations: Destination[];
    events: Event[];
    blogs: Blog[];
    relatedVillages: Village[];
}

export default function VillageShow({ village, destinations, events, blogs, relatedVillages }: Props) {
    useMotionReveal();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Desa Wisata ${village.name} - Wisata Mrebet`,
                    text: `Jelajahi potensi keindahan Desa Wisata ${village.name} di Kecamatan Mrebet!`,
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

    // Format phone to International format for WhatsApp link
    const getWaNumber = (phone: string | null) => {
        if (!phone) return null;
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }
        return cleaned;
    };

    const waNumber = getWaNumber(village.contact_phone);

    // SEO Schema
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": `Desa Wisata ${village.name}`,
        "description": village.description ? village.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : '',
        "geo": village.latitude && village.longitude ? {
            "@type": "GeoCoordinates",
            "latitude": village.latitude,
            "longitude": village.longitude,
        } : undefined,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": village.name,
            "addressRegion": "Jawa Tengah",
            "addressCountry": "ID"
        }
    };

    const excerpt = village.description 
        ? village.description.replace(/<[^>]*>?/gm, '').trim().substring(0, 150) + '...'
        : `Jelajahi Desa Wisata ${village.name} di Kecamatan Mrebet, Kabupaten Purbalingga.`;

    return (
        <PublicLayout>
            <Head>
                <title>{`Desa Wisata ${village.name} — Wisata Mrebet`}</title>
                <meta name="description" content={excerpt} />
                <link rel="canonical" href={shareUrl} />
                
                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`Desa Wisata ${village.name}`} />
                <meta property="og:description" content={excerpt} />
                <meta 
                    property="og:image" 
                    content={village.primary_media ? `/storage/${village.primary_media.file_path}` : '/default-og.jpg'} 
                />
                <meta property="og:url" content={shareUrl} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Desa Wisata ${village.name}`} />
                <meta name="twitter:description" content={excerpt} />
                <meta 
                    name="twitter:image" 
                    content={village.primary_media ? `/storage/${village.primary_media.file_path}` : '/default-og.jpg'} 
                />
                
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            {/* Top spacing */}
            <div className="pt-16 md:pt-20 lg:pt-24 bg-(--cream-warm)"></div>

            {/* Back Navigation */}
            <div className="bg-(--cream-warm) border-b border-(--line) py-4 sticky top-16 md:top-20 lg:top-24 z-30">
                <div className="container mx-auto max-w-7xl section-padding-x flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/desa"
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--charcoal-soft) hover:text-(--forest) transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Desa
                    </Link>
                    
                    <div className="flex items-center gap-2 text-sm text-(--charcoal-soft)">
                        <Link href="/" className="hover:text-(--forest)">Beranda</Link>
                        <span>/</span>
                        <Link href="/desa" className="hover:text-(--forest)">Desa Wisata</Link>
                        <span>/</span>
                        <span className="truncate max-w-37.5 md:max-w-75 text-(--charcoal) font-medium">{village.name}</span>
                    </div>
                </div>
            </div>

            <article className="py-8 lg:py-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    
                    {/* Header */}
                    <header className="mb-8 md:mb-12" data-reveal>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-(--forest-deep) text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                Desa Wisata
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-(--forest-deep) leading-tight mb-4 text-balance">
                            Desa Wisata {village.name}
                        </h1>
                        <p className="text-sm md:text-base text-(--charcoal-soft) flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-(--forest)" />
                            Kecamatan Mrebet, Kabupaten Purbalingga, Jawa Tengah
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Main Content (Left - 8 cols) */}
                        <div className="lg:col-span-8 space-y-8 md:space-y-12">
                            
                            {/* Gallery Banner */}
                            <div className="space-y-4" data-reveal>
                                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-200 border border-(--line) shadow-sm">
                                    {village.primary_media ? (
                                        <img 
                                            src={`/storage/${village.primary_media.file_path}`} 
                                            alt={village.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                            <Landmark className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>

                                {village.media && village.media.filter(m => !m.is_primary).length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {village.media.filter(m => !m.is_primary).map((media) => (
                                            <div key={media.id} className="aspect-square rounded-xl overflow-hidden border border-(--line) bg-neutral-100">
                                                <img 
                                                    src={`/storage/${media.file_path}`} 
                                                    alt="Galeri Desa" 
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* About Village */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 border border-(--line) shadow-sm" data-reveal>
                                <h2 className="font-display text-2xl font-bold text-(--forest-deep) mb-6 flex items-center gap-2">
                                    <Landmark className="w-6 h-6 text-(--forest)" />
                                    Tentang Desa Wisata {village.name}
                                </h2>
                                
                                {village.description ? (
                                    <div 
                                        className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-(--forest-deep) prose-a:text-(--forest) hover:prose-a:text-(--forest-deep)"
                                        dangerouslySetInnerHTML={{ __html: village.description }}
                                    />
                                ) : (
                                    <p className="text-(--charcoal-soft) italic">
                                        Belum ada deskripsi profil lengkap untuk Desa Wisata {village.name}.
                                    </p>
                                )}
                            </div>

                            {/* Destinations in this Village */}
                            {destinations && destinations.length > 0 && (
                                <div className="space-y-6" data-reveal>
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-display text-2xl font-bold text-(--forest-deep) flex items-center gap-2">
                                            <MapIcon className="w-6 h-6 text-(--forest)" />
                                            Destinasi Wisata di Desa Ini
                                        </h2>
                                        <Link href={`/destinasi?search=${village.name}`} className="text-xs font-bold text-(--forest) hover:underline flex items-center gap-1">
                                            Lihat Semua ({destinations.length})
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {destinations.map((dest) => (
                                            <Link 
                                                key={dest.id}
                                                href={`/destinasi/${dest.slug}`}
                                                className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                            >
                                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                                                    {dest.primary_media ? (
                                                        <img src={`/storage/${dest.primary_media.file_path}`} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                            <MapIcon className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                    <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur text-(--forest-deep) text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                                                        {dest.category_label}
                                                    </span>
                                                </div>
                                                <div className="p-4 flex flex-col grow">
                                                    <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-1 mb-1">{dest.name}</h3>
                                                    <div className="mt-auto pt-3 border-t border-(--line) flex items-center justify-between text-xs font-semibold text-(--charcoal)">
                                                        <span className="flex items-center gap-1 text-(--gold-deep)">
                                                            <Ticket className="w-3.5 h-3.5" />
                                                            {parseFloat(dest.ticket_price) > 0 
                                                                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(dest.ticket_price)) 
                                                                : 'Gratis'}
                                                        </span>
                                                        <span className="text-(--forest) group-hover:translate-x-1 transition-transform">Detail &rarr;</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Events in this Village */}
                            {events && events.length > 0 && (
                                <div className="space-y-6" data-reveal>
                                    <h2 className="font-display text-2xl font-bold text-(--forest-deep) flex items-center gap-2">
                                        <Calendar className="w-6 h-6 text-(--gold)" />
                                        Acara & Event Mendatang
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {events.map((event) => (
                                            <Link 
                                                key={event.id}
                                                href={`/event/${event.slug}`}
                                                className="bg-white rounded-xl border border-(--line) p-4 flex gap-4 hover:border-(--forest-mist) hover:shadow-md transition-all group"
                                            >
                                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                                                    {event.primary_media ? (
                                                        <img src={`/storage/${event.primary_media.file_path}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                            <Calendar className="w-6 h-6" />
                                                        </div>
                                                    )}
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

                            {/* News related to Village */}
                            {blogs && blogs.length > 0 && (
                                <div className="space-y-6" data-reveal>
                                    <h2 className="font-display text-2xl font-bold text-(--forest-deep) flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-(--forest)" />
                                        Kabar & Artikel Desa
                                    </h2>

                                    <div className="space-y-3">
                                        {blogs.map((blog) => (
                                            <Link 
                                                key={blog.id}
                                                href={`/berita/${blog.slug}`}
                                                className="bg-white rounded-xl border border-(--line) p-4 flex items-center justify-between hover:border-(--forest-mist) hover:shadow-sm transition-all group"
                                            >
                                                <div className="pr-4">
                                                    <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-1 mb-1">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-xs text-(--charcoal-soft)">
                                                        {format(parseISO(blog.published_at), 'd MMMM yyyy', { locale: localeId })}
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-(--forest) group-hover:translate-x-1 transition-transform shrink-0" />
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
                                
                                {/* Head Name */}
                                {village.head_name && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Kepala Desa / Lurah</p>
                                            <p className="font-semibold text-(--charcoal)">{village.head_name}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Direct WA Contact */}
                                {village.contact_phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                                            <PhoneCall className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Kontak Pengelola</p>
                                            <p className="font-semibold text-(--charcoal) mb-2">{village.contact_phone}</p>
                                            
                                            {waNumber && (
                                                <a 
                                                    href={`https://wa.me/${waNumber}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full rounded-full text-xs">
                                                        Hubungi via WhatsApp
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* QR Code Target */}
                                {village.qr_code_target && (
                                    <div className="pt-4 border-t border-(--line)">
                                        <a href={village.qr_code_target} target="_blank" rel="noreferrer">
                                            <Button variant="outline" className="w-full border-(--line) text-xs">
                                                <QrCode className="w-4 h-4 mr-2" />
                                                Informasi Tambahan (QR)
                                            </Button>
                                        </a>
                                    </div>
                                )}

                            </div>

                            {/* Location Map Card */}
                            {village.latitude && village.longitude && (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm flex flex-col" data-reveal data-reveal-delay="150">
                                    <h3 className="font-display text-lg font-bold text-(--forest-deep) mb-4 flex items-center gap-2">
                                        <MapIcon className="w-5 h-5 text-(--forest)" />
                                        Peta Lokasi Desa
                                    </h3>
                                    <div className="grow rounded-xl overflow-hidden min-h-[250px] relative">
                                        <Suspense fallback={<div className="w-full h-full bg-neutral-100 flex items-center justify-center min-h-[250px] animate-pulse"><MapIcon className="w-8 h-8 text-neutral-300" /></div>}>
                                            <DestinationMap 
                                                latitude={village.latitude} 
                                                longitude={village.longitude} 
                                                title={`Desa Wisata ${village.name}`} 
                                            />
                                        </Suspense>
                                    </div>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${village.latitude},${village.longitude}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="mt-4 flex"
                                    >
                                        <Button variant="outline" className="w-full border-(--line) hover:bg-(--cream-warm) hover:text-(--forest) group text-xs">
                                            <Navigation className="w-4 h-4 mr-2 group-hover:text-(--forest)" />
                                            Buka di Google Maps
                                        </Button>
                                    </a>
                                </div>
                            )}

                            {/* Share Card */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm text-center" data-reveal data-reveal-delay="200">
                                <p className="text-sm font-semibold text-(--charcoal) mb-3">Bagikan Desa Wisata Ini</p>
                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full border-(--line) hover:text-(--forest) hover:border-(--forest)" onClick={handleShare}>
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon" className="rounded-full border-(--line) hover:text-[#1877F2] hover:border-[#1877F2]">
                                            <Facebook className="w-4 h-4" />
                                        </Button>
                                    </a>
                                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Desa Wisata: '+village.name)}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon" className="rounded-full border-(--line) hover:text-[#1DA1F2] hover:border-[#1DA1F2]">
                                            <Twitter className="w-4 h-4" />
                                        </Button>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Related Villages */}
                    {relatedVillages && relatedVillages.length > 0 && (
                        <div className="mt-20 pt-16 border-t border-(--line)" data-reveal>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                <h2 className="font-display text-2xl font-bold text-(--forest-deep)">
                                    Desa Wisata Lainnya
                                </h2>
                                <Link href="/desa" className="text-sm font-semibold text-(--forest) hover:text-(--forest-deep) transition-colors flex items-center gap-1">
                                    Lihat Semua Desa
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedVillages.map(item => (
                                    <Link 
                                        key={item.id} 
                                        href={`/desa/${item.slug}`} 
                                        className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                                            {item.primary_media ? (
                                                <img 
                                                    src={`/storage/${item.primary_media.file_path}`} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                    <Landmark className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col grow">
                                            <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-1 mb-2">Desa {item.name}</h3>
                                            <p className="text-xs text-(--charcoal-soft) line-clamp-2 mb-4">
                                                {item.description ? item.description.replace(/<[^>]*>?/gm, '').trim() : 'Menyajikan keindahan khas pedesaan Mrebet.'}
                                            </p>
                                            <div className="mt-auto pt-3 border-t border-(--line) flex items-center justify-between text-xs font-semibold text-(--forest)">
                                                <span>{item.destinations_count || 0} Destinasi Wisata</span>
                                                <span className="group-hover:translate-x-1 transition-transform">Eksplor &rarr;</span>
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
