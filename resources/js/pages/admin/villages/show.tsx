import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { CalendarDays, Compass, FileText, MapPin, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Village } from '@/types';
import 'dayjs/locale/id';

dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Desa', href: '/admin/villages' },
];

type RecentDestination = {
    id: number;
    name: string;
    slug: string;
    category: string;
    status: 'draft' | 'published';
    created_at: string;
};

type RecentEvent = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    start_date: string;
    start_time: string;
    ticket_price: number;
};

type RecentBlog = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    views_count: number;
    created_at: string;
};

type Props = {
    village: Village & {
        media?: { id: number; file_path: string; is_primary: boolean }[] | null;
    };
    recentDestinations: RecentDestination[];
    recentEvents: RecentEvent[];
    recentBlogs: RecentBlog[];
    isAdmin: boolean;
};

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
    return status === 'published' ? (
        <Badge className="border-0 bg-(--forest-mist) text-(--forest-deep) hover:bg-(--forest-mist)">
            Terbit
        </Badge>
    ) : (
        <Badge variant="secondary">Draft</Badge>
    );
}

export default function VillageShow({
    village,
    recentDestinations,
    recentEvents,
    recentBlogs,
    isAdmin,
}: Props) {
    const coverMedia =
        village.media?.find((m) => m.is_primary) || village.media?.[0];

    return (
        <>
            <Head title={`Preview Desa: ${village.name}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header & Cover */}
                <Card className="overflow-hidden border-(--line) shadow-sm">
                    {coverMedia && (
                        <img
                            src={`/storage/${coverMedia.file_path}`}
                            alt={`Cover ${village.name}`}
                            className="h-48 w-full object-cover sm:h-72"
                        />
                    )}
                    <CardHeader className="flex flex-wrap items-start justify-between gap-4 bg-white md:flex-row">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="font-display text-2xl text-(--forest-deep)">
                                {village.name}
                            </CardTitle>
                            <CardDescription className="mt-1 text-base">
                                Kepala Desa:{' '}
                                <span className="font-medium text-foreground">
                                    {village.head_name ?? '—'}
                                </span>
                                {village.contact_phone &&
                                    ` · Telp: ${village.contact_phone}`}
                            </CardDescription>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <StatusBadge status={village.status} />
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {village.latitude && village.longitude
                                        ? `${village.latitude}, ${village.longitude}`
                                        : 'Koordinat tidak diisi'}
                                </span>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                asChild
                                className="bg-(--forest) hover:bg-(--forest-deep)"
                            >
                                <Link
                                    href={
                                        isAdmin
                                            ? `/admin/villages/${village.slug}/edit`
                                            : '/admin/villages/edit'
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                    Profil Desa
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="bg-white">
                        {village.description ? (
                            <div
                                className="prose prose-sm max-w-none text-(--charcoal-soft)"
                                dangerouslySetInnerHTML={{
                                    __html: village.description,
                                }}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Belum ada deskripsi desa.
                            </p>
                        )}

                        {village.media && village.media.length > 1 && (
                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-semibold">
                                    Galeri Foto
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {village.media
                                        .filter((m) => m.id !== coverMedia?.id)
                                        .map((m) => (
                                            <img
                                                key={m.id}
                                                src={`/storage/${m.file_path}`}
                                                alt="Galeri Desa"
                                                className="h-24 w-32 rounded-lg border object-cover"
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Related Data Summaries */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Destinations Table */}
                    <Card className="flex flex-col border-(--line) shadow-none">
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between py-4">
                            <div className="flex items-center gap-2">
                                <Compass className="h-5 w-5 text-(--forest)" />
                                <CardTitle className="text-base font-semibold">
                                    Destinasi (Top 5)
                                </CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 text-(--forest)"
                            >
                                <Link href="/admin/destinations">
                                    Lihat Semua
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            {recentDestinations.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead className="text-right">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentDestinations.map((dest) => (
                                            <TableRow key={dest.id}>
                                                <TableCell className="font-medium">
                                                    {dest.name}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {dest.category}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <StatusBadge
                                                        status={dest.status}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    Belum ada destinasi.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Events Table */}
                    <Card className="flex flex-col border-(--line) shadow-none">
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between py-4">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-(--forest)" />
                                <CardTitle className="text-base font-semibold">
                                    Event Mendatang (Top 5)
                                </CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 text-(--forest)"
                            >
                                <Link href="/admin/events">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            {recentEvents.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead className="text-right">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentEvents.map((evt) => (
                                            <TableRow key={evt.id}>
                                                <TableCell className="max-w-[150px] truncate font-medium">
                                                    {evt.title}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {dayjs(
                                                        evt.start_date,
                                                    ).format('D MMM YYYY')}{' '}
                                                    {evt.start_time &&
                                                        `· ${evt.start_time.substring(0, 5)}`}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <StatusBadge
                                                        status={evt.status}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    Belum ada event mendatang.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Blogs Table */}
                    <Card className="flex flex-col border-(--line) shadow-none lg:col-span-2">
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between py-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-(--forest)" />
                                <CardTitle className="text-base font-semibold">
                                    Artikel Blog (Top 5)
                                </CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 text-(--forest)"
                            >
                                <Link href="/admin/blogs">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            {recentBlogs.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Dibuat Pada</TableHead>
                                            <TableHead className="text-right">
                                                Views
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentBlogs.map((blog) => (
                                            <TableRow key={blog.id}>
                                                <TableCell className="max-w-[200px] truncate font-medium">
                                                    {blog.title}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(
                                                        blog.created_at,
                                                    ).format('D MMM YYYY')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {blog.views_count.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <StatusBadge
                                                        status={blog.status}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    Belum ada artikel blog.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

VillageShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
