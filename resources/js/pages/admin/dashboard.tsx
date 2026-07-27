import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Compass,
    Store,
    Plus,
    TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Event } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

type StatCardProps = {
    label: string;
    value: number;
    icon: React.ElementType;
    sub?: string;
    href?: string;
};

function StatCard({ label, value, icon: Icon, sub, href }: StatCardProps) {
    const content = (
        <CardContent className="flex items-center gap-4 md:flex-col md:items-start pt-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--forest-mist) text-(--forest)">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-3xl font-bold text-[oklch(0.22_0.01_85)] tabular-nums">
                    {value}
                </p>
                <p className="text-sm text-(--charcoal-soft)">{label}</p>
                {sub && (
                    <p className="mt-0.5 text-xs text-(--charcoal-soft)">
                        {sub}
                    </p>
                )}
            </div>
        </CardContent>
    );

    return (
        <Card className="border-(--line) shadow-none transition-shadow hover:shadow-md">
            {href ? <Link href={href}>{content}</Link> : content}
        </Card>
    );
}

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
    return status === 'published' ? (
        <Badge className="border-0 bg-(--forest-mist) text-(--forest-deep) hover:bg-(--forest-mist)">
            Terbit
        </Badge>
    ) : (
        <Badge variant="secondary">Draft</Badge>
    );
}

type AdminStats = {
    umkms: number;
    destinations: number;
    events: number;
    blogs: number;
    published_umkms: number;
    draft_umkms: number;
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

type RecentUmkm = {
    id: number;
    name: string;
    slug: string;
    category: string;
    status: 'draft' | 'published';
    owner_name?: string;
    created_at: string;
};

type RecentDestination = {
    id: number;
    name: string;
    slug: string;
    category: string;
    status: 'draft' | 'published';
    umkm_id?: number;
    created_at: string;
    umkm?: { id: number; name: string };
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
          recentUmkms: RecentUmkm[];
          upcomingEvents: (Pick<
              Event,
              | 'id'
              | 'title'
              | 'slug'
              | 'start_date'
              | 'start_time'
              | 'ticket_price'
          > & { umkm?: { id: number; name: string } })[];
          recentDestinations: RecentDestination[];
          recentBlogs: RecentBlog[];
      }
    | {
          isAdmin: false;
          stats: ManagerStats;
          umkm?: any;
          upcomingEvents: Pick<
              Event,
              | 'id'
              | 'title'
              | 'slug'
              | 'start_date'
              | 'start_time'
              | 'ticket_price'
          >[];
          recentDestinations: RecentDestination[];
          recentBlogs: RecentBlog[];
      };

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-(--forest-deep)">
                            Dashboard Desa Serayu Larangan
                        </h1>
                        <p className="mt-1 text-sm text-(--charcoal-soft)">
                            Pantau dan kelola UMKM, destinasi wisata, event, dan berita desa.
                        </p>
                    </div>
                    {props.isAdmin && (
                        <Button
                            asChild
                            className="bg-(--forest) hover:bg-(--forest-deep)"
                        >
                            <Link href="/admin/umkms/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah UMKM
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Stat Cards */}
                {props.isAdmin ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="UMKM & Kuliner"
                            value={props.stats.umkms}
                            icon={Store}
                            sub={`${props.stats.published_umkms} terbit · ${props.stats.draft_umkms} draft`}
                            href="/admin/umkms"
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
                    {/* Recent UMKM */}
                    {props.isAdmin ? (
                        <Card className="col-span-1 border-(--line) shadow-none lg:col-span-3">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="font-display text-lg text-(--forest-deep)">
                                        UMKM & Kuliner Terbaru
                                    </CardTitle>
                                    <CardDescription>
                                        Daftar UMKM terdaftar di desa
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/admin/umkms">
                                        Lihat Semua
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-[oklch(0.22_0.01_85/8%)]">
                                    {props.recentUmkms.map((umkm) => (
                                        <div
                                            key={umkm.id}
                                            className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-(--cream-warm)"
                                        >
                                            <div className="min-w-0 flex-1 pr-4">
                                                <p className="truncate font-medium text-[oklch(0.22_0.01_85)]" title={umkm.name}>
                                                    {umkm.name}
                                                </p>
                                                <p className="truncate text-xs text-(--charcoal-soft)" title={umkm.owner_name ?? '—'}>
                                                    Pemilik: {umkm.owner_name ?? '—'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge
                                                    status={umkm.status}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/umkms/${umkm.slug}/edit`}
                                                    >
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
                        <Card className="col-span-1 overflow-hidden border-(--line) shadow-none lg:col-span-3 p-6">
                            <CardTitle className="font-display text-lg text-(--forest-deep) mb-2">
                                Management Panel UMKM
                            </CardTitle>
                            <CardDescription className="mb-4">
                                Kelola destinasi, event, dan postingan berita usaha Anda.
                            </CardDescription>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild className="bg-(--forest) hover:bg-(--forest-deep)">
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
                        </Card>
                    )}

                    {/* Upcoming Events */}
                    <Card className="col-span-1 border-(--line) shadow-none lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-display text-lg text-(--forest-deep)">
                                Event Mendatang
                            </CardTitle>
                            <CardDescription>
                                Event yang akan berlangsung
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {props.upcomingEvents.length === 0 ? (
                                <p className="text-sm text-(--charcoal-soft)">
                                    Tidak ada event mendatang.
                                </p>
                            ) : (
                                props.upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 rounded-lg border border-(--line) p-3"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-(--gold-soft) text-center">
                                            <span className="text-[10px] font-semibold text-(--forest) uppercase">
                                                {new Date(
                                                    event.start_date,
                                                ).toLocaleDateString('id-ID', {
                                                    month: 'short',
                                                })}
                                            </span>
                                            <span className="text-lg leading-none font-bold text-(--forest-deep)">
                                                {new Date(
                                                    event.start_date,
                                                ).getDate()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-[oklch(0.22_0.01_85)]">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-(--charcoal-soft)">
                                                {event.start_time
                                                    ? event.start_time.slice(0, 5) + ' WIB'
                                                    : 'Sepanjang hari'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-1 w-full"
                                asChild
                            >
                                <Link href="/admin/events">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Semua Event
                                </Link>
                            </Button>
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
