import { Head, Link } from '@inertiajs/react';
import { useMotionReveal } from '@/hooks/use-motion-reveal';
import PublicLayout from '@/layouts/public-layout';
import type { Destination, Event, Blog, Stats } from '@/types/public';

type Props = {
    featuredDestinations: Destination[];
    upcomingEvents: Event[];
    latestBlogs: Blog[];
    stats: Stats;
};

/* ── Activity data (static) ─────────────────────────────────────────────────── */
const activities = [
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-7 w-7"
            >
                <path d="M4 20l4-9 4 9M12 20l4-9 4 9M8 11l4-7 4 7" />
            </svg>
        ),
        title: 'Camping',
        desc: 'Bermalam di bawah kanopi pinus dengan suara sungai sebagai pengantar tidur.',
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-7 w-7"
            >
                <path d="M3 20l6-14 4 8 3-5 5 11H3z" />
            </svg>
        ),
        title: 'Hiking',
        desc: 'Jalur pendakian ringan hingga menantang menuju punggung Gunung Slamet.',
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-7 w-7"
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
            </svg>
        ),
        title: 'Sunrise',
        desc: 'Titik pandang timur menawarkan matahari terbit di atas lautan awan.',
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-7 w-7"
            >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                <circle cx="12" cy="13" r="3.5" />
            </svg>
        ),
        title: 'Fotografi',
        desc: 'Cahaya pagi menembus kabut — surga bagi pencari komposisi lanskap.',
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-7 w-7"
            >
                <path d="M4 10h16M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4M6 10v10M18 10v10M4 20h16" />
            </svg>
        ),
        title: 'Kuliner Lokal',
        desc: 'Hidangan rumahan warga desa, dimasak dengan bumbu dan resep turun-temurun.',
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-7 w-7"
            >
                <path d="M12 2l2.5 6.5L21 9l-5 4 2 7-6-4-6 4 2-7-5-4 6.5-.5z" />
            </svg>
        ),
        title: 'Adventure',
        desc: 'Susur sungai dan tebing rendah bagi yang mencari sedikit adrenalin.',
    },
];

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function formatDate(dateStr: string) {
    const d = new Date(dateStr);

    return {
        day: d.toLocaleDateString('id-ID', { day: '2-digit' }),
        month: d.toLocaleDateString('id-ID', { month: 'long' }),
    };
}

function categoryLabel(cat: string) {
    const map: Record<string, string> = {
        alam: 'Alam',
        budaya: 'Budaya',
        buatan: 'Buatan',
    };

    return map[cat] ?? cat;
}

function googleMapsUrl(lat: number, lng: number, name: string) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
}

/* ── Component ──────────────────────────────────────────────────────────────── */
export default function Home({
    featuredDestinations,
    upcomingEvents,
    latestBlogs,
    stats,
}: Props) {
    useMotionReveal();

    return (
        <PublicLayout>
            <Head>
                <title>Wisata Mrebet — Temukan Curug, Temukan Diri</title>
                <meta
                    content="Destinasi wisata alam di Kecamatan Mrebet, Purbalingga, Jawa Tengah. Curug tersembunyi, hutan pinus, dan keheningan di kaki Gunung Slamet."
                />
            </Head>
                {/* ── HERO ───────────────────────────────────────────────────── */}
                <section
                    id="top"
                    className="relative flex items-end overflow-hidden pt-24 md:pt-32 pb-16 md:pb-20"
                    aria-label="Hero utama Wisata Mrebet"
                >
                    {/* Background */}
                    <div className="absolute inset-0 bg-(--forest-deep)">
                        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/60" />
                        {/* Texture overlay */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 20% 50%, oklch(0.38 0.08 145 / 40%) 0%, transparent 60%), radial-gradient(circle at 80% 20%, oklch(0.78 0.12 82 / 20%) 0%, transparent 50%)',
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="section-padding-x relative z-10 container mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <div className="mb-2 md:mb-4 inline-block text-xs font-semibold tracking-[0.15em] text-(--gold) uppercase">
                                Purbalingga, Jawa Tengah
                            </div>
                            <h1
                                className="mb-2 md:mb-4 font-display text-white"
                                style={{
                                    fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                                    lineHeight: 1.08,
                                    fontWeight: 700,
                                }}
                            >
                                Tempat di mana{' '}
                                <em className="text-(--gold) not-italic">
                                    hutan
                                </em>{' '}
                                menyimpan air terjunnya sendiri.
                            </h1>
                            <p
                                className="mb-4 md:mb-6 max-w-xl leading-relaxed text-white/75"
                                style={{
                                    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                                }}
                            >
                                Mrebet adalah lipatan tenang di kaki pegunungan
                                tengah Jawa — curug jernih, jalan setapak
                                berkabut, dan udara yang belum pernah diburu
                                siapa pun.
                            </p>
                            <div className="mb-8 md:mb-12 flex flex-wrap items-center gap-3">
                                <Link
                                    href="/destinasi"
                                    className="inline-flex items-center gap-2 rounded-xl bg-(--gold) px-6 py-3 font-semibold text-(--forest-deep) transition-all duration-200 hover:bg-(--gold-soft) active:scale-[0.98]"
                                >
                                    Jelajahi Mrebet
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/peta"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
                                        <path d="M9 4v13M15 7v13" />
                                    </svg>
                                    Lihat Peta
                                </Link>
                            </div>

                            {/* Quick bar */}
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {[
                                    {
                                        icon: (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
                                                <path d="M9 4v13M15 7v13" />
                                            </svg>
                                        ),
                                        label: 'Rute',
                                        value: 'Ambil Arah ke Mrebet',
                                        href: 'https://www.google.com/maps/dir/?api=1&destination=-7.3168897,109.3491433',
                                    },
                                    {
                                        icon: (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z" />
                                                <circle
                                                    cx="12"
                                                    cy="10"
                                                    r="2.5"
                                                />
                                            </svg>
                                        ),
                                        label: 'Jelajah',
                                        value: `${stats.destinations}+ Destinasi`,
                                        href: '/destinasi',
                                    },
                                    {
                                        icon: (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M12 7v5l3.5 2" />
                                            </svg>
                                        ),
                                        label: 'Jam Buka',
                                        value: '06.00–17.00 WIB',
                                        href: '/tentang',
                                    },
                                    {
                                        icon: (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <rect
                                                    x="4"
                                                    y="4"
                                                    width="7"
                                                    height="7"
                                                />
                                                <rect
                                                    x="13"
                                                    y="4"
                                                    width="7"
                                                    height="7"
                                                />
                                                <rect
                                                    x="4"
                                                    y="13"
                                                    width="7"
                                                    height="7"
                                                />
                                                <path d="M13 13h3v3h-3zM19 13v3M13 19h3M17 19h3v-3" />
                                            </svg>
                                        ),
                                        label: 'Akses Cepat',
                                        value: 'Scan QR Website',
                                        href: '/tentang',
                                    },
                                ].map((item) => (
                                    <a
                                        key={item.label}
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
                                        className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
                                    >
                                        <span className="shrink-0 text-(--gold)">
                                            {item.icon}
                                        </span>
                                        <span className="flex min-w-0 flex-col">
                                            <span className="mb-0.5 text-[10px] leading-none font-medium tracking-wide text-white/50 uppercase">
                                                {item.label}
                                            </span>
                                            <span className="truncate text-xs leading-none font-medium">
                                                {item.value}
                                            </span>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scroll cue */}
                    <div
                        className="absolute right-8 bottom-6 hidden flex-col items-center gap-2 text-white/40 md:flex"
                        aria-hidden="true"
                    >
                        <span className="origin-center rotate-90 text-[10px] tracking-[0.2em] uppercase">
                            Scroll
                        </span>
                        <div className="mt-2 h-12 w-px bg-linear-to-b from-white/40 to-transparent" />
                    </div>
                </section>

                {/* ── MUST-SEE STRIP ──────────────────────────────────────────── */}
                {featuredDestinations.length > 0 && (
                    <section
                        className="border-t border-white/5 bg-(--forest-deep)"
                        aria-label="Destinasi wajib kunjungi"
                    >
                        <div className="section-padding-x container mx-auto flex max-w-7xl scrollbar-none items-center gap-4 overflow-x-auto py-4">
                            <span className="shrink-0 text-xs font-semibold tracking-[0.12em] text-(--gold) uppercase">
                                Wajib Dikunjungi
                            </span>
                            <div className="flex items-center gap-2">
                                {featuredDestinations.map((dest) => (
                                    <Link
                                        key={dest.id}
                                        href={`/destinasi/${dest.slug}`}
                                        className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-(--gold) hover:text-(--forest-deep)"
                                    >
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--forest-mist)/20">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-3 w-3"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z" />
                                                <circle
                                                    cx="12"
                                                    cy="10"
                                                    r="2.5"
                                                />
                                            </svg>
                                        </span>
                                        {dest.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── DISCOVER / ABOUT ─────────────────────────────────────────── */}
                <section
                    id="discover"
                    className="bg-(--cream-warm) py-12 lg:py-16"
                    aria-label="Tentang Mrebet"
                >
                    <div className="section-padding-x container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            <div data-reveal>
                                <div className="eyebrow">Tentang Mrebet</div>
                                <h2
                                    className="mb-2 md:mb-4 font-display font-semibold text-(--forest-deep)"
                                    style={{
                                        fontSize:
                                            'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    }}
                                >
                                    Sebuah desa kecil, dijaga oleh sungai yang
                                    jatuh dari perbukitan.
                                </h2>
                                <p className="leading-relaxed text-(--charcoal-soft)">
                                    Mrebet bukan destinasi yang dibuat untuk
                                    ramai. Ia sudah ada jauh sebelum peta
                                    menandainya — sungai yang mengukir batu
                                    selama ratusan tahun, pohon-pohon yang
                                    membentuk kanopi alami di atas jalan
                                    setapak, dan warga yang masih menyapa dengan
                                    tenang.
                                </p>
                                <p className="mb-4 md:mb-6 leading-relaxed text-(--charcoal-soft)">
                                    Di sinilah curug-curug tersembunyi mengalir
                                    tanpa terburu-buru, dan setiap sudut terasa
                                    seperti ditemukan, bukan dikunjungi.
                                </p>
                                <div className="grid grid-cols-3 gap-4 border-t border-(--line) pt-6">
                                    {[
                                        {
                                            num:
                                                stats.destinations.toString() +
                                                '+',
                                            label: 'Destinasi Aktif',
                                        },
                                        { num: '450m', label: 'Ketinggian' },
                                        {
                                            num: '18°C',
                                            label: 'Suhu Rata-rata',
                                        },
                                    ].map((s) => (
                                        <div key={s.label}>
                                            <div className="font-display text-2xl font-bold text-(--forest) md:text-3xl">
                                                {s.num}
                                            </div>
                                            <div className="mt-1 text-xs text-(--charcoal-soft)">
                                                {s.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative" data-reveal>
                                <div className="aspect-4/5 overflow-hidden rounded-2xl bg-(--forest-mist)">
                                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-(--forest-mist) via-(--cream-soft) to-(--forest-mist)">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="var(--forest)"
                                            strokeWidth="1"
                                            className="h-24 w-24 opacity-20"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Floating card */}
                                <div className="absolute -bottom-4 -left-4 rounded-xl border border-(--line) bg-white p-4 shadow-(--shadow-card)">
                                    <div className="font-display text-xl font-bold text-(--forest)">
                                        {stats.villages}
                                    </div>
                                    <div className="text-xs text-(--charcoal-soft)">
                                        Desa Wisata
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── DESTINATIONS ─────────────────────────────────────────────── */}
                <section
                    id="destinasi"
                    className="bg-(--cream-soft) py-12 lg:py-16"
                    aria-label="Destinasi pilihan"
                >
                    <div className="section-padding-x container mx-auto max-w-7xl">
                        <div
                            className="mb-6 md:mb-10 flex flex-col justify-between gap-2 md:gap-4 md:flex-row md:items-end"
                            data-reveal
                        >
                            <div>
                                <div className="eyebrow">Destinasi Pilihan</div>
                                <h2
                                    className="font-display font-semibold text-(--forest-deep)"
                                    style={{
                                        fontSize:
                                            'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    }}
                                >
                                    Tujuan wisata, satu perjalanan
                                    <br className="hidden md:block" /> yang tak
                                    akan sama dua kali.
                                </h2>
                            </div>
                            <Link
                                href="/destinasi"
                                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-(--forest) transition-colors hover:text-(--forest-deep)"
                            >
                                Lihat semua
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </Link>
                        </div>

                        {featuredDestinations.length > 0 ? (
                            <div
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                                data-reveal
                                data-reveal-stagger
                            >
                                {featuredDestinations.map((dest, i) => (
                                    <div
                                        key={dest.id}
                                        className="hover-card group flex flex-col overflow-hidden rounded-2xl border border-(--line) bg-white"
                                        style={{
                                            transitionDelay: `${i * 80}ms`,
                                        }}
                                    >
                                        {/* Image placeholder */}
                                        <div className="relative aspect-4/3 overflow-hidden bg-(--forest-mist)">
                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                                            <span className="absolute top-3 left-3 rounded-full bg-(--forest) px-2 py-1 text-[10px] font-semibold text-white">
                                                {categoryLabel(dest.category)}
                                            </span>
                                            <span className="absolute top-3 right-3 font-display text-xl font-bold text-white/40">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-4">
                                            <h3 className="mb-1 text-base font-semibold text-(--charcoal)">
                                                {dest.name}
                                            </h3>
                                            {dest.village && (
                                                <p className="mb-2 text-xs text-(--charcoal-soft)">
                                                    {dest.village.name}
                                                </p>
                                            )}
                                            <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-(--charcoal-soft)">
                                                {dest.description}
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 border-t border-(--line) pt-3">
                                                <Link
                                                    href={`/destinasi/${dest.slug}`}
                                                    className="flex items-center gap-1 text-sm font-semibold text-(--forest) transition-colors hover:text-(--forest-deep)"
                                                >
                                                    Jelajahi
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                                    </svg>
                                                </Link>
                                                <a
                                                    href={googleMapsUrl(
                                                        dest.latitude,
                                                        dest.longitude,
                                                        dest.name,
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-auto flex items-center gap-1 text-xs text-(--charcoal-soft) transition-colors hover:text-(--forest)"
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
                                                        <path d="M9 4v13M15 7v13" />
                                                    </svg>
                                                    Peta
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-(--charcoal-soft)">
                                <p>Belum ada destinasi yang dipublikasikan.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── ACTIVITIES ───────────────────────────────────────────────── */}
                <section
                    id="aktivitas"
                    className="bg-(--cream-warm) py-12 lg:py-16"
                    aria-label="Pengalaman wisata"
                >
                    <div className="section-padding-x container mx-auto max-w-7xl">
                        <div
                            className="mb-6 md:mb-10 flex flex-col gap-2 md:gap-4 md:flex-row md:items-end"
                            data-reveal
                        >
                            <div>
                                <div className="eyebrow">Pengalaman</div>
                                <h2
                                    className="font-display font-semibold text-(--forest-deep)"
                                    style={{
                                        fontSize:
                                            'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    }}
                                >
                                    Datang untuk pemandangannya,
                                    <br className="hidden md:block" /> tinggal
                                    untuk keheningannya.
                                </h2>
                            </div>
                            <p className="max-w-sm text-(--charcoal-soft) md:ml-auto md:text-right">
                                Enam cara berbeda untuk mengenal Mrebet — pilih
                                sesuai ritme perjalananmu.
                            </p>
                        </div>
                        <div
                            className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6"
                            data-reveal
                            data-reveal-stagger
                        >
                            {activities.map((act) => (
                                <div
                                    key={act.title}
                                    className="hover-card group flex flex-col items-center rounded-2xl border border-(--line) bg-white p-5 text-center"
                                >
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-(--forest-mist) text-(--forest) transition-colors duration-300 group-hover:bg-(--forest) group-hover:text-white">
                                        {act.icon}
                                    </div>
                                    <h4 className="mb-1.5 text-sm font-semibold text-(--charcoal)">
                                        {act.title}
                                    </h4>
                                    <p className="text-xs leading-relaxed text-(--charcoal-soft)">
                                        {act.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── WHY MREBET (Stats) ───────────────────────────────────────── */}
                <section
                    className="bg-(--forest-deep) py-12 lg:py-16"
                    aria-label="Alasan mengunjungi Mrebet"
                >
                    <div className="section-padding-x container mx-auto max-w-7xl">
                        <div className="mb-6 md:mb-10 text-center" data-reveal>
                            <div className="mb-3 inline-block text-xs font-semibold tracking-[0.12em] text-(--gold) uppercase">
                                Mengapa Mrebet
                            </div>
                            <h2
                                className="font-display font-semibold text-white"
                                style={{
                                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                                }}
                            >
                                Alasan sederhana untuk mempercayai perjalanan
                                ini.
                            </h2>
                        </div>
                        <div
                            className="grid grid-cols-2 gap-6 md:grid-cols-4"
                            data-reveal
                            data-reveal-stagger
                        >
                            {[
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="h-7 w-7"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z" />
                                        </svg>
                                    ),
                                    num: stats.destinations.toString() + '+',
                                    label: 'Destinasi Aktif',
                                },
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="h-7 w-7"
                                            aria-hidden="true"
                                        >
                                            <path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9L12 20.3l8.8-8.8c1.9-1.9 1.9-5 0-6.9z" />
                                        </svg>
                                    ),
                                    num: '4.9',
                                    label: 'Rating Pengunjung',
                                },
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="h-7 w-7"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="M12 7v5l3.5 2" />
                                        </svg>
                                    ),
                                    num: '3 Jam',
                                    label: 'Dari Purwokerto',
                                },
                                {
                                    icon: (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="h-7 w-7"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z" />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>
                                    ),
                                    num: '12+',
                                    label: 'Titik Foto Ikonik',
                                },
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-(--gold)">
                                        {item.icon}
                                    </div>
                                    <div className="mb-1 font-display text-3xl font-bold text-white md:text-4xl">
                                        {item.num}
                                    </div>
                                    <div className="text-sm text-white/50">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── EVENTS ───────────────────────────────────────────────────── */}
                <section
                    id="acara"
                    className="bg-(--cream-soft) py-12 lg:py-16"
                    aria-label="Acara mendatang"
                >
                    <div className="section-padding-x container mx-auto max-w-7xl">
                        <div
                            className="mb-6 md:mb-10 flex flex-col justify-between gap-2 md:gap-4 md:flex-row md:items-end"
                            data-reveal
                        >
                            <div>
                                <div className="eyebrow">Acara Mendatang</div>
                                <h2
                                    className="font-display font-semibold text-(--forest-deep)"
                                    style={{
                                        fontSize:
                                            'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    }}
                                >
                                    Musim demi musim, Mrebet punya
                                    <br className="hidden md:block" /> alasan
                                    baru untuk dikunjungi.
                                </h2>
                            </div>
                            <Link
                                href="/event"
                                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-(--forest) transition-colors hover:text-(--forest-deep)"
                            >
                                Lihat kalender
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </Link>
                        </div>

                        {upcomingEvents.length > 0 ? (
                            <div className="flex flex-col gap-3" data-reveal>
                                {upcomingEvents.map((event) => {
                                    const { day, month } = formatDate(
                                        event.start_date,
                                    );

                                    return (
                                        <Link
                                            key={event.id}
                                            href={`/event/${event.slug}`}
                                            className="hover-card group flex items-center gap-5 rounded-2xl border border-(--line) bg-white px-5 py-4 transition-colors hover:border-(--forest-mist)"
                                        >
                                            <div className="w-12 shrink-0 text-center">
                                                <div className="font-display text-2xl leading-none font-bold text-(--forest)">
                                                    {day}
                                                </div>
                                                <div className="mt-0.5 text-[10px] tracking-wide text-(--charcoal-soft) uppercase">
                                                    {month}
                                                </div>
                                            </div>
                                            <div className="h-8 w-px shrink-0 bg-(--line)" />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-semibold text-(--charcoal) md:text-base">
                                                    {event.title}
                                                </h4>
                                                <p className="mt-0.5 truncate text-xs text-(--charcoal-soft)">
                                                    {event.organizer}
                                                    {event.village
                                                        ? ` · ${event.village.name}`
                                                        : ''}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                {event.ticket_price > 0 ? (
                                                    <span className="hidden rounded-full bg-(--forest-mist) px-2 py-1 text-xs font-medium text-(--forest) sm:block">
                                                        Rp{' '}
                                                        {event.ticket_price.toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="hidden rounded-full bg-(--gold-soft)/30 px-2 py-1 text-xs font-medium text-(--gold) sm:block">
                                                        Gratis
                                                    </span>
                                                )}
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-4 w-4 text-(--charcoal-soft) transition-colors group-hover:text-(--forest)"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                                </svg>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-(--charcoal-soft)">
                                <p>
                                    Tidak ada acara mendatang saat ini. Pantau
                                    terus!
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── LATEST BLOG ──────────────────────────────────────────────── */}
                {latestBlogs.length > 0 && (
                    <section
                        className="bg-(--cream-warm) py-12 lg:py-16"
                        aria-label="Artikel terbaru"
                    >
                        <div className="section-padding-x container mx-auto max-w-7xl">
                            <div
                                className="mb-6 md:mb-10 flex flex-col justify-between gap-2 md:gap-4 md:flex-row md:items-end"
                                data-reveal
                            >
                                <div>
                                    <div className="eyebrow">
                                        Artikel & Berita
                                    </div>
                                    <h2
                                        className="font-display font-semibold text-(--forest-deep)"
                                        style={{
                                            fontSize:
                                                'clamp(1.75rem, 3.5vw, 2.5rem)',
                                        }}
                                    >
                                        Cerita dari balik
                                        <br className="hidden md:block" />{' '}
                                        perbukitan Mrebet.
                                    </h2>
                                </div>
                                <Link
                                    href="/blog"
                                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-(--forest) transition-colors hover:text-(--forest-deep)"
                                >
                                    Semua artikel
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </Link>
                            </div>
                            <div
                                className="grid grid-cols-1 gap-5 md:grid-cols-3"
                                data-reveal
                                data-reveal-stagger
                            >
                                {latestBlogs.map((blog) => (
                                    <Link
                                        key={blog.id}
                                        href={`/blog/${blog.slug}`}
                                        className="hover-card group flex flex-col overflow-hidden rounded-2xl border border-(--line) bg-white"
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-(--forest-mist)">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="var(--forest)"
                                                    strokeWidth="1"
                                                    className="h-12 w-12 opacity-20"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col p-4">
                                            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-(--charcoal) transition-colors group-hover:text-(--forest) md:text-base">
                                                {blog.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between border-t border-(--line) pt-3">
                                                <span className="text-xs text-(--charcoal-soft)">
                                                    {blog.author?.full_name ??
                                                        'Tim Mrebet'}
                                                </span>
                                                <span className="text-xs text-(--charcoal-soft)">
                                                    {blog.views_count.toLocaleString(
                                                        'id-ID',
                                                    )}{' '}
                                                    views
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── VISIT / MAP ───────────────────────────────────────────────── */}
                <section
                    id="kunjungi"
                    className="bg-(--cream-soft) py-12 lg:py-16"
                    aria-label="Rencanakan kunjungan"
                >
                    <div className="section-padding-x container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 items-center gap-6 md:gap-8 lg:grid-cols-2">
                            <div data-reveal>
                                <div className="eyebrow">
                                    Rencanakan Kunjungan
                                </div>
                                <h2
                                    className="mb-2 md:mb-4 font-display font-semibold text-(--forest-deep)"
                                    style={{
                                        fontSize:
                                            'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    }}
                                >
                                    Mrebet menantimu, kapan pun kau siap.
                                </h2>
                                <p className="mb-2 md:mb-4 leading-relaxed text-(--charcoal-soft)">
                                    Terletak di Kecamatan Mrebet, Kabupaten
                                    Purbalingga, Jawa Tengah — mudah dijangkau
                                    namun terasa jauh dari keramaian.
                                </p>
                                <div className="mb-4 md:mb-6 flex flex-col gap-2 md:gap-4">
                                    {[
                                        {
                                            icon: (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    className="h-5 w-5 shrink-0"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z" />
                                                    <circle
                                                        cx="12"
                                                        cy="10"
                                                        r="2.5"
                                                    />
                                                </svg>
                                            ),
                                            text: 'Kec. Mrebet, Kab. Purbalingga, Jawa Tengah',
                                        },
                                        {
                                            icon: (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    className="h-5 w-5 shrink-0"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="9"
                                                    />
                                                    <path d="M12 7v5l3.5 2" />
                                                </svg>
                                            ),
                                            text: '06.00 - 17.00 WIB, setiap hari',
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 text-(--charcoal)"
                                        >
                                            <span className="mt-0.5 text-(--forest)">
                                                {item.icon}
                                            </span>
                                            <span className="text-sm">
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="https://www.google.com/maps/dir/?api=1&destination=-7.3168897,109.3491433"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-(--forest) px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-(--forest-deep) active:scale-[0.98]"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        >
                                            <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
                                            <path d="M9 4v13M15 7v13" />
                                        </svg>
                                        Ambil Rute
                                    </a>
                                    <Link
                                        href="/tentang"
                                        className="inline-flex items-center gap-2 rounded-xl bg-(--gold) px-5 py-2.5 text-sm font-semibold text-(--forest-deep) transition-all duration-200 hover:bg-(--gold-soft) active:scale-[0.98]"
                                    >
                                        Hubungi Kami
                                    </Link>
                                </div>
                            </div>

                            {/* Map */}
                            <div
                                className="relative overflow-hidden rounded-2xl"
                                data-reveal
                            >
                                <div className="aspect-4/3 w-full md:aspect-square">
                                    <iframe
                                        src="https://www.google.com/maps?q=-7.3168897,109.3491433&hl=id&z=13&output=embed"
                                        className="h-full w-full border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Peta lokasi Kecamatan Mrebet, Purbalingga"
                                    />
                                </div>
                                <a
                                    href="https://www.google.com/maps/dir/?api=1&destination=-7.3168897,109.3491433"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-(--forest) shadow-md transition-all duration-200 hover:bg-(--forest) hover:text-white"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    >
                                        <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
                                        <path d="M9 4v13M15 7v13" />
                                    </svg>
                                    Buka Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
        </PublicLayout>
    );
}
