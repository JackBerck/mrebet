import { Link } from '@inertiajs/react';

const mainLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Desa Wisata', href: '/desa' },
    { label: 'Destinasi Wisata', href: '/destinasi' },
    { label: 'Peta Wisata', href: '/peta' },
    { label: 'Kalender Acara', href: '/event' },
    { label: 'Blog & Berita', href: '/blog' },
    { label: 'Tentang Kami', href: '/tentang' },
];

const legalLinks = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Kebijakan Privasi', href: '/privacy-policy' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
    { label: 'Panduan Wisatawan', href: '/panduan' },
    { label: 'Kemitraan', href: '/kemitraan' },
];

export default function PublicFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-(--forest-deep) text-white" role="contentinfo">
            <div className="section-padding-x container mx-auto max-w-7xl pt-12 pb-8">
                {/* Top grid */}
                <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* Brand col */}
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
                        <Link
                            href="/"
                            className="mb-4 inline-flex items-center gap-2.5"
                            aria-label="Wisata Mrebet — Beranda"
                        >
                            <img
                                src="/logo.png"
                                alt="Logo Mrebet"
                                className="h-9 w-auto object-contain drop-shadow-md"
                            />
                            <span className="font-display text-lg font-bold">
                                Wisata Mrebet
                            </span>
                        </Link>
                        <p className="mb-5 text-sm leading-relaxed text-white/60">
                            Destinasi wisata alam di Purbalingga, Jawa Tengah —
                            curug, hutan pinus, dan keheningan di kaki Gunung
                            Slamet.
                        </p>
                        {/* Social */}
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    label: 'Instagram',
                                    href: '#',
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="5"
                                            />
                                            <circle cx="12" cy="12" r="4" />
                                            <circle cx="17.5" cy="6.5" r="1" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Facebook',
                                    href: '#',
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        >
                                            <path d="M14 9h3V6h-3a4 4 0 00-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'YouTube',
                                    href: '#',
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="6"
                                                width="18"
                                                height="12"
                                                rx="3"
                                            />
                                            <path
                                                d="M11 10l4 2-4 2v-4z"
                                                fill="currentColor"
                                                stroke="none"
                                            />
                                        </svg>
                                    ),
                                },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-all duration-200 hover:bg-(--gold) hover:text-(--forest-deep)"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigasi */}
                    <div>
                        <h5 className="title-footer-font-size mb-4 text-sm font-semibold text-white">
                            Navigasi
                        </h5>
                        <ul className="flex flex-col gap-2.5">
                            {mainLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="normal-footer-font-size text-white/60 transition-colors duration-150 hover:text-(--gold)"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal / Lainnya */}
                    <div>
                        <h5 className="title-footer-font-size mb-4 text-sm font-semibold text-white">
                            Informasi
                        </h5>
                        <ul className="flex flex-col gap-2.5">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="normal-footer-font-size text-white/60 transition-colors duration-150 hover:text-(--gold)"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h5 className="title-footer-font-size mb-4 text-sm font-semibold text-white">
                            Kontak
                        </h5>
                        <ul className="flex flex-col gap-3">
                            {[
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            aria-hidden="true"
                                        >
                                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.2.01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.22 6.22l1.07-.54a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                        </svg>
                                    ),
                                    text: '+62 813-9848-0422',
                                    href: 'https://wa.me/6281398480422',
                                },
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            aria-hidden="true"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    ),
                                    text: 'halo@wisatamrebet.id',
                                    href: 'mailto:halo@wisatamrebet.id',
                                },
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z" />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>
                                    ),
                                    text: 'Kec. Mrebet, Kab. Purbalingga, Jawa Tengah',
                                    href: 'https://www.google.com/maps/search/?api=1&query=Mrebet+Purbalingga',
                                },
                            ].map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        target={
                                            item.href.startsWith('http')
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel={
                                            item.href.startsWith('http')
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        className="hhover:text-(--gold) normal-footer-font-size flex items-start gap-2.5 text-white/60 transition-colors duration-150"
                                    >
                                        {item.icon}
                                        <span>{item.text}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="normal-footer-font-size flex flex-col items-center justify-between gap-2 pt-6 text-white/40 sm:flex-row">
                    <div>
                        © {year} Wisata Mrebet. Seluruh hak cipta dilindungi.
                    </div>
                </div>
            </div>
        </footer>
    );
}
