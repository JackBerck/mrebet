import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, Eye, MapPin, ExternalLink } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'UMKM & Kuliner', href: '/admin/umkms' },
];

export interface UmkmItem {
    id: number;
    name: string;
    slug: string;
    category: string;
    owner_name?: string | null;
    description?: string | null;
    address?: string | null;
    contact_phone?: string | null;
    price_range?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    gmaps_link?: string | null;
    status: 'draft' | 'published';
    created_at: string;
    primary_media?: { file_path: string } | null;
}

type Props = {
    umkms: PaginatedData<UmkmItem>;
    categories: { value: string; label: string }[];
    filters: { search?: string; category?: string; status?: string };
    isAdmin: boolean;
};

export default function UmkmsIndex({ umkms, categories, filters, isAdmin }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [umkmToDelete, setUmkmToDelete] = useState<UmkmItem | null>(null);

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/umkms',
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

    const handleCategoryChange = (value: string) => {
        applyFilter({ category: value === 'all' ? '' : value });
    };

    const handleStatusChange = (value: string) => {
        applyFilter({ status: value === 'all' ? '' : value });
    };

    const toggleStatus = (umkm: UmkmItem) => {
        const newStatus = umkm.status === 'published' ? 'draft' : 'published';
        router.patch(
            `/admin/umkms/${umkm.slug}/status`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (umkmToDelete) {
            router.delete(`/admin/umkms/${umkmToDelete.slug}`, {
                preserveScroll: true,
                onSuccess: () => setUmkmToDelete(null),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen UMKM & Kuliner Desa" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-(--forest-deep)">
                            Manajemen UMKM & Kuliner Desa
                        </h1>
                        <p className="mt-1 text-sm text-(--charcoal-soft)">
                            {umkms.total} usaha & warung terdaftar di Serayu Larangan
                        </p>
                    </div>
                    {isAdmin && (
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
                                    placeholder="Cari nama UMKM atau pemilik..."
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
                            value={filters.category || 'all'}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status || 'all'}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="published">Terbit</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-(--line) shadow-none">
                    <CardHeader className="pb-0">
                        <CardTitle className="font-display text-base text-(--forest-deep)">
                            Daftar UMKM & Kuliner
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-(--line) hover:bg-transparent">
                                    <TableHead className="pl-6">Nama UMKM</TableHead>
                                    <TableHead>Pemilik</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Kontak / Maps</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead>Terbit?</TableHead>}
                                    <TableHead className="pr-6 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {umkms.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={isAdmin ? 7 : 6}
                                            className="py-12 text-center text-(--charcoal-soft)"
                                        >
                                            Tidak ada UMKM ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    umkms.data.map((umkm) => (
                                        <TableRow
                                            key={umkm.id}
                                            className="border-(--line) transition-colors hover:bg-(--cream-warm)"
                                        >
                                            <TableCell className="pl-6 max-w-[240px] md:max-w-[300px]">
                                                <div className="flex items-center gap-3">
                                                    {umkm.primary_media ? (
                                                        <img
                                                            src={umkm.primary_media.file_path.startsWith('http') ? umkm.primary_media.file_path : `/storage/${umkm.primary_media.file_path}`}
                                                            alt={umkm.name}
                                                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--forest-mist)">
                                                            <span className="text-xs font-semibold text-(--forest)">
                                                                {umkm.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-medium text-[oklch(0.22_0.01_85)]" title={umkm.name}>
                                                            {umkm.name}
                                                        </p>
                                                        <p className="truncate text-xs text-(--charcoal-soft)">
                                                            {umkm.price_range ? `Harga: ${umkm.price_range}` : `/${umkm.slug}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[160px] text-sm text-(--charcoal-soft)">
                                                <p className="truncate" title={umkm.owner_name ?? '—'}>
                                                    {umkm.owner_name ?? '—'}
                                                </p>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <Badge variant="outline" className="capitalize text-xs">
                                                    {categories.find(c => c.value === umkm.category)?.label ?? umkm.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-sm text-(--charcoal-soft)">
                                                <div className="flex flex-col gap-0.5">
                                                    <span>{umkm.contact_phone ?? '—'}</span>
                                                    {umkm.gmaps_link && (
                                                        <a 
                                                            href={umkm.gmaps_link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                                        >
                                                            <MapPin className="h-3 w-3" />
                                                            Google Maps
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {umkm.status === 'published' ? (
                                                    <Badge className="border-0 bg-(--forest-mist) text-(--forest-deep) hover:bg-(--forest-mist)">
                                                        Terbit
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Draft</Badge>
                                                )}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    <Switch
                                                        checked={umkm.status === 'published'}
                                                        onCheckedChange={() => toggleStatus(umkm)}
                                                        aria-label={`Toggle status ${umkm.name}`}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex justify-end gap-1">
                                                     <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/umkms/${umkm.slug}/edit`} title="Edit UMKM">
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                     </Button>
                                                     {isAdmin && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setUmkmToDelete(umkm)}
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
                        {umkms.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-(--line) px-6 py-4">
                                <p className="text-sm text-(--charcoal-soft)">
                                    {umkms.from}–{umkms.to} dari {umkms.total} UMKM
                                </p>
                                <div className="flex gap-2">
                                    {umkms.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={link.active ? 'bg-(--forest) hover:bg-(--forest-deep)' : ''}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog Delete Confirm */}
                <AlertDialog
                    open={!!umkmToDelete}
                    onOpenChange={(o) => !o && setUmkmToDelete(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Apakah Anda yakin?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda akan menghapus UMKM{' '}
                                <strong>{umkmToDelete?.name}</strong>. Data yang
                                sudah dihapus akan masuk ke keranjang sampah
                                (soft delete).
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Ya, Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}

UmkmsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
