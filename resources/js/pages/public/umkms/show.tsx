import { Head, Link } from '@inertiajs/react';
import { MapPin, Phone, Globe, ChevronLeft, Store, Tag } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    media?: { id: number; file_path: string; is_primary: boolean }[];
}

interface Props {
    umkm: UmkmPublicDetail;
    relatedUmkms: UmkmPublicDetail[];
}

export default function UmkmsPublicShow({ umkm, relatedUmkms }: Props) {
    useMotionReveal();

    const primaryMedia = umkm.media?.find((m) => m.is_primary) ?? umkm.media?.[0];

    return (
        <PublicLayout>
            <Head>
                <title>{`${umkm.name} — UMKM Desa Serayu Larangan`}</title>
                <meta
                    name="description"
                    content={`Profil UMKM & Kuliner ${umkm.name} di Desa Serayu Larangan, Purbalingga. Pemilik: ${umkm.owner_name ?? 'Warga Desa'}.`}
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-36 pb-16 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-6xl section-padding-x">
                    {/* Back Link */}
                    <div className="mb-6" data-reveal>
                        <Button variant="ghost" size="sm" asChild className="text-(--charcoal-soft) hover:text-(--forest-deep)">
                            <Link href="/umkm">
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Kembali ke Daftar UMKM
                            </Link>
                        </Button>
                    </div>

                    {/* Content Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6" data-reveal data-reveal-delay="50">
                            {primaryMedia && (
                                <div className="rounded-2xl overflow-hidden border border-(--line) shadow-sm bg-neutral-100 max-h-96">
                                    <img
                                        src={primaryMedia.file_path.startsWith('http') ? primaryMedia.file_path : `/storage/${primaryMedia.file_path}`}
                                        alt={umkm.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-(--line) shadow-xs">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge className="bg-(--forest-mist) text-(--forest-deep) border-0 px-3 py-1 font-semibold text-xs">
                                        {umkm.category_label ?? umkm.category}
                                    </Badge>
                                </div>

                                <h1 className="font-display text-3xl md:text-4xl font-bold text-(--forest-deep) mb-2">
                                    {umkm.name}
                                </h1>

                                {umkm.owner_name && (
                                    <p className="text-sm text-(--charcoal-soft) mb-6">
                                        Pemilik / Pengelola: <span className="font-semibold text-(--charcoal)">{umkm.owner_name}</span>
                                    </p>
                                )}

                                <div className="border-t border-(--line) pt-6">
                                    <h2 className="font-display text-xl font-bold text-(--forest-deep) mb-3">
                                        Deskripsi Usaha & Produk
                                    </h2>
                                    <div
                                        className="prose prose-sm md:prose-base max-w-none text-(--charcoal) leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: umkm.description || '<p>Belum ada deskripsi usaha.</p>' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info & Contact */}
                        <div className="space-y-6" data-reveal data-reveal-delay="100">
                            <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-xs space-y-5">
                                <h3 className="font-display text-lg font-bold text-(--forest-deep) pb-3 border-b border-(--line)">
                                    Detail Kontak & Lokasi
                                </h3>

                                <div className="space-y-4 text-sm">
                                    {umkm.price_range && (
                                        <div className="p-3.5 bg-(--cream-warm) rounded-xl border border-(--line)">
                                            <span className="text-xs font-semibold text-(--forest-deep) block mb-0.5">Kisaran Harga</span>
                                            <span className="font-semibold text-base text-(--forest)">{umkm.price_range}</span>
                                        </div>
                                    )}

                                    {umkm.contact_phone && (
                                        <div className="flex items-start gap-3 text-(--charcoal)">
                                            <div className="w-8 h-8 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0">
                                                <Phone className="h-4 w-4 text-(--forest)" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-(--charcoal-soft) block">Nomor HP / WhatsApp</span>
                                                <a 
                                                    href={`https://wa.me/${umkm.contact_phone.replace(/[^0-9]/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    {umkm.contact_phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 text-(--charcoal)">
                                        <div className="w-8 h-8 rounded-full bg-(--forest-mist) flex items-center justify-center shrink-0">
                                            <MapPin className="h-4 w-4 text-(--forest)" />
                                        </div>
                                        <div>
                                            <span className="text-xs text-(--charcoal-soft) block">Alamat Usaha</span>
                                            <span className="font-medium">{umkm.address ?? 'Desa Serayu Larangan, Kec. Mrebet'}</span>
                                        </div>
                                    </div>
                                </div>

                                {umkm.gmaps_link && (
                                    <div className="pt-2">
                                        <Button asChild className="w-full bg-(--forest) hover:bg-(--forest-deep)">
                                            <a href={umkm.gmaps_link} target="_blank" rel="noopener noreferrer">
                                                <Globe className="mr-2 h-4 w-4" />
                                                Buka di Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Related UMKM */}
                            {relatedUmkms.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-(--line) shadow-xs">
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
                                                    {rel.primary_media ? (
                                                        <img
                                                            src={rel.primary_media.file_path.startsWith('http') ? rel.primary_media.file_path : `/storage/${rel.primary_media.file_path}`}
                                                            alt={rel.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Store className="w-full h-full p-3 text-(--forest) opacity-40" />
                                                    )}
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
            </section>
        </PublicLayout>
    );
}
