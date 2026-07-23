import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { home } from '@/routes';
import { mainLinks } from '@/data/navigation';

export default function PublicNavbar() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 48);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const isActive = (href: string) =>
        href === '/' ? url === '/' : url.startsWith(href);

    return (
        <>
            <header
                className="fixed top-0 right-0 left-0 z-50 transition-all duration-500 bg-(--cream-warm)/95 shadow-[0_1px_0_var(--line)] backdrop-blur-md"
                role="banner"
            >
                <div className="section-padding-x container mx-auto flex h-16 max-w-7xl items-center justify-between transition-all duration-500 md:h-20 lg:h-24">
                    {/* Logo */}
                    <Link
                        href={home()}
                        className="flex shrink-0 items-center gap-3"
                        aria-label="Wisata Mrebet — Beranda"
                        onClick={() => setMenuOpen(false)}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo Mrebet"
                            className="h-10 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                        />
                        <span
                            className="font-display text-lg leading-none font-bold transition-colors duration-500 md:text-xl text-(--forest-deep)"
                        >
                            Wisata Mrebet
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav
                        className="hidden items-center gap-1.5 lg:flex"
                        role="navigation"
                        aria-label="Navigasi utama"
                    >
                        {mainLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={[
                                    'normal-navbar-font-size relative flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
                                    isActive(link.href)
                                        ? 'bg-(--forest-mist) text-(--forest)'
                                        : 'text-(--charcoal-soft) hover:bg-(--forest-mist) hover:text-(--forest)',
                                ].join(' ')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden items-center gap-3 lg:flex">
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center rounded-full border-2 px-6 py-2.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] border-(--forest) bg-(--forest) text-white shadow-md hover:bg-transparent hover:text-(--forest) hover:shadow-none"
                        >
                            Hubungi Kami
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="-mr-2 rounded-lg p-2 transition-colors duration-200 lg:hidden text-(--forest-deep) hover:bg-(--forest-mist)"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <X className="h-7 w-7" />
                        ) : (
                            <Menu className="h-7 w-7" />
                        )}
                    </button>
                </div>
            </header>

            {/* Full Screen Mobile Menu Overlay */}
            <div
                className={[
                    'fixed inset-0 z-40 flex flex-col bg-(--cream-soft) transition-all duration-500 ease-(--ease) lg:hidden',
                    menuOpen
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0',
                ].join(' ')}
                aria-hidden={!menuOpen}
            >
                {/* Pad content to clear fixed header */}
                <div className="h-16 shrink-0 border-b border-(--line) bg-(--cream-warm)/95 md:h-20"></div>

                <nav className="section-padding-x flex flex-1 flex-col gap-4 overflow-y-auto py-8">
                    {mainLinks.map((link, i) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={[
                                'block border-b border-(--line) py-3 font-display text-2xl font-semibold transition-all duration-500 md:text-3xl',
                                isActive(link.href)
                                    ? 'border-l-4 border-l-(--forest) pl-4 text-(--forest)'
                                    : 'text-(--charcoal) hover:text-(--forest)',
                                menuOpen
                                    ? 'translate-y-0 opacity-100'
                                    : 'translate-y-8 opacity-0',
                            ].join(' ')}
                            style={{
                                transitionDelay: `${menuOpen ? i * 50 : 0}ms`,
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div
                    className={[
                        'section-padding-x border-t border-(--line) bg-(--cream-warm) py-8 transition-all duration-700',
                        menuOpen
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0',
                    ].join(' ')}
                    style={{
                        transitionDelay: `${menuOpen ? mainLinks.length * 50 : 0}ms`,
                    }}
                >
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-full bg-(--forest) px-6 py-4 text-lg font-bold text-white shadow-(--shadow-card) transition-all duration-300 hover:bg-(--forest-deep) active:scale-[0.98] md:text-xl"
                    >
                        Hubungi Kami
                    </a>
                    <p className="mt-6 text-center text-sm text-(--charcoal-soft)">
                        Jelajahi keheningan di kaki Gunung Slamet.
                    </p>
                </div>
            </div>
        </>
    );
}
