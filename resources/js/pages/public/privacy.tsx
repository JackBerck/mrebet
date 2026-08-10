import { Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Privacy() {
    useMotionReveal();

    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <PublicLayout>
            <Head>
                <title>Kebijakan Privasi — Desa Wisata Serayu Larangan</title>
                <meta
                    name="description"
                    content="Komitmen perlindungan data dan kebijakan privasi pengunjung situs resmi Desa Wisata Serayu Larangan."
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Kebijakan Privasi — Desa Wisata Serayu Larangan" />
                <meta property="og:description" content="Komitmen perlindungan data dan kebijakan privasi pengunjung situs resmi Desa Wisata Serayu Larangan." />
                <meta property="og:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Desa Wisata Serayu Larangan" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Kebijakan Privasi — Desa Wisata Serayu Larangan" />
                <meta name="twitter:description" content="Komitmen perlindungan data dan kebijakan privasi pengunjung situs resmi Desa Wisata Serayu Larangan." />
                <meta name="twitter:image" content="/images/backgrounds/pemandangan-serayu-larangan.webp" />
            </Head>
            
            <header className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <ShieldCheck className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Kebijakan Privasi</h1>
                    <p className="text-lg text-white/70">
                        Komitmen kami untuk melindungi data dan privasi pengunjung.
                    </p>
                </div>
            </header>

            <section className="bg-(--cream-warm) py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <article className="prose prose-lg prose-slate mx-auto text-(--charcoal-soft) marker:text-(--forest) bg-white p-8 md:p-12 rounded-3xl border border-(--line) shadow-sm">
                        <p>
                            Pengelola Desa Wisata Serayu Larangan ("kami") menghormati privasi Anda dan berkomitmen penuh untuk melindunginya melalui kepatuhan kami terhadap kebijakan privasi ini.
                        </p>
                        
                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">1. Informasi yang Kami Kumpulkan</h2>
                        <p>Kami dapat mengumpulkan informasi kontak pribadi ketika Anda mendaftar, memesan reservasi paket wisata, atau mengisi formulir pertanyaan di website kami, meliputi:</p>
                        <ol className="list-decimal pl-6">
                            <li>Nama lengkap & nomor telepon / WhatsApp</li>
                            <li>Alamat e-mail aktif</li>
                            <li>Detail pemesanan dan pertanyaan seputar layanan desa wisata</li>
                        </ol>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">2. Penggunaan Informasi</h2>
                        <p>Informasi yang kami kumpulkan hanya digunakan untuk kepentingan:</p>
                        <ol className="list-decimal pl-6">
                            <li>Memproses reservasi kunjungan & layanan informasi desa</li>
                            <li>Menghubungi Anda terkait konfirmasi acara atau jadwal kunjungan</li>
                            <li>Meningkatkan kualitas pelayanan dan fasilitas di Desa Wisata Serayu Larangan</li>
                        </ol>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">3. Keamanan Data</h2>
                        <p>Prinsip dan jaminan perlindungan data pengunjung:</p>
                        <ol className="list-decimal pl-6">
                            <li>Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk perlindungan data Anda.</li>
                            <li>Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan.</li>
                        </ol>
                    </article>
                </div>
            </section>
        </PublicLayout>
    );
}
