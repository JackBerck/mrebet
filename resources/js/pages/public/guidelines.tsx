import { Head } from '@inertiajs/react';
import { Map, Droplet, MapPin, Heart, Leaf, AlertCircle, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { guidelines } from '@/data/guidelines';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';

const iconMap: Record<string, React.ElementType> = {
    Droplet,
    MapPin,
    Heart,
    Leaf,
    AlertCircle,
    Flame
};

export default function Guidelines() {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head title="Panduan Wisatawan - Wisata Mrebet" />
            
            <section className="bg-(--forest-deep) pt-32 pb-16 text-center text-white">
                <div className="container mx-auto max-w-3xl section-padding-x" data-reveal>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Map className="h-8 w-8 text-(--gold)" />
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Panduan Wisatawan</h1>
                    <p className="text-lg text-white/70">
                        Hal-hal yang perlu diperhatikan agar liburan Anda di Mrebet aman, nyaman, dan berkesan.
                    </p>
                </div>
            </section>

            <section className="bg-(--cream) py-12 lg:py-16">
                <div className="container mx-auto max-w-5xl section-padding-x">
                    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:gap-8">
                        {guidelines.map((item, idx) => {
                            const IconComponent = iconMap[item.icon] || MapPin;
                            const isDo = item.type === 'do';
                            
                            return (
                                <div 
                                    key={idx} 
                                    className="group flex gap-4 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                                    data-reveal
                                >
                                    <div className={`mt-1 flex h-10 md:h-12 w-10 md:w-12 shrink-0 items-center justify-center rounded-xl ${isDo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                    <div>
                                        <div className="mb-1 md:mb-2 flex items-center gap-2">
                                            <h3 className="font-display text-lg md:text-xl font-bold text-(--charcoal)">{item.title}</h3>
                                            {isDo ? (
                                                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                                            )}
                                        </div>
                                        <p className="text-(--charcoal-soft) leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
