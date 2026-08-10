import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Phone, Globe, Store, Tag, Share2, Navigation } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import { Button } from '@/components/ui/button';
import DestinationMap from '@/components/public/destination-map';
import { getGoogleMapsEmbedUrl } from '@/lib/map-utils';
import { SafeImage } from '@/components/public/safe-image';

interface UmkmPublicDetail {
    id: number;
    name: string;
    slug: string;
    category: string;
    category_label?: string;
    owner_name?: string | null;
    description?: string | null;
    address?: string | null;
    contact_phone?: string | null;
    price_range?: string | null;
    gmaps_link?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    primary_media?: { id?: number; file_path: string } | null;
    media?: { id: number; file_path: string; is_primary: boolean }[];
}

interface Props {
    umkm: UmkmPublicDetail;
    relatedUmkms: UmkmPublicDetail[];
}

export default function UmkmsPublicShow({ umkm, relatedUmkms }: Props) {
    useMotionReveal();

    const primaryMedia = umkm.primary_media ?? umkm.media?.find((m) => m.is_primary) ?? umkm.media?.[0];
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const embedUrl = getGoogleMapsEmbedUrl(umkm);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${umkm.name} - UMKM Desa Serayu Larangan`,
                    text: `Lihat UMKM ${umkm.name} di Desa Serayu Larangan!`,
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
                <title>{`${umkm.name} — UMKM & Kuliner Desa Serayu Larangan`}</title>
                <meta
                    name="description"
                    content={`Profil UMKM & Kuliner ${umkm.name} di Desa Serayu Larangan, Purbalingga. Pemilik: ${umkm.owner_name ?? 'Warga Desa'}.`}
                />
            </Head>

            {/* Top spacing */}
            <div className="pt-16 md:pt-20 lg:pt-24 bg-(--cream-warm)"></div>

            {/* Back & Breadcrumb Navigation (un-stickied) */}
            <div className="bg-(--cream-warm) border-b border-(--line) py-4">
                <div className="container mx-auto max-w-7xl section-padding-x flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/umkm"
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--charcoal-soft) hover:text-(--forest) transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke UMKM & Kuliner
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-(--charcoal-soft)">
                        <Link href="/" className="hover:text-(--forest)">Beranda</Link>
                        <span>/</span>
                        <Link href="/umkm" className="hover:text-(--forest)">UMKM</Link>
                        <span>/</span>
                        <span className="truncate max-w-37.5 md:max-w-75 text-(--charcoal) font-medium">{umkm.name}</span>
                    </div>
                </div>
            </div>

            <article className="py-8 lg:py-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">

                    {/* Header */}
                    <header className="mb-8 md:mb-12" data-reveal>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-(--forest-deep) text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                {umkm.category_label ?? umkm.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-(--forest) font-medium bg-(--forest-mist)/50 px-3 py-1.5 rounded-full text-xs">
                                <MapPin className="w-3.5 h-3.5" />
                                Desa Serayu Larangan
                            </div>
                        </div>

                        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-(--forest-deep) leading-tight mb-4 text-balance">
                            {umkm.name}
                        </h1>

                        {umkm.owner_name && (
                            <p className="text-sm md:text-base text-(--charcoal-soft)">
                                Pemilik / Pengelola: <span className="font-semibold text-(--charcoal)">{umkm.owner_name}</span>
                            </p>
                        )}
                    </header>

                    {/* Content Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Main Content (8 Cols) */}
                        <div className="lg:col-span-8 space-y-8" data-reveal>
                            {/* Primary Image / Hero */}
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-200 border border-(--line) shadow-sm">
                                <SafeImage
                                    src={primaryMedia ? (primaryMedia.file_path.startsWith('http') ? primaryMedia.file_path : `/storage/${primaryMedia.file_path}`) : null}
                                    alt={umkm.name}
                                    fallbackIcon={Store}
                                    iconClassName="w-16 h-16"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Description Card */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-(--line) shadow-sm">
                                <h2 className="font-display text-xl md:text-2xl font-bold text-(--forest-deep) mb-4">
                                    Tentang Usaha & Produk
                                </h2>
                                <div
                                    className="prose-html max-w-none"
                                    dangerouslySetInnerHTML={{ __html: umkm.description || '<p className="text-(--charcoal-soft) italic">Belum ada deskripsi untuk usaha ini.</p>' }}
                                />
                            </div>

                            {/* Gallery Images (if any) */}
                            {umkm.media && umkm.media.filter((m) => !m.is_primary).length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-display text-xl font-bold text-(--forest-deep)">Foto Galeri Produk</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {umkm.media.filter((m) => !m.is_primary).map((m) => (
                                            <div key={m.id} className="aspect-square rounded-xl overflow-hidden border border-(--line)">
                                                <SafeImage
                                                    src={m.file_path.startsWith('http') ? m.file_path : `/storage/${m.file_path}`}
                                                    alt="Galeri UMKM"
                                                    fallbackIcon={Store}
                                                    iconClassName="w-8 h-8"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info & Map (4 Cols) */}
                        <div className="lg:col-span-4 space-y-6" data-reveal data-reveal-delay="100">
                            
                            {/* Key Info Card */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-6">
                                {umkm.price_range && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-(--gold-soft)/30 flex items-center justify-center shrink-0 text-(--gold)">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Kisaran Harga</p>
                                            <p className="font-bold text-lg text-(--forest-deep)">{umkm.price_range}</p>
                                        </div>
                                    </div>
                                )}

                                {umkm.contact_phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Kontak WhatsApp</p>
                                            <a 
                                                href={`https://wa.me/${umkm.contact_phone.replace(/[^0-9]/g, '')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-semibold text-(--forest) hover:underline"
                                            >
                                                {umkm.contact_phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0 text-(--forest)">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--charcoal-soft) font-medium uppercase tracking-wider mb-1">Lokasi Usaha</p>
                                        <p className="font-semibold text-(--charcoal)">{umkm.address ?? 'Desa Serayu Larangan'}</p>
                                        <p className="text-sm text-(--charcoal-soft) mt-0.5">Kec. Mrebet, Kab. Purbalingga</p>
                                    </div>
                                </div>

                                {umkm.gmaps_link && (
                                    <div className="pt-4 border-t border-(--line)">
                                        <Button asChild className="w-full bg-(--forest) hover:bg-(--forest-deep) text-white font-semibold">
                                            <a href={umkm.gmaps_link} target="_blank" rel="noopener noreferrer">
                                                <Navigation className="w-4 h-4 mr-2" />
                                                Petunjuk Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Map Preview Card */}
                            {umkm.gmaps_link ? (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-4">
                                    <h3 className="font-display text-base font-bold text-(--forest-deep) flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-(--forest)" />
                                        Peta Lokasi Usaha
                                    </h3>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-(--line) bg-neutral-100">
                                        <iframe
                                            title={`Peta Google Maps ${umkm.name}`}
                                            width="100%"
                                            height="100%"
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                            allowFullScreen
                                            src={embedUrl}
                                        />
                                    </div>
                                </div>
                            ) : umkm.latitude && umkm.longitude ? (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm space-y-4">
                                    <h3 className="font-display text-base font-bold text-(--forest-deep) flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-(--forest)" />
                                        Peta Lokasi Usaha
                                    </h3>
                                    <div className="h-56 w-full rounded-xl overflow-hidden border border-(--line)">
                                        <DestinationMap
                                            latitude={umkm.latitude}
                                            longitude={umkm.longitude}
                                            title={umkm.name}
                                        />
                                    </div>
                                </div>
                            ) : null}

                            {/* Share Banner */}
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm text-center">
                                <p className="text-sm font-semibold text-(--charcoal) mb-3">Bagikan Produk / UMKM Ini</p>
                                <Button variant="outline" className="w-full border-(--line) hover:bg-(--cream-warm) hover:text-(--forest)" onClick={handleShare}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Bagikan Halaman
                                </Button>
                            </div>

                            {/* Related UMKM */}
                            {relatedUmkms.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-sm">
                                    <h3 className="font-display text-lg font-bold text-(--forest-deep) mb-4">
                                        UMKM Serupa Lainnya
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedUmkms.map((rel) => (
                                            <Link
                                                key={rel.id}
                                                href={`/umkm/${rel.slug}`}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-(--cream-warm) transition-colors group"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                                                    <SafeImage
                                                        src={rel.primary_media ? (rel.primary_media.file_path.startsWith('http') ? rel.primary_media.file_path : `/storage/${rel.primary_media.file_path}`) : null}
                                                        alt={rel.name}
                                                        fallbackIcon={Store}
                                                        iconClassName="w-6 h-6"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-sm text-(--forest-deep) group-hover:text-(--forest) truncate">
                                                        {rel.name}
                                                    </h4>
                                                    <p className="text-xs text-(--charcoal-soft) truncate">
                                                        {rel.price_range ?? rel.category_label}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </article>
        </PublicLayout>
    );
}
