import { Head } from '@inertiajs/react';
import { Handshake } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Partnership() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Kemitraan - Desa Wisata Serayu Larangan" />
            
            <section className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Handshake className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Kemitraan & Kolaborasi</h1>
                    <p className="text-lg text-white/70">
                        Bersinergi bersama Pokdarwis & Pemerintah Desa Serayu Larangan untuk memajukan pariwisata berkelanjutan.
                    </p>
                </div>
            </section>

            <section className="bg-(--cream-warm) py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <article className="prose prose-lg prose-slate mx-auto text-(--charcoal-soft) bg-white p-8 md:p-12 rounded-3xl border border-(--line) shadow-sm">
                        <p>
                            Kelompok Sadar Wisata (Pokdarwis) dan Pemerintah Desa Serayu Larangan sangat terbuka dengan berbagai bentuk kolaborasi. Kami mengundang institusi pendidikan, agen perjalanan, maupun pelaku industri kreatif untuk bersinergi.
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">Bentuk Kerja Sama:</h2>
                        <ul>
                            <li>Paket Kunjungan Edukasi & Live-in Desa Wisata</li>
                            <li>Pengembangan Produk UMKM Lokal (Gula Nira & Olahan Tradisional)</li>
                            <li>Kegiatan Pengabdian Masyarakat & Penelitian Mahasiswa</li>
                            <li>Liputan Media & Promosi Kebudayaan Banyumasan</li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-(--line) text-center">
                            <p className="font-semibold text-(--charcoal) mb-4">Ingin berkolaborasi dengan kami?</p>
                            <a 
                                href="https://wa.me/6281398480422" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-(--forest) hover:bg-(--forest-deep) text-white font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-md"
                            >
                                Hubungi Pengelola Desa Wisata
                            </a>
                        </div>
                    </article>
                </div>
            </section>
        </PublicLayout>
    );
}
