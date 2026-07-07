import { Link } from '@inertiajs/react';
import { Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { mainLinks, legalLinks } from '../../data/navigation';

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
                                        <Facebook className="h-4 w-4" />
                                    ),
                                },
                                {
                                    label: 'YouTube',
                                    href: '#',
                                    icon: (
                                        <Youtube className="h-4 w-4" />
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
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                                    ),
                                    text: '+62 813-9848-0422',
                                    href: 'https://wa.me/6281398480422',
                                },
                                {
                                    icon: (
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                    ),
                                    text: 'halo@wisatamrebet.id',
                                    href: 'mailto:halo@wisatamrebet.id',
                                },
                                {
                                    icon: (
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
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
