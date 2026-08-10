import { Head } from '@inertiajs/react';
import { BookOpen, CalendarDays, Compass, Store } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Event } from '@/types';
import { StatCard } from '@/components/admin/stat-card';
import { RecentUmkmsCard, type RecentUmkm } from '@/components/admin/dashboard/recent-umkms-card';
import { UpcomingEventsCard, type UpcomingEventItem } from '@/components/admin/dashboard/upcoming-events-card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

export type AdminStats = {
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

export type RecentDestination = {
    id: number;
    name: string;
    slug: string;
    category: string;
    status: 'draft' | 'published';
    created_at: string;
};

export type RecentBlog = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    views_count: number;
    user_id?: number;
    created_at: string;
    author?: { id: number; full_name: string };
};

export type DashboardProps = {
    isAdmin: boolean;
    stats: AdminStats;
    recentUmkms: RecentUmkm[];
    upcomingEvents: UpcomingEventItem[];
    recentDestinations: RecentDestination[];
    recentBlogs: RecentBlog[];
};

export default function Dashboard({
    stats,
    recentUmkms,
    upcomingEvents,
}: DashboardProps) {
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
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="UMKM & Kuliner"
                        value={stats.umkms}
                        icon={Store}
                        sub={`${stats.published_umkms} terbit · ${stats.draft_umkms} draft`}
                        href="/admin/umkms"
                    />
                    <StatCard
                        label="Destinasi Wisata"
                        value={stats.destinations}
                        icon={Compass}
                        sub={`${stats.published_destinations} terbit · ${stats.draft_destinations} draft`}
                        href="/admin/destinations"
                    />
                    <StatCard
                        label="Event"
                        value={stats.events}
                        icon={CalendarDays}
                        sub={`${stats.published_events} terbit · ${stats.draft_events} draft`}
                        href="/admin/events"
                    />
                    <StatCard
                        label="Artikel Blog"
                        value={stats.blogs}
                        icon={BookOpen}
                        sub={`${stats.published_blogs} terbit · ${stats.draft_blogs} draft`}
                        href="/admin/blogs"
                    />
                </div>

                {/* Main Dashboard Cards */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Recent UMKM Card */}
                    <RecentUmkmsCard umkms={recentUmkms} />

                    {/* Upcoming Events Card */}
                    <UpcomingEventsCard events={upcomingEvents} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
