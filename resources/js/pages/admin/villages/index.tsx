import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, Eye } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Village } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Desa', href: '/admin/villages' },
];

type Props = {
    villages: PaginatedData<
        Village & { primary_media?: { file_path: string } | null }
    >;
    filters: { search?: string; status?: string };
    isAdmin: boolean;
};

export default function VillagesIndex({ villages, filters, isAdmin }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/villages',
                { ...filters, ...params },
                { preserveState: true, replace: true },
            );
        },
        [filters],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const handleStatusChange = (value: string) => {
        applyFilter({ status: value === 'all' ? '' : value });
    };

    const toggleVillageStatus = (village: Village) => {
        const newStatus =
            village.status === 'published' ? 'draft' : 'published';
        router.patch(
            `/admin/villages/${village.slug}/status`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const handleDelete = (village: Village) => {
        if (
            confirm(
                `Hapus desa "${village.name}"? Data tidak langsung hilang permanen.`,
            )
        ) {
            router.delete(`/admin/villages/${village.slug}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Desa" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-(--forest-deep)">
                            Manajemen Desa
                        </h1>
                        <p className="mt-1 text-sm text-(--charcoal-soft)">
                            {villages.total} desa terdaftar
                        </p>
                    </div>
                    {isAdmin && (
                        <Button
                            asChild
                            className="bg-(--forest) hover:bg-(--forest-deep)"
                        >
                            <Link href="/admin/villages/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Desa
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filter Bar */}
                <Card className="border-(--line) shadow-none">
                    <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-1 gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--charcoal-soft)" />
                                <Input
                                    placeholder="Cari nama desa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" variant="outline">
                                Cari
                            </Button>
                        </form>

                        <Select
                            value={filters.status || 'all'}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Status
                                </SelectItem>
                                <SelectItem value="published">
                                    Terbit
                                </SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-(--line) shadow-none">
                    <CardHeader className="pb-0">
                        <CardTitle className="font-display text-base text-(--forest-deep)">
                            Daftar Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-(--line) hover:bg-transparent">
                                    <TableHead className="pl-6">
                                        Nama Desa
                                    </TableHead>
                                    <TableHead>Kepala Desa</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead>Terbit?</TableHead>}
                                    <TableHead className="pr-6 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {villages.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={isAdmin ? 6 : 5}
                                            className="py-12 text-center text-(--charcoal-soft)"
                                        >
                                            Tidak ada desa ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    villages.data.map((village) => (
                                        <TableRow
                                            key={village.id}
                                            className="border-(--line) transition-colors hover:bg-(--cream-warm)"
                                        >
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    {village.primary_media ? (
                                                        <img
                                                            src={`/storage/${village.primary_media.file_path}`}
                                                            alt={village.name}
                                                            className="h-9 w-9 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--forest-mist)">
                                                            <span className="text-xs font-semibold text-(--forest)">
                                                                {village.name.charAt(
                                                                    0,
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-[oklch(0.22_0.01_85)]">
                                                            {village.name}
                                                        </p>
                                                        <p className="text-xs text-(--charcoal-soft)">
                                                            /{village.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-(--charcoal-soft)">
                                                {village.head_name ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-sm text-(--charcoal-soft)">
                                                {village.contact_phone ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {village.status ===
                                                'published' ? (
                                                    <Badge className="border-0 bg-(--forest-mist) text-(--forest-deep) hover:bg-(--forest-mist)">
                                                        Terbit
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Draft
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    <Switch
                                                        checked={
                                                            village.status ===
                                                            'published'
                                                        }
                                                        onCheckedChange={() =>
                                                            toggleVillageStatus(
                                                                village,
                                                            )
                                                        }
                                                        aria-label={`Toggle status ${village.name}`}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/villages/${village.slug}`}
                                                            title="Lihat/Preview Desa"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {isAdmin && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    village,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {villages.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-(--line) px-6 py-4">
                                <p className="text-sm text-(--charcoal-soft)">
                                    {villages.from}–{villages.to} dari{' '}
                                    {villages.total} desa
                                </p>
                                <div className="flex gap-2">
                                    {villages.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            className={
                                                link.active
                                                    ? 'bg-(--forest) hover:bg-(--forest-deep)'
                                                    : ''
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

VillagesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
