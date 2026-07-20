import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MapPin, Map, Share2, Ticket, User, Phone, Instagram, QrCode } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Event } from '@/types/public';
import { Button } from '@/components/ui/button';
import { format, parseISO, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${event.title} - Wisata Mrebet`,
                    text: 'Lihat acara ini di Wisata Mrebet!',
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
                <title>{`${event.title} — Acara Wisata Mrebet`}</title>
                <meta name="description" content={event.title} />
            </Head>

            {/* Top spacing for fixed navbar */}
            <div className="pt-16 md:pt-20 lg:pt-24 bg-(--cream-warm)"></div>

            {/* Back Navigation */}
            <div className="bg-(--cream-warm) border-b border-(--line) py-4">
                <div className="container mx-auto max-w-7xl section-padding-x flex items-center justify-between">
                    <Link
                        href={'/event'}
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--charcoal-soft) hover:text-(--forest) transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Kalender
                    </Link>
                    
                    <Button variant="ghost" size="sm" onClick={handleShare} className="text-(--charcoal-soft) hover:text-(--forest)">
                        <Share2 className="w-4 h-4 mr-2" />
                        Bagikan
                    </Button>
                </div>
            </div>

            <article className="py-8 lg:py-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8" data-reveal>
                            {/* Header */}
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-(--forest-deep) leading-tight mb-4 text-balance">
                                    {event.title}
                                </h1>
                                {event.village && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-2 text-(--forest) font-medium bg-(--forest-mist)/50 px-3 py-1.5 rounded-full text-sm">
                                            <MapPin className="w-4 h-4" />
                                            Desa {event.village.name}
                                        </div>
                                        {event.destination && (
                                            <div className="flex items-center gap-2 text-(--gold) font-medium bg-(--gold-soft)/30 px-3 py-1.5 rounded-full text-sm">
                                                <Map className="w-4 h-4" />
                                                {event.destination.name}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cover Image */}
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-200 border border-(--line)">
                                {event.primary_media ? (
                                    <img 
                                        src={`/storage/${event.primary_media.file_path}`} 
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                        <Calendar className="w-16 h-16" />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-(--line) shadow-sm">
                                <h2 className="font-display text-xl font-bold text-(--forest-deep) mb-4">
                                    Tentang Acara
                                </h2>
                                {event.description ? (
                                    <div 
                                        className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-(--forest-deep) prose-a:text-(--forest) hover:prose-a:text-(--forest-deep)"
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
                                                <img 
                                                    src={`/storage/${media.file_path}`} 
                                                    alt="Galeri event" 
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6" data-reveal data-reveal-delay="100">
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
                                
                                {event.qr_code_target && (
                                    <div className="pt-4 border-t border-(--line)">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full bg-(--forest) hover:bg-(--forest-deep) text-white font-semibold">
                                                    <QrCode className="w-4 h-4 mr-2" />
                                                    Pindai QR Code Tiket/Info
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>QR Code Acara</DialogTitle>
                                                    <DialogDescription>
                                                        Pindai QR Code di bawah ini untuk mengakses tiket atau informasi lebih lanjut.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-center py-6">
                                                    {/* In a real app, generate QR from event.qr_code_target */}
                                                    <div className="w-48 h-48 bg-white border border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                                                        <QrCode className="w-24 h-24 text-gray-300" />
                                                    </div>
                                                </div>
                                                <div className="text-center text-sm">
                                                    <a href={event.qr_code_target} target="_blank" rel="noreferrer" className="text-(--forest) hover:underline break-all">
                                                        {event.qr_code_target}
                                                    </a>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}
                            </div>

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
                            
                            {/* Explore Village CTA */}
                            {event.village && (
                                <div className="bg-(--forest-deep) rounded-2xl p-6 text-white text-center">
                                    <Map className="w-8 h-8 text-(--gold) mx-auto mb-3" />
                                    <h4 className="font-display text-lg font-bold mb-2">Eksplorasi Desa {event.village.name}</h4>
                                    <p className="text-sm text-white/70 mb-4">Temukan destinasi wisata dan keindahan lainnya di desa ini.</p>
                                    <Link href={`/desa/${event.village.slug}`} className="inline-flex items-center justify-center w-full bg-white text-(--forest-deep) rounded-full py-2.5 text-sm font-semibold hover:bg-(--cream-warm) transition-colors">
                                        Lihat Profil Desa
                                    </Link>
                                </div>
                            )}
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
                                            {related.primary_media ? (
                                                <img src={`/storage/${related.primary_media.file_path}`} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                    <Calendar className="w-8 h-8" />
                                                </div>
                                            )}
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
                                                    <span>{related.village?.name}</span>
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
