import { Head } from '@inertiajs/react';
import { TreePine, Heart, Users, MapPin } from 'lucide-react';
import { aboutData } from '@/data/about';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

export default function About() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Tentang Kami - Wisata Mrebet" />
            
            {/* Hero Section */}
            <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-(--forest-deep) text-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542035252-09436be8e45f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-(--forest-deep)"></div>
                
                <div className="relative z-10 container mx-auto max-w-4xl section-padding-x" data-reveal>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white mb-6 backdrop-blur-md">
                        <TreePine className="h-4 w-4" />
                        <span>Mengenal Mrebet</span>
                    </div>
                    <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
                        {aboutData.title}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-white/80 leading-relaxed">
                        Kami mengundang Anda untuk menepi dari keramaian, bernapas di antara rimbun pinus, dan mendengar nyanyian alam yang sejati.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-(--cream) py-20">
                <div className="container mx-auto max-w-5xl section-padding-x">
                    
                    {/* Story */}
                    <div className="grid gap-12 md:grid-cols-2 items-center mb-24" data-reveal>
                        <div>
                            <h2 className="mb-6 font-display text-3xl font-bold text-(--forest-deep)">Cerita Kami</h2>
                            <p className="text-(--charcoal-soft) leading-relaxed mb-4">
                                {aboutData.description}
                            </p>
                            <p className="text-(--charcoal-soft) leading-relaxed">
                                Wisata Mrebet lahir dari gotong royong warga desa yang menyadari bahwa keindahan alam tidak boleh dinikmati sendirian, namun juga tidak boleh dieksploitasi. Dengan konsep pariwisata berkelanjutan, kami membangun fasilitas ramah lingkungan.
                            </p>
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-3xl md:aspect-4/3">
                            {/* Ganti dengan foto warga/desa */}
                            <img src="https://images.unsplash.com/photo-1621248035246-83c34f2d2508?auto=format&fit=crop&q=80" alt="Warga desa" className="h-full w-full object-cover" />
                        </div>
                    </div>

                    {/* Visi Misi */}
                    <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12 mb-24" data-reveal>
                        <div className="mb-10 text-center">
                            <h2 className="font-display text-3xl font-bold text-(--forest-deep) mb-4">Visi & Misi</h2>
                            <p className="mx-auto max-w-2xl text-lg font-medium text-(--gold) italic">
                                "{aboutData.vision}"
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {aboutData.missions.map((mission, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 rounded-xl hover:bg-(--cream-soft) transition-colors">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--forest-mist)/20 text-(--forest)">
                                        <Heart className="h-5 w-5" />
                                    </div>
                                    <p className="text-(--charcoal) font-medium pt-2">{mission}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team */}
                    <div className="text-center" data-reveal>
                        <h2 className="font-display text-3xl font-bold text-(--forest-deep) mb-4">Pengelola Desa Wisata</h2>
                        <p className="text-(--charcoal-soft) mb-12 max-w-2xl mx-auto">
                            Wajah-wajah di balik keramahan dan keasrian desa wisata Mrebet.
                        </p>
                        
                        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                            {aboutData.team.map((member, idx) => (
                                <div key={idx} className="group">
                                    <div className="mb-4 overflow-hidden rounded-2xl aspect-square bg-(--forest-mist)">
                                        <img src={member.photo} alt={member.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                    <h3 className="text-xl font-bold text-(--charcoal)">{member.name}</h3>
                                    <p className="text-(--gold) font-medium">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </PublicLayout>
    );
}
