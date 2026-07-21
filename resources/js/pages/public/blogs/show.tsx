import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Eye, MapPin, Share2, Facebook, Twitter, Link as LinkIcon, BookOpen, ArrowRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import type { Blog } from '@/types/public';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface Props {
    blog: Blog;
    relatedBlogs: Blog[];
}

export default function BlogShow({ blog, relatedBlogs }: Props) {
    useMotionReveal();

    const formattedDate = format(parseISO(blog.published_at), 'd MMMM yyyy', { locale: localeId });
    
    // Calculate reading time
    const calculateReadingTime = (htmlContent: string) => {
        const text = htmlContent.replace(/<[^>]*>?/gm, '').trim();
        const words = text.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200)); // 200 WPM
    };
    
    const readingTime = blog.content ? calculateReadingTime(blog.content) : 1;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${blog.title} - Wisata Mrebet`,
                    text: 'Baca artikel ini di Wisata Mrebet!',
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

    // JSON-LD for SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": blog.title,
        "image": [
            blog.cover_image ? `${window.location.origin}/storage/${blog.cover_image}` : `${window.location.origin}/default-og.jpg`
        ],
        "datePublished": blog.published_at,
        "author": [{
            "@type": "Person",
            "name": blog.author?.name || 'Admin',
        }]
    };

    // Extract excerpt for meta description (strip HTML and get first 150 chars)
    const excerpt = blog.content 
        ? blog.content.replace(/<[^>]*>?/gm, '').trim().substring(0, 150) + '...'
        : 'Baca berita dan artikel terbaru dari Wisata Mrebet.';

    return (
        <PublicLayout>
            <Head>
                <title>{`${blog.title} | Mrebet Wisata`}</title>
                <meta name="description" content={excerpt} />
                <link rel="canonical" href={shareUrl} />
                
                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={excerpt} />
                <meta 
                    property="og:image" 
                    content={blog.cover_image ? `/storage/${blog.cover_image}` : '/default-og.jpg'} 
                />
                <meta property="og:url" content={shareUrl} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog.title} />
                <meta name="twitter:description" content={excerpt} />
                <meta 
                    name="twitter:image" 
                    content={blog.cover_image ? `/storage/${blog.cover_image}` : '/default-og.jpg'} 
                />
                
                {/* JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            {/* Top spacing for fixed navbar */}
            <div className="pt-16 md:pt-20 lg:pt-24 bg-(--cream-warm)"></div>

            {/* Back Navigation */}
            <div className="bg-(--cream-warm) border-b border-(--line) py-4 sticky top-16 md:top-20 lg:top-24 z-30">
                <div className="container mx-auto max-w-7xl section-padding-x flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--charcoal-soft) hover:text-(--forest) transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Blog & Berita
                    </Link>
                    
                    <div className="flex items-center gap-2 text-sm text-(--charcoal-soft)">
                        <Link href="/" className="hover:text-(--forest)">Beranda</Link>
                        <span>/</span>
                        <Link href="/berita" className="hover:text-(--forest)">Blog</Link>
                        <span>/</span>
                        <span className="truncate max-w-37.5 md:max-w-75 text-(--charcoal) font-medium">{blog.title}</span>
                    </div>
                </div>
            </div>

            <article className="py-8 lg:py-12 bg-(--cream-warm) min-h-screen">
                <div className="container mx-auto max-w-7xl section-padding-x">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Main Content */}
                        <div className="lg:col-span-8 lg:col-start-3" data-reveal>
                            {/* Header */}
                            <header className="mb-8 text-center">
                                {blog.village && (
                                    <Link href={`/desa/${blog.village.slug}`} className="inline-flex items-center justify-center gap-1.5 text-(--forest) font-medium bg-(--forest-mist)/50 px-3 py-1.5 rounded-full text-xs mb-4 hover:bg-(--forest-mist) transition-colors">
                                        <MapPin className="w-3.5 h-3.5" />
                                        Desa {blog.village.name}
                                    </Link>
                                )}
                                
                                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-(--forest-deep) leading-tight mb-6 text-balance">
                                    {blog.title}
                                </h1>
                                
                                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-(--charcoal-soft)">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        <span>{blog.author?.name || 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={blog.published_at}>{formattedDate}</time>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{readingTime} min baca</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{blog.views_count} dibaca</span>
                                    </div>
                                </div>
                            </header>

                            {/* Cover Image */}
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-200 border border-(--line) mb-10 shadow-sm">
                                {blog.cover_image ? (
                                    <img 
                                        src={`/storage/${blog.cover_image}`} 
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                        <span className="text-xl font-display font-medium">Wisata Mrebet</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="bg-white rounded-2xl p-6 md:p-10 lg:p-12 border border-(--line) shadow-sm relative">
                                {blog.content ? (
                                    <div 
                                        className="prose prose-neutral md:prose-lg max-w-none prose-headings:font-display prose-headings:text-(--forest-deep) prose-a:text-(--forest) hover:prose-a:text-(--forest-deep) prose-img:rounded-xl prose-img:border prose-img:border-(--line)"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                ) : (
                                    <p className="text-(--charcoal-soft) italic text-center py-10">
                                        Konten artikel ini belum tersedia.
                                    </p>
                                )}
                                
                                {/* Share Banner at Bottom of Content */}
                                <div className="mt-12 pt-8 border-t border-(--line) flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="font-semibold text-(--charcoal)">Bagikan artikel ini:</p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="rounded-full border-(--line) hover:text-(--forest) hover:border-(--forest)" onClick={handleShare}>
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="rounded-full border-(--line) hover:text-[#1877F2] hover:border-[#1877F2]">
                                                <Facebook className="w-4 h-4" />
                                            </Button>
                                        </a>
                                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="rounded-full border-(--line) hover:text-[#1DA1F2] hover:border-[#1DA1F2]">
                                                <Twitter className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Blogs */}
                    {relatedBlogs && relatedBlogs.length > 0 && (
                        <div className="mt-20 pt-16 border-t border-(--line)" data-reveal>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                <h2 className="font-display text-2xl font-bold text-(--forest-deep)">
                                    Artikel Terkait
                                </h2>
                                <Link href="/berita" className="text-sm font-semibold text-(--forest) hover:text-(--forest-deep) transition-colors flex items-center gap-1">
                                    Lihat Semua
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedBlogs.map(related => (
                                    <Link 
                                        key={related.id} 
                                        href={`/berita/${related.slug}`} 
                                        className="group bg-white rounded-2xl overflow-hidden border border-(--line) shadow-sm hover:shadow-md hover:border-(--forest-mist) transition-all flex flex-col h-full"
                                    >
                                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                                            {related.cover_image ? (
                                                <img 
                                                    src={`/storage/${related.cover_image}`} 
                                                    alt={related.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40">
                                                    <span className="font-display font-medium">Wisata Mrebet</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col grow">
                                            <div className="flex items-center gap-4 text-[11px] text-(--charcoal-soft) mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{format(parseISO(related.published_at), 'd MMM yyyy', { locale: localeId })}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-(--charcoal) group-hover:text-(--forest) transition-colors line-clamp-2">{related.title}</h3>
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
