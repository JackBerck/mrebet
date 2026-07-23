import { Head, Link } from '@inertiajs/react';
import { Search, MapPin, Map as MapIcon, Compass, X, Landmark } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import { useState, useMemo, Suspense, lazy } from 'react';
import type { MapPoint } from '@/components/public/interactive-map';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const InteractiveMap = lazy(() => import('@/components/public/interactive-map'));

interface CategoryOption {
    value: string;
    label: string;
}

interface Props {
    destinations: MapPoint[];
    villages: MapPoint[];
    categories: CategoryOption[];
}

export default function MapIndex({ destinations, villages, categories }: Props) {
    useMotionReveal();

    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'destination' | 'village'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
    const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

    // Combine all points
    const allPoints = useMemo(() => {
        return [...destinations, ...villages];
    }, [destinations, villages]);

    // Filtered points
    const filteredPoints = useMemo(() => {
        return allPoints.filter((point) => {
            // Type filter
            if (selectedType === 'destination' && point.type !== 'destination') return false;
            if (selectedType === 'village' && point.type !== 'village') return false;

            // Category filter (only applies to destinations)
            if (selectedCategory && point.type === 'destination' && point.category !== selectedCategory) {
                return false;
            }

            // Search filter
            if (search.trim() !== '') {
                const query = search.toLowerCase();
                const matchName = point.name.toLowerCase().includes(query);
                const matchVillage = point.village_name ? point.village_name.toLowerCase().includes(query) : false;
                if (!matchName && !matchVillage) return false;
            }

            return true;
        });
    }, [allPoints, selectedType, selectedCategory, search]);

    const handleSelectPoint = (point: MapPoint | null) => {
        setSelectedPoint(point);
        // Switch to map view on mobile when an item is tapped from the list
        if (window.innerWidth < 1024) {
            setMobileView('map');
        }
    };

    return (
        <PublicLayout>
            <Head>
                <title>Peta Wisata Interaktif — Wisata Mrebet</title>
                <meta
                    name="description"
                    content="Jelajahi peta interaktif sebaran lokasi destinasi wisata dan desa wisata di Kecamatan Mrebet."
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-36 pb-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    
                    {/* Header */}
                    <div className="mb-8" data-reveal>
                        <span className="text-(--forest) font-bold text-xs uppercase tracking-widest bg-(--forest-mist)/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
                            GIS Interaktif
                        </span>
                        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-(--forest-deep) mb-3">
                            Peta Wisata Mrebet
                        </h1>
                        <p className="text-sm md:text-base text-(--charcoal-soft) max-w-2xl">
                            Temukan sebaran letak destinasi wisata dan desa wisata secara spasial di wilayah Kecamatan Mrebet.
                        </p>
                    </div>

                    {/* Filter & Controls Bar */}
                    <div className="bg-white rounded-2xl p-4 md:p-5 border border-(--line) shadow-sm mb-6 space-y-4" data-reveal data-reveal-delay="50">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            {/* Type Chips */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => { setSelectedType('all'); setSelectedCategory(null); }}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                        selectedType === 'all' 
                                            ? 'bg-(--forest) text-white shadow-sm' 
                                            : 'bg-(--cream-warm) text-(--charcoal) hover:bg-(--forest-mist)/50'
                                    }`}
                                >
                                    Semua ({allPoints.length})
                                </button>
                                <button
                                    onClick={() => setSelectedType('destination')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                        selectedType === 'destination' 
                                            ? 'bg-(--forest) text-white shadow-sm' 
                                            : 'bg-(--cream-warm) text-(--charcoal) hover:bg-(--forest-mist)/50'
                                    }`}
                                >
                                    Destinasi Wisata ({destinations.length})
                                </button>
                                <button
                                    onClick={() => { setSelectedType('village'); setSelectedCategory(null); }}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                        selectedType === 'village' 
                                            ? 'bg-(--forest) text-white shadow-sm' 
                                            : 'bg-(--cream-warm) text-(--charcoal) hover:bg-(--forest-mist)/50'
                                    }`}
                                >
                                    Desa Wisata ({villages.length})
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full lg:w-72">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4 text-(--charcoal-soft)" />
                                </div>
                                <Input
                                    type="text"
                                    className="pl-9 h-10 rounded-full border-(--line) bg-(--cream-warm) text-xs"
                                    placeholder="Cari lokasi atau desa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button 
                                        onClick={() => setSearch('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* Category Sub-Filters (When All or Destination is selected) */}
                        {selectedType !== 'village' && (
                            <div className="pt-3 border-t border-(--line)">
                                
                                {/* Mobile View: Shadcn Select Dropdown */}
                                <div className="md:hidden flex items-center gap-2">
                                    <span className="text-xs text-(--charcoal-soft) font-medium shrink-0">Kategori:</span>
                                    <Select 
                                        value={selectedCategory || 'all'} 
                                        onValueChange={(val) => setSelectedCategory(val === 'all' ? null : val)}
                                    >
                                        <SelectTrigger className="w-full bg-(--cream-warm) border-(--line) text-xs h-9 rounded-xl">
                                            <SelectValue placeholder="Pilih Kategori" />
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
                                <div className="hidden md:flex items-center gap-2 text-xs">
                                    <span className="text-(--charcoal-soft) font-medium mr-1 shrink-0">Kategori:</span>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                                            !selectedCategory ? 'bg-(--forest-mist) text-(--forest) font-bold' : 'text-(--charcoal-soft) hover:text-(--forest) hover:bg-(--cream-warm)'
                                        }`}
                                    >
                                        Semua Kategori
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => setSelectedCategory(cat.value)}
                                            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                                                selectedCategory === cat.value ? 'bg-(--forest-mist) text-(--forest) font-bold' : 'text-(--charcoal-soft) hover:text-(--forest) hover:bg-(--cream-warm)'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Mobile Switch View Button */}
                    <div className="flex lg:hidden justify-center mb-4">
                        <div className="bg-white border border-(--line) rounded-full p-1 shadow-sm flex items-center text-xs font-semibold">
                            <button
                                onClick={() => setMobileView('map')}
                                className={`px-4 py-1.5 rounded-full transition-all ${
                                    mobileView === 'map' ? 'bg-(--forest) text-white' : 'text-(--charcoal-soft)'
                                }`}
                            >
                                <MapIcon className="w-3.5 h-3.5 inline mr-1" />
                                Tampilkan Peta
                            </button>
                            <button
                                onClick={() => setMobileView('list')}
                                className={`px-4 py-1.5 rounded-full transition-all ${
                                    mobileView === 'list' ? 'bg-(--forest) text-white' : 'text-(--charcoal-soft)'
                                }`}
                            >
                                <Compass className="w-3.5 h-3.5 inline mr-1" />
                                Tampilkan Daftar ({filteredPoints.length})
                            </button>
                        </div>
                    </div>

                    {/* Main Dual-Pane Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" data-reveal data-reveal-delay="100">
                        
                        {/* Sidebar List (Left - 4 cols on desktop) */}
                        <div className={`lg:col-span-4 space-y-3 ${mobileView === 'map' ? 'hidden lg:block' : 'block'}`}>
                            <div className="bg-white rounded-2xl p-4 border border-(--line) shadow-sm flex items-center justify-between">
                                <span className="font-display font-bold text-sm text-(--forest-deep)">
                                    Lokasi Ditemukan
                                </span>
                                <span className="text-xs font-bold bg-(--forest-mist) text-(--forest) px-2.5 py-0.5 rounded-full">
                                    {filteredPoints.length} Titik
                                </span>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1">
                                {filteredPoints.length > 0 ? (
                                    filteredPoints.map((point) => {
                                        const isSelected = selectedPoint?.id === point.id && selectedPoint?.type === point.type;

                                        return (
                                            <div
                                                key={`${point.type}-${point.id}`}
                                                onClick={() => handleSelectPoint(point)}
                                                className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer flex gap-3.5 ${
                                                    isSelected 
                                                        ? 'border-(--forest) ring-2 ring-(--forest-mist) bg-(--cream-warm)/50 shadow-md' 
                                                        : 'border-(--line) hover:border-(--forest-mist) hover:shadow-sm'
                                                }`}
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100 relative">
                                                    {point.primary_media ? (
                                                        <img 
                                                            src={`/storage/${point.primary_media.file_path}`} 
                                                            alt={point.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                            {point.type === 'destination' ? <MapIcon className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex flex-col justify-between grow min-w-0">
                                                    <div>
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            {point.type === 'destination' ? (
                                                                <span className="bg-gray-100 text-gray-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                                                    {point.category_label || 'Wisata'}
                                                                </span>
                                                            ) : (
                                                                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                                                    Desa Wisata
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="font-bold text-sm text-(--charcoal) line-clamp-1">
                                                            {point.name}
                                                        </h3>
                                                        <p className="text-xs text-(--charcoal-soft) flex items-center gap-1 mt-0.5">
                                                            <MapPin className="w-3 h-3 text-(--forest) shrink-0" />
                                                            <span className="truncate">{point.village_name || 'Kecamatan Mrebet'}</span>
                                                        </p>
                                                    </div>

                                                    <div className="mt-2 flex items-center justify-between text-xs font-semibold border-t border-gray-100 pt-1.5">
                                                        <span className="text-(--gold-deep)">
                                                            {point.type === 'destination' 
                                                                ? (point.ticket_price && point.ticket_price > 0 ? `Rp ${point.ticket_price.toLocaleString('id-ID')}` : 'Gratis')
                                                                : `${point.destinations_count || 0} Destinasi`}
                                                        </span>
                                                        
                                                        <Link 
                                                            href={point.type === 'destination' ? `/destinasi/${point.slug}` : `/desa/${point.slug}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-(--forest) hover:underline text-[11px] font-bold"
                                                        >
                                                            Detail &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="bg-white rounded-xl p-8 border border-(--line) text-center text-xs text-(--charcoal-soft)">
                                        Tidak ada titik lokasi yang sesuai dengan filter.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Map (Right - 8 cols on desktop) */}
                        <div className={`lg:col-span-8 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
                            <Suspense fallback={
                                <div className="w-full h-[500px] lg:h-[620px] rounded-2xl bg-neutral-100 border border-(--line) flex items-center justify-center animate-pulse">
                                    <div className="text-center text-(--charcoal-soft)">
                                        <MapIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                                        <p className="text-xs font-medium">Memuat Peta Wisata...</p>
                                    </div>
                                </div>
                            }>
                                <InteractiveMap
                                    items={filteredPoints}
                                    selectedItem={selectedPoint}
                                    onSelectItem={handleSelectPoint}
                                />
                            </Suspense>
                        </div>

                    </div>

                </div>
            </section>
        </PublicLayout>
    );
}
