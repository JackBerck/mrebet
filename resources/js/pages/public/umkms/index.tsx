import { Head, Link, router } from '@inertiajs/react';
import { Search, Store, MapPin, Phone, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { PaginatedData } from '@/types';

interface UmkmPublic {
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
    primary_media?: { file_path: string } | null;
}

interface Props {
    umkms: PaginatedData<UmkmPublic>;
    categories: { value: string; label: string }[];
    filters: { search?: string; category?: string };
}

export default function UmkmsPublicIndex({ umkms, categories, filters }: Props) {
    useMotionReveal();
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeCategory, setActiveCategory] = useState(filters.category ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/umkm', { search, category: activeCategory }, { preserveState: true });
    };

    const handleCategoryClick = (catVal: string) => {
        const newCat = activeCategory === catVal ? '' : catVal;
        setActiveCategory(newCat);
        router.get('/umkm', { search, category: newCat }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head>
                <title>UMKM & Kuliner Desa — Serayu Larangan</title>
                <meta
                    name="description"
                    content="Jelajahi berbagai UMKM lokal, kerajinan olahan nira kelapa, warung kuliner tradisional khas Desa Serayu Larangan, Purbalingga."
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-40 pb-16 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    {/* Header Banner */}
                    <div className="mb-10 max-w-3xl bg-(--forest-deep) text-white p-6 md:p-8 rounded-2xl shadow-sm" data-reveal>
                        <Badge className="bg-(--gold) text-(--forest-deep) border-0 mb-3 px-3 py-1 font-semibold">
                            Ekonomi & Usaha Lokal
                        </Badge>
                        <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
                            UMKM & Kuliner Desa
                        </h1>
                        <p className="text-sm md:text-base leading-relaxed text-white/90">
                            Dukung perekonomian warga Desa Serayu Larangan dengan membeli produk murni penderes nira, gula semut organik, batik tulis lokal, hingga berbagai sajian kuliner warung tradisional.
                        </p>
                    </div>

                    {/* Filter & Search */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center" data-reveal data-reveal-delay="50">
                        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--charcoal-soft)" />
                                <Input
                                    placeholder="Cari produk / nama warung..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 bg-white border-(--line)"
                                />
                            </div>
                            <Button type="submit" className="bg-(--forest) hover:bg-(--forest-deep)">
                                Cari
                            </Button>
                        </form>

                        {/* Category Badges */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={activeCategory === '' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryClick('')}
                                className={activeCategory === '' ? 'bg-(--forest) text-white' : 'bg-white border-(--line)'}
                            >
                                Semua
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.value}
                                    variant={activeCategory === cat.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleCategoryClick(cat.value)}
                                    className={activeCategory === cat.value ? 'bg-(--forest) text-white' : 'bg-white border-(--line)'}
                                >
                                    {cat.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Grid List */}
                    {umkms.data.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-(--line) p-8" data-reveal>
                            <Store className="h-12 w-12 text-(--charcoal-soft) mx-auto mb-3 opacity-40" />
                            <h3 className="font-display text-xl font-bold text-(--forest-deep) mb-1">
                                UMKM Tidak Ditemukan
                            </h3>
                            <p className="text-sm text-(--charcoal-soft)">
                                Coba ubah kata kunci pencarian atau pilih kategori lainnya.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal data-reveal-delay="100">
                            {umkms.data.map((umkm) => (
                                <div
                                    key={umkm.id}
                                    className="group flex flex-col bg-white rounded-2xl border border-(--line) shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-(--forest-mist)"
                                >
                                    {/* Cover Image */}
                                    <div className="relative h-52 overflow-hidden bg-neutral-100">
                                        {umkm.primary_media ? (
                                            <img
                                                src={umkm.primary_media.file_path.startsWith('http') ? umkm.primary_media.file_path : `/storage/${umkm.primary_media.file_path}`}
                                                alt={umkm.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30">
                                                <Store className="h-10 w-10 text-(--forest) opacity-40" />
                                            </div>
                                        )}

                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-white/90 text-(--forest-deep) border-0 backdrop-blur-xs font-semibold px-2.5 py-1 text-xs">
                                                {umkm.category_label ?? umkm.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex flex-col flex-1 p-5">
                                        <h3 className="font-display text-xl font-bold text-(--forest-deep) mb-1 line-clamp-1 group-hover:text-(--forest) transition-colors">
                                            {umkm.name}
                                        </h3>

                                        {umkm.owner_name && (
                                            <p className="text-xs text-(--charcoal-soft) mb-2">
                                                Pemilik: <span className="font-medium text-(--charcoal)">{umkm.owner_name}</span>
                                            </p>
                                        )}

                                        <p className="text-sm text-(--charcoal-soft) line-clamp-2 leading-relaxed mb-4">
                                            {umkm.description?.replace(/<[^>]*>?/gm, '') ?? 'Produk unggulan berkualitas khas Desa Serayu Larangan.'}
                                        </p>

                                        {/* Footer Metadata */}
                                        <div className="mt-auto pt-4 border-t border-(--line) flex items-center justify-between">
                                            {umkm.price_range ? (
                                                <span className="text-xs font-semibold text-(--forest-deep) bg-(--cream-warm) px-2.5 py-1 rounded-full border border-(--line)">
                                                    {umkm.price_range}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-(--charcoal-soft)">
                                                    Serayu Larangan
                                                </span>
                                            )}

                                            <Button asChild size="sm" className="bg-(--forest) hover:bg-(--forest-deep) text-xs">
                                                <Link href={`/umkm/${umkm.slug}`}>
                                                    Lihat Usaha
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {umkms.last_page > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {umkms.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={link.active ? 'bg-(--forest) text-white' : 'bg-white'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
