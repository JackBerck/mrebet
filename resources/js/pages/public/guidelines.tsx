import { Head } from '@inertiajs/react';
import { Compass, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Guidelines() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Panduan Wisatawan - Desa Wisata Serayu Larangan" />
            
            <header className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Compass className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Panduan Wisatawan</h1>
                    <p className="text-lg text-white/70">
                        Tips dan panduan agar liburan Anda di Desa Wisata Serayu Larangan aman, nyaman, dan berkesan.
                    </p>
                </div>
            </header>

            <section className="bg-(--cream-warm) py-12 lg:py-16">
                <div className="container mx-auto max-w-4xl section-padding-x space-y-8" data-reveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <article className="bg-white p-6 rounded-2xl border border-(--line) shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-(--forest-mist) text-(--forest) flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h2 className="font-bold text-lg text-(--charcoal) mb-2">Pakaian Nyaman</h2>
                            <p className="text-xs text-(--charcoal-soft) leading-relaxed">
                                Gunakan pakaian santai yang menyerap keringat dan alas kaki yang nyaman untuk berjalan di area persawahan dan jalur desa.
                            </p>
                        </article>

                        <article className="bg-white p-6 rounded-2xl border border-(--line) shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <h2 className="font-bold text-lg text-(--charcoal) mb-2">Sopan & Ramah</h2>
                            <p className="text-xs text-(--charcoal-soft) leading-relaxed">
                                Senyum dan sapaan hangat sangat diapresiasi oleh warga lokal Desa Serayu Larangan. Utamakan kesopanan saat berinteraksi.
                            </p>
                        </article>

                        <article className="bg-white p-6 rounded-2xl border border-(--line) shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="font-bold text-lg text-(--charcoal) mb-2">Jaga Kelestarian</h2>
                            <p className="text-xs text-(--charcoal-soft) leading-relaxed">
                                Bantu kami menjaga kebersihan dan kelestarian alam lereng Gunung Slamet dengan tidak membuang sampah sembarangan.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
