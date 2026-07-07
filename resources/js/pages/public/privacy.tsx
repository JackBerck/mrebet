import { Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function PrivacyPolicy() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Kebijakan Privasi - Wisata Mrebet" />
            
            <section className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <ShieldCheck className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Kebijakan Privasi</h1>
                    <p className="text-lg text-white/70">
                        Terakhir diperbarui: 15 Juli 2026
                    </p>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <article className="prose prose-lg prose-slate mx-auto text-(--charcoal-soft) marker:text-(--forest)">
                        <p>
                            Pemerintah Desa Wisata Mrebet ("kami", "milik kami", atau "kita") menghormati privasi Anda dan berkomitmen untuk melindunginya melalui kepatuhan kami terhadap kebijakan ini.
                        </p>
                        
                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">1. Pengumpulan Informasi</h2>
                        <p>
                            Kami mengumpulkan beberapa jenis informasi dari dan tentang pengguna situs web kami, termasuk informasi:
                        </p>
                        <ul>
                            <li>Yang dengannya Anda dapat diidentifikasi secara pribadi, seperti nama, alamat pos, alamat email, atau nomor telepon ("informasi pribadi");</li>
                            <li>Yang tentang Anda tetapi secara individu tidak mengidentifikasi Anda; dan/atau</li>
                            <li>Tentang koneksi internet Anda, peralatan yang Anda gunakan untuk mengakses Situs Web kami, dan detail penggunaan.</li>
                        </ul>

                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">2. Penggunaan Informasi</h2>
                        <p>
                            Kami menggunakan informasi yang kami kumpulkan tentang Anda atau yang Anda berikan kepada kami, termasuk informasi pribadi apa pun:
                        </p>
                        <ul>
                            <li>Untuk menyajikan Situs Web kami dan isinya kepada Anda.</li>
                            <li>Untuk memberi Anda informasi, produk, atau layanan yang Anda minta dari kami.</li>
                            <li>Untuk memenuhi tujuan lain di mana Anda menyediakannya.</li>
                        </ul>

                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">3. Keamanan Data</h2>
                        <p>
                            Kami telah menerapkan langkah-langkah yang dirancang untuk mengamankan informasi pribadi Anda dari kehilangan yang tidak disengaja dan dari akses, penggunaan, perubahan, dan pengungkapan yang tidak sah. Segala informasi yang Anda berikan kepada kami disimpan di server kami yang aman di belakang firewall.
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">4. Perubahan Kebijakan</h2>
                        <p>
                            Merupakan kebijakan kami untuk memposting segala perubahan yang kami buat pada kebijakan privasi kami di halaman ini. Jika kami melakukan perubahan materiil pada cara kami memperlakukan informasi pribadi pengguna kami, kami akan memberi tahu Anda melalui pemberitahuan di beranda Situs Web.
                        </p>
                    </article>
                </div>
            </section>
        </PublicLayout>
    );
}
