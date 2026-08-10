import { Head } from '@inertiajs/react';
import { Handshake } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Partnership() {
    useMotionReveal();

    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <PublicLayout>
            <Head>
                <title>Kemitraan & Kolaborasi — Desa Wisata Serayu Larangan</title>
                <meta
                    name="description"
                    content="Bersinergi bersama Pokdarwis & Pemerintah Desa Serayu Larangan untuk memajukan pariwisata berkelanjutan dan UMKM lokal."
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Kemitraan & Kolaborasi — Desa Wisata Serayu Larangan" />
                <meta property="og:description" content="Bersinergi bersama Pokdarwis & Pemerintah Desa Serayu Larangan untuk memajukan pariwisata berkelanjutan dan UMKM lokal." />
                <meta property="og:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Desa Wisata Serayu Larangan" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Kemitraan & Kolaborasi — Desa Wisata Serayu Larangan" />
                <meta name="twitter:description" content="Bersinergi bersama Pokdarwis & Pemerintah Desa Serayu Larangan untuk memajukan pariwisata berkelanjutan dan UMKM lokal." />
                <meta name="twitter:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
            </Head>
            
            <header className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Handshake className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Kemitraan & Kolaborasi</h1>
                    <p className="text-lg text-white/70">
                        Bersinergi bersama Pokdarwis & Pemerintah Desa Serayu Larangan untuk memajukan pariwisata berkelanjutan.
                    </p>
                </div>
            </header>

            <section className="bg-(--cream-warm) py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <article className="prose prose-lg prose-slate mx-auto text-(--charcoal-soft) bg-white p-8 md:p-12 rounded-3xl border border-(--line) shadow-sm">
                        <p>
                            Kelompok Sadar Wisata (Pokdarwis) dan Pemerintah Desa Serayu Larangan sangat terbuka dengan berbagai bentuk kolaborasi. Kami mengundang institusi pendidikan, agen perjalanan, maupun pelaku industri kreatif untuk bersinergi.
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">1. Bentuk Kerja Sama & Kolaborasi</h2>
                        <p>Bidang kemitraan yang dapat dikembangkan bersama Desa Wisata Serayu Larangan:</p>
                        <ol className="list-decimal pl-6">
                            <li>Paket Kunjungan Edukasi, Study Tour & Program Live-in Desa Wisata.</li>
                            <li>Pengembangan Produk UMKM Lokal (Gula Kelapa Organik, Gula Semut, & Kuliner Tradisional).</li>
                            <li>Kegiatan Pengabdian Masyarakat, KKN, & Penelitian Akademis Mahasiswa/Dosen.</li>
                            <li>Liputan Media, Content Creator Partnership, & Promosi Kebudayaan Banyumasan.</li>
                        </ol>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">2. Alur Pengajuan Kemitraan</h2>
                        <p>Tahapan mudah untuk memulai kolaborasi:</p>
                        <ol className="list-decimal pl-6">
                            <li>Hubungi pengelola Pokdarwis Desa Serayu Larangan melalui WhatsApp resmi.</li>
                            <li>Sampaikan proposal atau konsep awal kegiatan/kerja sama yang ingin dijalankan.</li>
                            <li>Diskusi jadwal, lokasi, serta pematangan teknis bersama tim pengelola desa.</li>
                            <li>Pelaksanaan kegiatan kolaborasi di kawasan Desa Wisata Serayu Larangan.</li>
                        </ol>

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
