import { Link, usePage } from '@inertiajs/react';
import { Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { mainLinks, legalLinks } from '../../data/navigation';

export default function PublicFooter() {
    const year = new Date().getFullYear();
    const { siteSettings } = usePage<{ siteSettings?: Record<string, string> }>().props;

    const phone = siteSettings?.contact_phone || '+62 813-9848-0422';
    const wa = siteSettings?.contact_whatsapp || '6281398480422';
    const email = siteSettings?.contact_email || 'info@serayularangan.desa.id';
    const address = siteSettings?.contact_address || 'Desa Serayu Larangan, Kec. Mrebet, Kab. Purbalingga, Jawa Tengah 53352';
    const gmaps = siteSettings?.gmaps_link || 'https://maps.app.goo.gl/FMsGayqxuncMJUuU7';
    const siteName = siteSettings?.site_name || 'Serayu Larangan';

    const instagramUrl = siteSettings?.instagram_url || '#';
    const facebookUrl = siteSettings?.facebook_url || '#';
    const youtubeUrl = siteSettings?.youtube_url || '#';

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
                            aria-label={`${siteName} — Beranda`}
                        >
                            <img
                                src="/logo.png"
                                alt="Logo Serayu Larangan"
                                className="h-9 w-auto object-contain drop-shadow-md"
                            />
                            <span className="font-display text-lg font-bold">
                                {siteName}
                            </span>
                        </Link>
                        <p className="mb-5 text-sm leading-relaxed text-white/80">
                            Destinasi desa wisata asri di Desa Serayu Larangan, Kec. Mrebet, Kab. Purbalingga — keindahan alam persawahan, tradisi lokal, dan pesona di lereng timur Gunung Slamet.
                        </p>
                        {/* Social */}
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    label: 'Instagram',
                                    href: instagramUrl,
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
                                    href: facebookUrl,
                                    icon: (
                                        <Facebook className="h-4 w-4" />
                                    ),
                                },
                                {
                                    label: 'YouTube',
                                    href: youtubeUrl,
                                    icon: (
                                        <Youtube className="h-4 w-4" />
                                    ),
                                },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : undefined}
                                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    aria-label={social.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-all duration-200 hover:bg-(--gold)"
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
                                        className="normal-footer-font-size text-white/80 transition-colors duration-150 hover:text-(--gold)"
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
                                        className="normal-footer-font-size text-white/80 transition-colors duration-150 hover:text-(--gold)"
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
                                    text: phone,
                                    href: `https://wa.me/${wa.replace(/[^0-9]/g, '')}`,
                                },
                                {
                                    icon: (
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                    ),
                                    text: email,
                                    href: `mailto:${email}`,
                                },
                                {
                                    icon: (
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    ),
                                    text: address,
                                    href: gmaps,
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
                                        className="hover:text-(--gold) normal-footer-font-size flex items-start gap-2.5 text-white/80 transition-colors duration-150"
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
                        © {year} {siteName}. Seluruh hak cipta dilindungi.
                    </div>
                </div>
            </div>
        </footer>
    );
}
