import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Terms() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Syarat & Ketentuan - Wisata Mrebet" />
            
            <section className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <FileText className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Syarat & Ketentuan</h1>
                    <p className="text-lg text-white/70">
                        Persetujuan penggunaan fasilitas dan layanan Wisata Mrebet.
                    </p>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <article className="prose prose-lg prose-slate mx-auto text-(--charcoal-soft) marker:text-(--forest)">
                        <p>
                            Selamat datang di Desa Wisata Mrebet. Dengan mengakses situs web ini dan berkunjung ke area wisata kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut.
                        </p>
                        
                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">1. Aturan Kawasan Wisata</h2>
                        <p>Seluruh pengunjung wajib mematuhi aturan berikut selama berada di kawasan wisata Mrebet:</p>
                        <ul>
                            <li>Dilarang membuang sampah sembarangan. Gunakan tempat sampah yang telah disediakan.</li>
                            <li>Dilarang melakukan tindakan asusila, mabuk-mabukan, atau mengonsumsi obat-obatan terlarang.</li>
                            <li>Dilarang merusak flora dan fauna setempat.</li>
                            <li>Patuhi batas aman berenang di area air terjun/curug.</li>
                        </ul>

                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">2. Tiket & Pembatalan</h2>
                        <p>
                            Pembelian tiket dapat dilakukan di lokasi atau melalui reservasi rombongan. Untuk pembatalan reservasi rombongan yang sudah dibayar, pengembalian dana (*refund*) tunduk pada kebijakan masing-masing pengelola destinasi dan harus diurus maksimal H-3 sebelum tanggal kedatangan.
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">3. Tanggung Jawab Barang Bawaan</h2>
                        <p>
                            Pengunjung bertanggung jawab penuh atas barang bawaan pribadi. Pengelola wisata Mrebet tidak bertanggung jawab atas kehilangan, kerusakan, atau pencurian barang di area wisata, tempat parkir, maupun penginapan.
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-2 md:mt-4 mb-1 md:mb-2">4. Perubahan Syarat & Ketentuan</h2>
                        <p>
                            Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di halaman ini. Kunjungan Anda yang berkelanjutan ke area wisata setelah adanya perubahan berarti Anda menyetujui syarat yang baru.
                        </p>
                    </article>
                </div>
            </section>
        </PublicLayout>
    );
}
