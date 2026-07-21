import { Head, Link, router } from '@inertiajs/react';
import { Search, Image as ImageIcon, MapPin, Calendar, User, Eye, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Blog } from '@/types/public';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { PaginatedData } from '@/types/models';

interface Props {
    blogs: PaginatedData<Blog>;
    filters: {
        search: string | null;
    };
}

export default function BlogsIndex({ blogs, filters }: Props) {
    useMotionReveal();
    const [search, setSearch] = useState(filters.search || '');

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedSearch = useCallback(
        (query: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                router.get(
                    '/berita',
                    { search: query },
                    { preserveState: true, replace: true }
                );
            }, 400);
        },
        []
    );

    useEffect(() => {
        // Prevent initial load debounce trigger if it matches initial filters
        if (search !== (filters.search || '')) {
            debouncedSearch(search);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [search, debouncedSearch, filters.search]);

    const handleClearSearch = () => {
        setSearch('');
        debouncedSearch('');
    };

    return (
        <PublicLayout>
            <Head>
                <title>Blog & Berita — Wisata Mrebet</title>
                <meta
                    name="description"
                    content="Kumpulan artikel, kabar desa, cerita perjalanan, dan berita terbaru dari seluruh desa wisata di Kecamatan Mrebet."
                />
            </Head>

            <section className="pt-28 md:pt-32 lg:pt-40 pb-12 lg:pb-20 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    
                    {/* Header */}
                    <div className="mb-10 md:mb-12 max-w-3xl" data-reveal>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-(--forest-deep) mb-4">
                            Blog & Berita
                        </h1>
                        <p className="text-base md:text-lg text-(--charcoal-soft) leading-relaxed">
                            Kumpulan cerita inspiratif, kabar terbaru dari desa, informasi wisata, dan liputan kegiatan menarik dari seluruh pelosok Mrebet.
                        </p>
                    </div>

                    {/* Filter / Search */}
                    <div className="mb-10" data-reveal data-reveal-delay="50">
                        <div className="relative max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <Search className="w-5 h-5 text-(--charcoal-soft)" />
                            </div>
                            <Input
                                type="text"
                                className="pl-11 h-12 rounded-full border-(--line) bg-white focus-visible:ring-(--forest) shadow-sm"
                                placeholder="Cari artikel, berita, atau cerita..."
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

                    {/* Blog Grid */}
                    {blogs.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-reveal data-reveal-delay="100">
                            {blogs.data.map((blog) => (
                                <Link 
                                    key={blog.id} 
                                    href={`/berita/${blog.slug}`} 
                                    className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                >
                                    {/* Cover */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                                        {blog.cover_image ? (
                                            <img 
                                                src={`/storage/${blog.cover_image}`} 
                                                alt={blog.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                <ImageIcon className="w-10 h-10" />
                                            </div>
                                        )}
                                        {blog.village && (
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-(--forest-deep) text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                                <MapPin className="w-3.5 h-3.5 text-(--forest)" />
                                                Desa {blog.village.name}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-5 md:p-6 flex flex-col grow">
                                        <div className="flex items-center gap-4 text-xs text-(--charcoal-soft) mb-3">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{format(parseISO(blog.published_at), 'd MMM yyyy', { locale: id })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                <span className="truncate max-w-25">{blog.author?.name || 'Admin'}</span>
                                            </div>
                                        </div>
                                        
                                        <h2 className="font-display text-xl font-bold text-(--forest-deep) group-hover:text-(--forest) transition-colors line-clamp-2 mb-3">
                                            {blog.title}
                                        </h2>
                                        
                                        <div className="mt-auto pt-4 border-t border-(--line) flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-(--charcoal-soft)">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{blog.views_count} dibaca</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-(--forest) group-hover:translate-x-1 transition-transform">
                                                Baca Selengkapnya
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-(--line) p-12 text-center" data-reveal>
                            <div className="w-16 h-16 bg-(--forest-mist)/50 rounded-full flex items-center justify-center mx-auto mb-4 text-(--forest)">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-(--forest-deep) mb-2">Belum Ada Berita</h3>
                            <p className="text-(--charcoal-soft) max-w-md mx-auto">
                                {search 
                                    ? `Tidak ditemukan artikel dengan kata kunci "${search}". Coba kata kunci lain.` 
                                    : "Belum ada publikasi artikel atau berita untuk saat ini. Silakan kembali lagi nanti."}
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

                    {/* Pagination (if pages > 1) */}
                    {blogs.last_page > 1 && (
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-(--line) pt-8" data-reveal>
                            <p className="text-sm text-(--charcoal-soft)">
                                Menampilkan <span className="font-medium text-(--charcoal)">{blogs.from}</span> hingga <span className="font-medium text-(--charcoal)">{blogs.to}</span> dari <span className="font-medium text-(--charcoal)">{blogs.total}</span> artikel
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!blogs.prev_page_url}
                                    className="border-(--line)"
                                    onClick={() => blogs.prev_page_url && router.get(blogs.prev_page_url)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!blogs.next_page_url}
                                    className="border-(--line)"
                                    onClick={() => blogs.next_page_url && router.get(blogs.next_page_url)}
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
