import { Head, Link, router } from '@inertiajs/react';
import { Search, Store, MapPin, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PaginatedData } from '@/types/models';
import { SafeImage } from '@/components/public/safe-image';

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

interface CategoryOption {
    value: string;
    label: string;
}

interface Props {
    umkms: PaginatedData<UmkmPublic>;
    categories: CategoryOption[];
    filters: {
        search: string | null;
        category: string | null;
    };
}

export default function UmkmsPublicIndex({ umkms, categories, filters }: Props) {
    useMotionReveal();
    const [search, setSearch] = useState(filters.search || '');
    const [activeCategory, setActiveCategory] = useState<string | null>(filters.category || null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateFilters = useCallback((query: string, cat: string | null) => {
        const payload: Record<string, string> = {};
        if (query) payload.search = query;
        if (cat) payload.category = cat;

        router.get('/umkm', payload, { preserveState: true, replace: true });
    }, []);

    const debouncedSearch = useCallback(
        (query: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                updateFilters(query, activeCategory);
            }, 400);
        },
        [activeCategory, updateFilters]
    );

    useEffect(() => {
        if (search !== (filters.search || '')) {
            debouncedSearch(search);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [search, debouncedSearch, filters.search]);

    const handleClearSearch = () => {
        setSearch('');
        updateFilters('', activeCategory);
    };

    const handleCategorySelect = (val: string | null) => {
        setActiveCategory(val);
        updateFilters(search, val);
    };

    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <PublicLayout>
            <Head>
                <title>UMKM & Kuliner — Desa Wisata Serayu Larangan</title>
                <meta
                    name="description"
                    content="Jelajahi berbagai usaha mikro, kerajinan gula jawa, gula semut murni, dan tempat kuliner khas Desa Serayu Larangan, Purbalingga."
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="UMKM & Kuliner — Desa Wisata Serayu Larangan" />
                <meta property="og:description" content="Jelajahi berbagai usaha mikro, kerajinan gula jawa, gula semut murni, dan tempat kuliner khas Desa Serayu Larangan, Purbalingga." />
                <meta property="og:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Desa Wisata Serayu Larangan" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="UMKM & Kuliner — Desa Wisata Serayu Larangan" />
                <meta name="twitter:description" content="Jelajahi berbagai usaha mikro, kerajinan gula jawa, gula semut murni, dan tempat kuliner khas Desa Serayu Larangan, Purbalingga." />
                <meta name="twitter:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-40 pb-12 lg:pb-20 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    
                    {/* Header */}
                    <header className="mb-10 md:mb-12 max-w-3xl" data-reveal>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-(--forest-deep) mb-4">
                            UMKM & Kuliner Desa
                        </h1>
                        <p className="text-base md:text-lg text-(--charcoal-soft) leading-relaxed">
                            Dukung perekonomian warga Desa Serayu Larangan dengan membeli produk lokal penderes nira, gula semut murni, kerajinan bambu, batik tulis, hingga sajian kuliner warung tradisional.
                        </p>
                    </header>

                    {/* Filter & Search Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10" data-reveal data-reveal-delay="50">
                        
                        {/* Category Filters (Mobile Shadcn Dropdown & Desktop Chips) */}
                        <div className="w-full md:w-auto">
                            {/* Mobile View: Shadcn Select Dropdown */}
                            <div className="md:hidden flex items-center gap-2">
                                <span className="text-xs text-(--charcoal-soft) font-medium shrink-0">Kategori:</span>
                                <Select 
                                    value={activeCategory || 'all'} 
                                    onValueChange={(val) => handleCategorySelect(val === 'all' ? null : val)}
                                >
                                    <SelectTrigger className="w-full bg-white border-(--line) text-sm h-11 rounded-full shadow-sm">
                                        <SelectValue placeholder="Pilih Kategori UMKM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop View: Chips */}
                            <div className="hidden md:flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => handleCategorySelect(null)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        !activeCategory 
                                            ? 'bg-(--forest) text-white shadow-sm' 
                                            : 'bg-white border border-(--line) text-(--charcoal) hover:border-(--forest-mist) hover:bg-(--forest-mist)/30'
                                    }`}
                                >
                                    Semua
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => handleCategorySelect(cat.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            activeCategory === cat.value 
                                                ? 'bg-(--forest) text-white shadow-sm' 
                                                : 'bg-white border border-(--line) text-(--charcoal) hover:border-(--forest-mist) hover:bg-(--forest-mist)/30'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80 shrink-0">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <Search className="w-4 h-4 text-(--charcoal-soft)" />
                            </div>
                            <Input
                                type="text"
                                className="pl-10 h-11 rounded-full border-(--line) bg-white focus-visible:ring-(--forest) shadow-sm text-sm"
                                placeholder="Cari produk / nama warung..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button 
                                    onClick={handleClearSearch}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-medium text-(--charcoal-soft) hover:text-(--forest)"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Grid List */}
                    {umkms.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-reveal data-reveal-delay="100">
                            {umkms.data.map((umkm) => (
                                <Link 
                                    key={umkm.id} 
                                    href={`/umkm/${umkm.slug}`} 
                                    as="article"
                                    className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full cursor-pointer"
                                >
                                    {/* Cover Image */}
                                    <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-200">
                                        <SafeImage
                                            src={umkm.primary_media ? (umkm.primary_media.file_path.startsWith('http') ? umkm.primary_media.file_path : `/storage/${umkm.primary_media.file_path}`) : null}
                                            alt={umkm.name}
                                            fallbackIcon={Store}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur text-(--forest-deep) text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm border border-white/20">
                                                {umkm.category_label ?? umkm.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-5 md:p-6 flex flex-col grow">
                                        <h2 className="font-display text-xl font-bold text-(--forest-deep) group-hover:text-(--forest) transition-colors line-clamp-1 mb-2">
                                            {umkm.name}
                                        </h2>

                                        <div className="flex items-center gap-1.5 text-sm text-(--charcoal-soft) mb-4">
                                            <MapPin className="w-4 h-4 shrink-0" />
                                            <span className="truncate">
                                                {umkm.owner_name ? `Pemilik: ${umkm.owner_name}` : 'Desa Serayu Larangan'}
                                            </span>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-(--line) flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-(--forest-deep)">
                                                <Tag className="w-4 h-4 text-(--gold)" />
                                                <span>
                                                    {umkm.price_range ? umkm.price_range : 'Produk Lokal'}
                                                </span>
                                            </div>
                                            
                                            <span className="text-xs font-semibold text-(--forest) group-hover:translate-x-1 transition-transform">
                                                Lihat Usaha &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-(--line) p-12 text-center" data-reveal>
                            <div className="w-16 h-16 bg-(--forest-mist)/50 rounded-full flex items-center justify-center mx-auto mb-4 text-(--forest)">
                                <Store className="w-8 h-8" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-(--forest-deep) mb-2">UMKM Tidak Ditemukan</h3>
                            <p className="text-(--charcoal-soft) max-w-md mx-auto">
                                Tidak ada UMKM atau usaha kuliner yang cocok dengan kata kunci atau filter yang dipilih. Coba sesuaikan filter Anda.
                            </p>
                            {(search || activeCategory) && (
                                <Button 
                                    variant="outline" 
                                    className="mt-6 border-(--line)"
                                    onClick={() => {
                                        setSearch('');
                                        setActiveCategory(null);
                                        updateFilters('', null);
                                    }}
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {umkms.last_page > 1 && (
                        <nav className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-(--line) pt-8" data-reveal aria-label="Navigasi halaman">
                            <p className="text-sm text-(--charcoal-soft)">
                                Menampilkan <span className="font-medium text-(--charcoal)">{umkms.from}</span> hingga <span className="font-medium text-(--charcoal)">{umkms.to}</span> dari <span className="font-medium text-(--charcoal)">{umkms.total}</span> UMKM
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!umkms.prev_page_url}
                                    className="border-(--line)"
                                    onClick={() => umkms.prev_page_url && router.get(umkms.prev_page_url)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!umkms.next_page_url}
                                    className="border-(--line)"
                                    onClick={() => umkms.next_page_url && router.get(umkms.next_page_url)}
                                >
                                    Selanjutnya
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </nav>
                    )}

                </div>
            </section>
        </PublicLayout>
    );
}
