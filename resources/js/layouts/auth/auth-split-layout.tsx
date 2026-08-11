import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
                <div 
                    className="absolute inset-0 bg-zinc-900 bg-cover bg-center" 
                    style={{ backgroundImage: "url('/images/login-bg.png')" }}
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-3 text-lg font-medium"
                >
                    <img
                        src="/logo.png"
                        alt="Logo Serayu Larangan"
                        className="h-10 w-auto object-contain drop-shadow-md"
                    />
                    <span className="font-display text-xl font-bold tracking-tight text-white">{name}</span>
                </Link>
                
                <div className="relative z-20 mt-auto">
                    <h2 className="font-display text-4xl font-bold tracking-tight mb-2">
                        Kelola Potensi Desa
                    </h2>
                    <p className="text-lg text-white/80 max-w-md">
                        Platform terintegrasi untuk mengelola UMKM, Destinasi Wisata, dan Event di desa Anda.
                    </p>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2.5 lg:hidden"
                    >
                        <img
                            src="/logo.png"
                            alt="Logo Serayu Larangan"
                            className="h-10 w-auto object-contain sm:h-12"
                        />
                        <span className="font-display text-xl font-bold tracking-tight text-(--forest-deep)">{name}</span>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
