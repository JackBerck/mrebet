import { Head } from '@inertiajs/react';
import { Handshake, Mail, Phone, ExternalLink } from 'lucide-react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function Partnership() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Kemitraan - Wisata Mrebet" />
            
            <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-(--forest-deep) text-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-(--forest-deep)"></div>
                
                <div className="relative z-10 container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Handshake className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">Kemitraan & Kolaborasi</h1>
                    <p className="text-lg text-white/70">
                        Bersama membangun desa wisata yang mandiri, lestari, dan memberdayakan masyarakat.
                    </p>
                </div>
            </section>

            <section className="bg-(--cream) py-12 lg:py-16">
                <div className="container mx-auto max-w-5xl section-padding-x">
                    <div className="grid gap-4 md:gap-6 md:grid-cols-2" data-reveal>
                        <div>
                            <h2 className="mb-6 font-display text-3xl font-bold text-(--forest-deep)">Peluang Kerja Sama</h2>
                            <p className="text-(--charcoal-soft) leading-relaxed mb-6">
                                Pokdarwis Mrebet sangat terbuka dengan berbagai bentuk kolaborasi. Kami mengundang berbagai institusi, komunitas, maupun pihak swasta untuk bersinergi.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Pengembangan infrastruktur wisata ramah lingkungan.',
                                    'Sponsorship untuk acara/festival desa.',
                                    'Program Kuliah Kerja Nyata (KKN) & penelitian akademis.',
                                    'Paket wisata untuk corporate gathering atau field trip sekolah.',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-(--charcoal)">
                                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--gold)/20 text-(--forest-deep)">
                                            <span className="h-2 w-2 rounded-full bg-(--gold)"></span>
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6 border border-black/5">
                            <h3 className="mb-2 md:mb-4 font-display text-xl md:text-2xl font-bold text-(--forest-deep)">Hubungi Kami</h3>
                            <p className="text-(--charcoal-soft) text-sm md:text-base mb-4 md:mb-8">
                                Tertarik untuk berdiskusi lebih lanjut? Silakan hubungi narahubung kami melalui kanal di bawah ini.
                            </p>
                            
                            <div className="space-y-2 md:space-y-4">
                                <a href="https://wa.me/6281398480422" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-md border border-black/5 bg-(--cream-soft) p-2 md:p-4 transition-colors hover:border-(--forest) hover:bg-white group">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-(--charcoal)">WhatsApp</div>
                                            <div className="text-sm text-(--charcoal-soft)">+62 813-9848-0422</div>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-5 w-5 text-(--charcoal-soft) opacity-0 transition-opacity group-hover:opacity-100" />
                                </a>

                                <a href="mailto:halo@wisatamrebet.id" className="flex items-center justify-between rounded-md border border-black/5 bg-(--cream-soft) p-2 md:p-4 transition-colors hover:border-(--forest) hover:bg-white group">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-(--charcoal)">Email</div>
                                            <div className="text-sm text-(--charcoal-soft)">halo@wisatamrebet.id</div>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-5 w-5 text-(--charcoal-soft) opacity-0 transition-opacity group-hover:opacity-100" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
