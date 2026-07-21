import { Head, Link, router } from '@inertiajs/react';
import { Search, Image as ImageIcon, MapPin, Ticket, Map } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Destination } from '@/types/public';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { PaginatedData } from '@/types/models';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryOption {
    value: string;
    label: string;
}

interface Props {
    destinations: PaginatedData<Destination>;
    categories: CategoryOption[];
    filters: {
        search: string | null;
        category: string | null;
    };
}

export default function DestinationsIndex({ destinations, categories, filters }: Props) {
    useMotionReveal();
    const [search, setSearch] = useState(filters.search || '');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateFilters = useCallback((query: string, cat: string | null) => {
        const payload: Record<string, string> = {};
        if (query) payload.search = query;
        if (cat) payload.category = cat;

        router.get('/destinasi', payload, { preserveState: true, replace: true });
    }, []);

    const debouncedSearch = useCallback(
        (query: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                updateFilters(query, filters.category);
            }, 400);
        },
        [filters.category, updateFilters]
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
        updateFilters('', filters.category);
    };

    const handleCategoryClick = (val: string | null) => {
        updateFilters(search, val);
    };

    return (
        <PublicLayout>
            <Head>
                <title>Destinasi Wisata — Wisata Mrebet</title>
                <meta
                    name="description"
                    content="Jelajahi berbagai destinasi wisata alam, budaya, dan buatan yang menakjubkan di Kecamatan Mrebet."
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-40 pb-12 lg:pb-20 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    
                    {/* Header */}
                    <div className="mb-10 md:mb-12 max-w-3xl" data-reveal>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-(--forest-deep) mb-4">
                            Eksplorasi Destinasi
                        </h1>
                        <p className="text-base md:text-lg text-(--charcoal-soft) leading-relaxed">
                            Temukan surga tersembunyi, nikmati pesona alam, dan pelajari kekayaan budaya yang membentang di seluruh wilayah Mrebet.
                        </p>
                    </div>

                    {/* Filter / Search Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10" data-reveal data-reveal-delay="50">
                        {/* Category Chips */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => handleCategoryClick(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    !filters.category 
                                        ? 'bg-(--forest) text-white shadow-sm' 
                                        : 'bg-white border border-(--line) text-(--charcoal) hover:border-(--forest-mist) hover:bg-(--forest-mist)/30'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => handleCategoryClick(cat.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        filters.category === cat.value 
                                            ? 'bg-(--forest) text-white shadow-sm' 
                                            : 'bg-white border border-(--line) text-(--charcoal) hover:border-(--forest-mist) hover:bg-(--forest-mist)/30'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80 shrink-0">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <Search className="w-4 h-4 text-(--charcoal-soft)" />
                            </div>
                            <Input
                                type="text"
                                className="pl-10 h-11 rounded-full border-(--line) bg-white focus-visible:ring-(--forest) shadow-sm text-sm"
                                placeholder="Cari destinasi wisata..."
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

                    {/* Grid */}
                    {destinations.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-reveal data-reveal-delay="100">
                            {destinations.data.map((dest) => (
                                <Link 
                                    key={dest.id} 
                                    href={`/destinasi/${dest.slug}`} 
                                    className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                >
                                    {/* Cover */}
                                    <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-200">
                                        {dest.primary_media ? (
                                            <img 
                                                src={`/storage/${dest.primary_media.file_path}`} 
                                                alt={dest.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                <Map className="w-12 h-12" />
                                            </div>
                                        )}
                                        
                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur text-(--forest-deep) text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm border border-white/20">
                                                {dest.category_label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-5 md:p-6 flex flex-col grow">
                                        <h2 className="font-display text-xl font-bold text-(--forest-deep) group-hover:text-(--forest) transition-colors line-clamp-1 mb-2">
                                            {dest.name}
                                        </h2>
                                        
                                        <div className="flex items-center gap-1.5 text-sm text-(--charcoal-soft) mb-4">
                                            <MapPin className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{dest.village?.name || 'Mrebet'}</span>
                                        </div>
                                        
                                        <div className="mt-auto pt-4 border-t border-(--line) flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-(--charcoal)">
                                                <Ticket className="w-4 h-4 text-(--gold)" />
                                                <span>
                                                    {parseFloat(dest.ticket_price) > 0 
                                                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(dest.ticket_price)) 
                                                        : 'Gratis'}
                                                </span>
                                            </div>
                                            
                                            {dest.open_time && dest.close_time && (
                                                <div className="text-xs text-(--charcoal-soft) font-medium">
                                                    {dest.open_time.slice(0, 5)} - {dest.close_time.slice(0, 5)} WIB
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-(--line) p-12 text-center" data-reveal>
                            <div className="w-16 h-16 bg-(--forest-mist)/50 rounded-full flex items-center justify-center mx-auto mb-4 text-(--forest)">
                                <Map className="w-8 h-8" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-(--forest-deep) mb-2">Destinasi Tidak Ditemukan</h3>
                            <p className="text-(--charcoal-soft) max-w-md mx-auto">
                                Tidak ada destinasi wisata yang cocok dengan pencarian atau filter yang dipilih. Coba sesuaikan kata kunci atau kategori.
                            </p>
                            {(search || filters.category) && (
                                <Button 
                                    variant="outline" 
                                    className="mt-6 border-(--line)"
                                    onClick={() => updateFilters('', null)}
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {destinations.last_page > 1 && (
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-(--line) pt-8" data-reveal>
                            <p className="text-sm text-(--charcoal-soft)">
                                Menampilkan <span className="font-medium text-(--charcoal)">{destinations.from}</span> hingga <span className="font-medium text-(--charcoal)">{destinations.to}</span> dari <span className="font-medium text-(--charcoal)">{destinations.total}</span> destinasi
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!destinations.prev_page_url}
                                    className="border-(--line)"
                                    onClick={() => destinations.prev_page_url && router.get(destinations.prev_page_url)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!destinations.next_page_url}
                                    className="border-(--line)"
                                    onClick={() => destinations.next_page_url && router.get(destinations.next_page_url)}
                                >
                                    Selanjutnya
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </PublicLayout>
    );
}
