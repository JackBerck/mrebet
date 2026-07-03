import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Compass,
    MapPin,
    Plus,
    TrendingUp,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem, Event, Village } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

// ── Admin stats card ─────────────────────────────────────────────────────────
type StatCardProps = {
    label: string;
    value: number;
    icon: React.ElementType;
    sub?: string;
    href?: string;
};

function StatCard({ label, value, icon: Icon, sub, href }: StatCardProps) {
    const content = (
        <CardContent className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.92_0.02_145)] text-[oklch(0.38_0.08_145)]">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-3xl font-bold text-[oklch(0.22_0.01_85)] tabular-nums">{value}</p>
                <p className="text-sm text-[oklch(0.48_0.01_85)]">{label}</p>
                {sub && <p className="text-xs text-[oklch(0.48_0.01_85)] mt-0.5">{sub}</p>}
            </div>
        </CardContent>
    );

    return (
        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none transition-shadow hover:shadow-md">
            {href ? <Link href={href}>{content}</Link> : content}
        </Card>
    );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'draft' | 'published' }) {
    return status === 'published' ? (
        <Badge className="bg-[oklch(0.92_0.02_145)] text-[oklch(0.24_0.05_145)] hover:bg-[oklch(0.92_0.02_145)] border-0">
            Terbit
        </Badge>
    ) : (
        <Badge variant="secondary">Draft</Badge>
    );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
type AdminStats = {
    villages: number;
    destinations: number;
    events: number;
    blogs: number;
    published_villages: number;
    draft_villages: number;
    published_destinations: number;
    draft_destinations: number;
    published_events: number;
    draft_events: number;
    published_blogs: number;
    draft_blogs: number;
};

type ManagerStats = {
    destinations: number;
    events: number;
    blogs: number;
    published_destinations: number;
    draft_destinations: number;
    published_events: number;
    draft_events: number;
    published_blogs: number;
    draft_blogs: number;
};

type RecentDestination = {
    id: number;
    name: string;
    slug: string;
    category: string;
    status: 'draft' | 'published';
    village_id?: number;
    created_at: string;
    village?: { id: number; name: string };
};

type RecentBlog = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    views_count: number;
    user_id?: number;
    created_at: string;
    author?: { id: number; full_name: string };
};

type DashboardProps =
    | {
        isAdmin: true;
        stats: AdminStats;
        recentVillages: Pick<Village, 'id' | 'name' | 'slug' | 'status' | 'head_name' | 'created_at'>[];
        upcomingEvents: (Pick<Event, 'id' | 'title' | 'slug' | 'start_date' | 'start_time' | 'village_id' | 'ticket_price'> &
        { village?: { id: number; name: string } })[];
        recentDestinations: RecentDestination[];
        recentBlogs: RecentBlog[];
    }
    | {
        isAdmin: false;
        stats: ManagerStats;
        village: (Village & { media?: { id: number; file_path: string; is_primary: boolean }[] | null }) | null;
        upcomingEvents: Pick<Event, 'id' | 'title' | 'slug' | 'start_date' | 'start_time' | 'ticket_price'>[];
        recentDestinations: RecentDestination[];
        recentBlogs: RecentBlog[];
    };

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">
                            {props.isAdmin ? 'Ringkasan Sistem' : 'Dashboard Desa'}
                        </h1>
                        <p className="mt-1 text-sm text-[oklch(0.48_0.01_85)]">
                            {props.isAdmin
                                ? 'Pantau data keseluruhan Desa Wisata Kecamatan Mrebet'
                                : 'Kelola informasi desa yang Anda ampu'}
                        </p>
                    </div>
                    {props.isAdmin && (
                        <Button asChild className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]">
                            <Link href="/admin/villages/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Desa
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Stat Cards */}
                {props.isAdmin ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Total Desa"
                            value={props.stats.villages}
                            icon={MapPin}
                            sub={`${props.stats.published_villages} terbit · ${props.stats.draft_villages} draft`}
                            href="/admin/villages"
                        />
                        <StatCard
                            label="Destinasi Wisata"
                            value={props.stats.destinations}
                            icon={Compass}
                            sub={`${props.stats.published_destinations} terbit · ${props.stats.draft_destinations} draft`}
                            href="/admin/destinations"
                        />
                        <StatCard
                            label="Event"
                            value={props.stats.events}
                            icon={CalendarDays}
                            sub={`${props.stats.published_events} terbit · ${props.stats.draft_events} draft`}
                            href="/admin/events"
                        />
                        <StatCard
                            label="Artikel Blog"
                            value={props.stats.blogs}
                            icon={BookOpen}
                            sub={`${props.stats.published_blogs} terbit · ${props.stats.draft_blogs} draft`}
                            href="/admin/blogs"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Destinasi Wisata"
                            value={props.stats.destinations}
                            icon={Compass}
                            sub={`${props.stats.published_destinations} terbit · ${props.stats.draft_destinations} draft`}
                        />
                        <StatCard
                            label="Event"
                            value={props.stats.events}
                            icon={CalendarDays}
                            sub={`${props.stats.published_events} terbit · ${props.stats.draft_events} draft`}
                        />
                        <StatCard
                            label="Artikel Blog"
                            value={props.stats.blogs}
                            icon={BookOpen}
                            sub={`${props.stats.published_blogs} terbit · ${props.stats.draft_blogs} draft`}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Recent Villages / Village Card */}
                    {props.isAdmin ? (
                        <Card className="col-span-1 border-[oklch(0.22_0.01_85/8%)] shadow-none lg:col-span-3">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                                        Desa Terbaru
                                    </CardTitle>
                                    <CardDescription>5 desa yang baru ditambahkan</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/admin/villages">Lihat Semua</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-[oklch(0.22_0.01_85/8%)]">
                                    {props.recentVillages.map((village) => (
                                        <div
                                            key={village.id}
                                            className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[oklch(0.97_0.01_85)]"
                                        >
                                            <div>
                                                <p className="font-medium text-[oklch(0.22_0.01_85)]">
                                                    {village.name}
                                                </p>
                                                <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                                    {village.head_name ?? '—'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={village.status} />
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/villages/${village.slug}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="col-span-1 border-[oklch(0.22_0.01_85/8%)] shadow-none lg:col-span-3 overflow-hidden">
                            {props.village?.media && props.village.media.length > 0 && (
                                <img
                                    src={`/storage/${props.village.media.find((m) => m.is_primary)?.file_path || props.village.media[0].file_path}`}
                                    alt="Cover Desa"
                                    className="h-48 w-full object-cover sm:h-64"
                                />
                            )}
                            <CardHeader className="flex flex-wrap md:flex-row items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                                        {props.village?.name ?? 'Desa Saya'}
                                    </CardTitle>
                                    <CardDescription>
                                        Kepala Desa: {props.village?.head_name ?? '—'}
                                        {props.village?.contact_phone && ` · Telp: ${props.village.contact_phone}`}
                                    </CardDescription>
                                    {props.village?.description && (
                                        <div
                                            className="mt-3 text-sm text-[oklch(0.48_0.01_85)] line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: props.village.description }}
                                        />
                                    )}
                                </div>
                                {props.village && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <StatusBadge status={props.village.status} />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={`/admin/villages/${props.village.slug}/edit`}>
                                                Edit Profil
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex-wrap flex gap-3">
                                    <Button asChild className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]">
                                        <Link href="/admin/destinations/create">
                                            <Plus className="mr-1 h-4 w-4" /> Destinasi
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/events/create">
                                            <Plus className="mr-1 h-4 w-4" /> Event
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/blogs/create">
                                            <Plus className="mr-1 h-4 w-4" /> Blog
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Upcoming Events */}
                    <Card className="col-span-1 border-[oklch(0.22_0.01_85/8%)] shadow-none lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                                Event Mendatang
                            </CardTitle>
                            <CardDescription>Event yang akan berlangsung</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {props.upcomingEvents.length === 0 ? (
                                <p className="text-sm text-[oklch(0.48_0.01_85)]">
                                    Tidak ada event mendatang.
                                </p>
                            ) : (
                                props.upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 rounded-lg border border-[oklch(0.22_0.01_85/8%)] p-3"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[oklch(0.88_0.06_82)] text-center">
                                            <span className="text-[10px] font-semibold uppercase text-[oklch(0.38_0.08_145)]">
                                                {new Date(event.start_date).toLocaleDateString('id-ID', { month: 'short' })}
                                            </span>
                                            <span className="text-lg font-bold leading-none text-[oklch(0.24_0.05_145)]">
                                                {new Date(event.start_date).getDate()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-[oklch(0.22_0.01_85)]">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                                {event.start_time
                                                    ? event.start_time.slice(0, 5) + ' WIB'
                                                    : 'Sepanjang hari'}
                                            </p>
                                            {Number(event.ticket_price) > 0 && (
                                                <p className="text-xs font-medium text-[oklch(0.38_0.08_145)]">
                                                    Rp {Number(event.ticket_price).toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}

                            <Button variant="outline" size="sm" className="mt-1 w-full" asChild>
                                <Link href="/admin/events">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Semua Event
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Tables for Destinations and Blogs */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Destinations */}
                    <Card className="col-span-1 border-[oklch(0.22_0.01_85/8%)] shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                                    Destinasi Terbaru
                                </CardTitle>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/destinations">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-[oklch(0.22_0.01_85/8%)]">
                                {props.recentDestinations.length === 0 ? (
                                    <div className="p-4 text-sm text-[oklch(0.48_0.01_85)]">Belum ada destinasi.</div>
                                ) : (
                                    props.recentDestinations.map((dest) => (
                                        <div
                                            key={dest.id}
                                            className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[oklch(0.97_0.01_85)]"
                                        >
                                            <div className="min-w-0 flex-1 pr-4">
                                                <p className="truncate font-medium text-[oklch(0.22_0.01_85)]">
                                                    {dest.name}
                                                </p>
                                                <p className="truncate text-xs text-[oklch(0.48_0.01_85)]">
                                                    {dest.category} {dest.village?.name ? `· ${dest.village.name}` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={dest.status} />
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/destinations/${dest.slug}/edit`}>Edit</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Blogs */}
                    <Card className="col-span-1 border-[oklch(0.22_0.01_85/8%)] shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                                    Blog Terbaru
                                </CardTitle>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/blogs">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-[oklch(0.22_0.01_85/8%)]">
                                {props.recentBlogs.length === 0 ? (
                                    <div className="p-4 text-sm text-[oklch(0.48_0.01_85)]">Belum ada blog.</div>
                                ) : (
                                    props.recentBlogs.map((blog) => (
                                        <div
                                            key={blog.id}
                                            className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[oklch(0.97_0.01_85)]"
                                        >
                                            <div className="min-w-0 flex-1 pr-4">
                                                <p className="truncate font-medium text-[oklch(0.22_0.01_85)]">
                                                    {blog.title}
                                                </p>
                                                <p className="truncate text-xs text-[oklch(0.48_0.01_85)]">
                                                    {blog.views_count} views {blog.author?.full_name ? `· ${blog.author.full_name}` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={blog.status} />
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/blogs/${blog.slug}/edit`}>Edit</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
