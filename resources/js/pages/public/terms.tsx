import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Terms() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Syarat & Ketentuan - Desa Wisata Serayu Larangan" />
            
            <section className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <FileText className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Syarat & Ketentuan</h1>
                    <p className="text-lg text-white/70">
                        Persetujuan penggunaan fasilitas dan layanan Desa Wisata Serayu Larangan.
                    </p>
                </div>
            </section>

            <section className="bg-(--cream-warm) py-12 lg:py-16">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <article className="prose prose-lg prose-slate mx-auto text-(--charcoal-soft) marker:text-(--forest) bg-white p-8 md:p-12 rounded-3xl border border-(--line) shadow-sm">
                        <p>
                            Selamat datang di Desa Wisata Serayu Larangan. Dengan mengakses situs web ini dan berkunjung ke kawasan wisata pedesaan kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut.
                        </p>
                        
                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">1. Aturan Kawasan Desa Wisata</h2>
                        <p>Seluruh pengunjung wajib mematuhi aturan berikut selama berada di lingkungan Desa Serayu Larangan:</p>
                        <ul>
                            <li>Dilarang membuang sampah sembarangan. Gunakan tempat sampah yang telah disediakan di balai desa dan spot wisata.</li>
                            <li>Dilarang melakukan tindakan asusila, konsumsi alkohol, atau obat-obatan terlarang.</li>
                            <li>Hormati norma dan kebudayaan masyarakat lokal Banyumasan di Desa Serayu Larangan.</li>
                            <li>Patuhi petunjuk keselamatan saat berada di sekitar persawahan dan aliran sungai.</li>
                        </ul>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">2. Tiket & Reservasi</h2>
                        <p>
                            Pembelian tiket dapat dilakukan di titik lokasi atau melalui reservasi rombongan. Untuk pembatalan reservasi rombongan yang sudah dibayar, pengembalian dana (<span className='font-semibold text-(--forest-deep)'>refund</span>) tunduk pada kebijakan pengelola Pokdarwis Desa Serayu Larangan (maksimal H-3 sebelum kedatangan).
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">3. Tanggung Jawab Barang Bawaan</h2>
                        <p>
                            Pengunjung bertanggung jawab penuh atas barang bawaan pribadi. Pengelola Desa Wisata Serayu Larangan tidak bertanggung jawab atas kehilangan atau kerusakan barang bawaan pribadi di lokasi.
                        </p>

                        <h2 className="text-(--forest-deep) font-display mt-4 mb-2 font-bold text-xl">4. Perubahan Syarat & Ketentuan</h2>
                        <p>
                            Pengelola berhak mengupdate syarat dan ketentuan ini sewaktu-waktu demi kenyamanan bersama.
                        </p>
                    </article>
                </div>
            </section>
        </PublicLayout>
    );
}
