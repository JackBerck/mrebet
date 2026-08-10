import { Head } from '@inertiajs/react';
import clsx from 'clsx';
import { MessageCircleQuestion, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { faqs } from '@/data/faq';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function FAQ() {
    useMotionReveal();
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleAccordion = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <PublicLayout>
            <Head>
                <title>Pertanyaan Umum (FAQ) — Desa Wisata Serayu Larangan</title>
                <meta
                    name="description"
                    content="Temukan jawaban untuk pertanyaan yang sering ditanyakan seputar wisata, lokasi, dan fasilitas di Desa Wisata Serayu Larangan."
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Pertanyaan Umum (FAQ) — Desa Wisata Serayu Larangan" />
                <meta property="og:description" content="Temukan jawaban untuk pertanyaan yang sering ditanyakan seputar wisata, lokasi, dan fasilitas di Desa Wisata Serayu Larangan." />
                <meta property="og:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Desa Wisata Serayu Larangan" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Pertanyaan Umum (FAQ) — Desa Wisata Serayu Larangan" />
                <meta name="twitter:description" content="Temukan jawaban untuk pertanyaan yang sering ditanyakan seputar wisata, lokasi, dan fasilitas di Desa Wisata Serayu Larangan." />
                <meta name="twitter:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
            </Head>
            
            {/* Hero Section */}
            <header className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <MessageCircleQuestion className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Pertanyaan Umum</h1>
                    <p className="text-lg text-white/70">
                        Temukan jawaban untuk pertanyaan yang sering ditanyakan seputar Desa Wisata Serayu Larangan.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <section className="bg-(--cream-warm) py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x">
                    {faqs.map((category, catIdx) => (
                        <div key={catIdx} className="mb-6 md:mb-10" data-reveal>
                            <h2 className="mb-2 md:mb-4 font-display text-2xl font-bold text-(--forest-deep)">
                                {category.title}
                            </h2>
                            <div className="flex flex-col gap-2 md:gap-4">
                                {category.items.map((item, itemIdx) => {
                                    const id = `${catIdx}-${itemIdx}`;
                                    const isOpen = openIndex === id;
                                    
                                    return (
                                        <div 
                                            key={id} 
                                            className={clsx(
                                                "overflow-hidden rounded-xl md:rounded-2xl border transition-all duration-300",
                                                isOpen ? "border-(--forest-mist) bg-white shadow-sm" : "border-(--line) bg-white hover:border-(--forest-mist)"
                                            )}
                                        >
                                            <button
                                                onClick={() => toggleAccordion(id)}
                                                className="flex w-full items-center justify-between p-3 md:p-4 text-left font-semibold text-(--charcoal) focus:outline-none text-sm md:text-base"
                                            >
                                                <span>{item.question}</span>
                                                <ChevronDown 
                                                    className={clsx(
                                                        "h-5 w-5 shrink-0 text-(--forest) transition-transform duration-300",
                                                        isOpen && "rotate-180 text-(--gold)"
                                                    )} 
                                                />
                                            </button>
                                            <div 
                                                className={clsx(
                                                    "grid transition-all duration-300 ease-in-out",
                                                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                )}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="p-3 md:p-5 pt-0 text-(--charcoal-soft) leading-relaxed text-sm md:text-base">
                                                        {item.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
