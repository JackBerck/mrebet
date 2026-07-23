import { Head, Link, router } from '@inertiajs/react';
import { Search, MapPin, Map, Calendar, ChevronLeft, ChevronRight, ArrowRight, Landmark } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Village } from '@/types/public';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { PaginatedData } from '@/types/models';

interface Props {
    villages: PaginatedData<Village>;
    filters: {
        search: string | null;
    };
}

export default function VillagesIndex({ villages, filters }: Props) {
    useMotionReveal();
    const [search, setSearch] = useState(filters.search || '');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateFilters = useCallback((query: string) => {
        const payload: Record<string, string> = {};
        if (query) payload.search = query;

        router.get('/desa', payload, { preserveState: true, replace: true });
    }, []);

    const debouncedSearch = useCallback(
        (query: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                updateFilters(query);
            }, 400);
        },
        [updateFilters]
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
        updateFilters('');
    };

    return (
        <PublicLayout>
            <Head>
                <title>Desa Wisata — Wisata Mrebet</title>
                <meta
                    name="description"
                    content="Jelajahi keunikan, kebudayaan, dan potensi pesona desa wisata yang tersebar di Kecamatan Mrebet."
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-40 pb-12 lg:pb-20 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    
                    {/* Header */}
                    <div className="mb-10 md:mb-12 max-w-3xl" data-reveal>
                        <span className="text-(--forest) font-bold text-xs uppercase tracking-widest bg-(--forest-mist)/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
                            Kecamatan Mrebet
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-(--forest-deep) mb-4">
                            Desa Wisata
                        </h1>
                        <p className="text-base md:text-lg text-(--charcoal-soft) leading-relaxed">
                            Nikmati kehangatan masyarakat lokal, tradisi budaya yang terjaga, serta panorama khas pedesaan di lereng Gunung Slamet.
                        </p>
                    </div>

                    {/* Search Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10" data-reveal data-reveal-delay="50">
                        <div className="text-sm font-semibold text-(--charcoal-soft)">
                            Menampilkan <span className="text-(--forest-deep) font-bold">{villages.total}</span> Desa Wisata
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80 shrink-0">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <Search className="w-4 h-4 text-(--charcoal-soft)" />
                            </div>
                            <Input
                                type="text"
                                className="pl-10 h-11 rounded-full border-(--line) bg-white focus-visible:ring-(--forest) shadow-sm text-sm"
                                placeholder="Cari nama desa..."
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
                    {villages.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-reveal data-reveal-delay="100">
                            {villages.data.map((village) => (
                                <Link 
                                    key={village.id} 
                                    href={`/desa/${village.slug}`} 
                                    className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                >
                                    {/* Cover */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                                        {village.primary_media ? (
                                            <img 
                                                src={`/storage/${village.primary_media.file_path}`} 
                                                alt={village.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                <Landmark className="w-12 h-12" />
                                            </div>
                                        )}
                                        
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                                        {/* Title on cover */}
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <span className="text-[11px] font-semibold tracking-wider uppercase text-(--gold-light) block mb-1">
                                                Desa Wisata
                                            </span>
                                            <h2 className="font-display text-2xl font-bold text-white group-hover:text-(--gold-light) transition-colors line-clamp-1">
                                                {village.name}
                                            </h2>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-5 md:p-6 flex flex-col grow">
                                        <p className="text-sm text-(--charcoal-soft) line-clamp-3 mb-6 leading-relaxed">
                                            {village.description 
                                                ? village.description.replace(/<[^>]*>?/gm, '').trim()
                                                : 'Menawarkan keindahan alam dan potensi wisata budaya pedesaan yang asri.'}
                                        </p>
                                        
                                        {/* Footer Stats */}
                                        <div className="mt-auto pt-4 border-t border-(--line) flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs font-semibold text-(--charcoal-soft)">
                                                <div className="flex items-center gap-1.5 bg-(--cream-warm) px-2.5 py-1 rounded-md">
                                                    <Map className="w-3.5 h-3.5 text-(--forest)" />
                                                    <span>{village.destinations_count || 0} Wisata</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-(--cream-warm) px-2.5 py-1 rounded-md">
                                                    <Calendar className="w-3.5 h-3.5 text-(--gold)" />
                                                    <span>{village.events_count || 0} Event</span>
                                                </div>
                                            </div>

                                            <span className="inline-flex items-center text-xs font-bold text-(--forest) group-hover:translate-x-1 transition-transform">
                                                Jelajahi <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-(--line) p-12 text-center" data-reveal>
                            <div className="w-16 h-16 bg-(--forest-mist)/50 rounded-full flex items-center justify-center mx-auto mb-4 text-(--forest)">
                                <Landmark className="w-8 h-8" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-(--forest-deep) mb-2">Desa Tidak Ditemukan</h3>
                            <p className="text-(--charcoal-soft) max-w-md mx-auto">
                                Tidak ada desa wisata yang cocok dengan kata kunci pencarian Anda.
                            </p>
                            {search && (
                                <Button 
                                    variant="outline" 
                                    className="mt-6 border-(--line)"
                                    onClick={handleClearSearch}
                                >
                                    Reset Pencarian
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {villages.last_page > 1 && (
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-(--line) pt-8" data-reveal>
                            <p className="text-sm text-(--charcoal-soft)">
                                Menampilkan <span className="font-medium text-(--charcoal)">{villages.from}</span> hingga <span className="font-medium text-(--charcoal)">{villages.to}</span> dari <span className="font-medium text-(--charcoal)">{villages.total}</span> desa
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!villages.prev_page_url}
                                    className="border-(--line)"
                                    onClick={() => villages.prev_page_url && router.get(villages.prev_page_url)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!villages.next_page_url}
                                    className="border-(--line)"
                                    onClick={() => villages.next_page_url && router.get(villages.next_page_url)}
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
