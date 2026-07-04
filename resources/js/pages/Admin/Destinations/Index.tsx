import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BreadcrumbItem, Destination, PaginatedData, Village } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Destinasi', href: '/admin/destinations' },
];

const CATEGORY_LABELS: Record<string, string> = {
    alam: 'Wisata Alam',
    budaya: 'Wisata Budaya',
    buatan: 'Wisata Buatan',
};

const CATEGORY_COLORS: Record<string, string> = {
    alam: 'bg-emerald-100 text-emerald-800 border-0',
    budaya: 'bg-amber-100 text-amber-800 border-0',
    buatan: 'bg-blue-100 text-blue-800 border-0',
};

type Props = {
    destinations: PaginatedData<Destination & { primary_media?: { file_path: string } | null; village?: { id: number; name: string } | null }>;
    villages: Pick<Village, 'id' | 'name'>[];
    filters: { search?: string; status?: string; category?: string; village_id?: string };
    isAdmin: boolean;
};

export default function DestinationsIndex({ destinations, villages, filters, isAdmin }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [destToDelete, setDestToDelete] = useState<Destination | null>(null);
    const [destToView, setDestToView] = useState<Destination | null>(null);

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            router.get('/admin/destinations', { ...filters, ...params }, { preserveState: true, replace: true });
        },
        [filters],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const toggleStatus = (destination: Destination) => {
        const newStatus = destination.status === 'published' ? 'draft' : 'published';
        router.patch(`/admin/destinations/${destination.slug}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const confirmDelete = () => {
        if (destToDelete) {
            router.delete(`/admin/destinations/${destToDelete.slug}`, {
                preserveScroll: true,
                onSuccess: () => setDestToDelete(null),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Destinasi" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">
                            Manajemen Destinasi
                        </h1>
                        <p className="mt-1 text-sm text-[oklch(0.48_0.01_85)]">
                            {destinations.total} destinasi terdaftar
                        </p>
                    </div>
                    <Button asChild className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]">
                        <Link href="/admin/destinations/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Destinasi
                        </Link>
                    </Button>
                </div>

                {/* Filter */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardContent className="flex flex-wrap gap-3 pt-4">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2 min-w-48">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.48_0.01_85)]" />
                                <Input
                                    placeholder="Cari nama destinasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" variant="outline">Cari</Button>
                        </form>

                        <Select value={filters.status || 'all'} onValueChange={(v) => applyFilter({ status: v === 'all' ? '' : v })}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="published">Terbit</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.category || 'all'} onValueChange={(v) => applyFilter({ category: v === 'all' ? '' : v })}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                <SelectItem value="alam">Wisata Alam</SelectItem>
                                <SelectItem value="budaya">Wisata Budaya</SelectItem>
                                <SelectItem value="buatan">Wisata Buatan</SelectItem>
                            </SelectContent>
                        </Select>

                        {isAdmin && (
                            <Select value={filters.village_id || 'all'} onValueChange={(v) => applyFilter({ village_id: v === 'all' ? '' : v })}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Desa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Desa</SelectItem>
                                    {villages.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader className="pb-0">
                        <CardTitle className="font-display text-base text-[oklch(0.24_0.05_145)]">
                            Daftar Destinasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-[oklch(0.22_0.01_85/8%)] hover:bg-transparent">
                                    <TableHead className="pl-6">Nama</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    {isAdmin && <TableHead>Desa</TableHead>}
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead>Terbit?</TableHead>}
                                    <TableHead className="pr-6 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {destinations.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 7 : 5} className="py-12 text-center text-[oklch(0.48_0.01_85)]">
                                            Tidak ada destinasi ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    destinations.data.map((dest) => (
                                        <TableRow key={dest.id} className="border-[oklch(0.22_0.01_85/8%)] transition-colors hover:bg-[oklch(0.97_0.01_85)]">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    {dest.primary_media ? (
                                                        <img src={`/storage/${dest.primary_media.file_path}`} alt={dest.name} className="h-9 w-9 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.92_0.02_145)]">
                                                            <MapPin className="h-4 w-4 text-[oklch(0.38_0.08_145)]" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-[oklch(0.22_0.01_85)]">{dest.name}</p>
                                                        <p className="text-xs text-[oklch(0.48_0.01_85)]">/{dest.slug}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={CATEGORY_COLORS[dest.category] ?? ''}>
                                                    {CATEGORY_LABELS[dest.category] ?? dest.category}
                                                </Badge>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                    {dest.village?.name ?? '—'}
                                                </TableCell>
                                            )}
                                            <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                {Number(dest.ticket_price) === 0 ? 'Gratis' : `Rp ${Number(dest.ticket_price).toLocaleString('id-ID')}`}
                                            </TableCell>
                                            <TableCell>
                                                {dest.status === 'published' ? (
                                                    <Badge className="border-0 bg-[oklch(0.92_0.02_145)] text-[oklch(0.24_0.05_145)] hover:bg-[oklch(0.92_0.02_145)]">Terbit</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Draft</Badge>
                                                )}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    <Switch
                                                        checked={dest.status === 'published'}
                                                        onCheckedChange={() => toggleStatus(dest)}
                                                        aria-label={`Toggle status ${dest.name}`}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setDestToView(dest)} title="Lihat Detail">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/destinations/${dest.slug}/edit`} title="Edit">
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setDestToDelete(dest)}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {destinations.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[oklch(0.22_0.01_85/8%)] px-6 py-4">
                                <p className="text-sm text-[oklch(0.48_0.01_85)]">
                                    {destinations.from}–{destinations.to} dari {destinations.total}
                                </p>
                                <div className="flex gap-2">
                                    {destinations.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={link.active ? 'bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]' : ''}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog Detail View */}
                <Dialog open={!!destToView} onOpenChange={(o) => !o && setDestToView(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{destToView?.name}</DialogTitle>
                            <DialogDescription>Detail informasi destinasi</DialogDescription>
                        </DialogHeader>
                        {destToView && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Kategori</span>
                                    <span className="col-span-3 text-sm">{CATEGORY_LABELS[destToView.category] ?? destToView.category}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Desa</span>
                                    <span className="col-span-3 text-sm">{destToView.village?.name ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Harga Tiket</span>
                                    <span className="col-span-3 text-sm flex flex-col gap-1">
                                        {Number(destToView.ticket_price) === 0 ? 'Gratis' : `Rp ${Number(destToView.ticket_price).toLocaleString('id-ID')}`}
                                        {destToView.ticket_info && <span className="text-xs text-muted-foreground">{destToView.ticket_info}</span>}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Jam Operasional</span>
                                    <span className="col-span-3 text-sm">
                                        {destToView.open_time && destToView.close_time 
                                            ? `${destToView.open_time} - ${destToView.close_time}` 
                                            : '—'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Hari Operasional</span>
                                    <span className="col-span-3 text-sm">{destToView.operational_days || '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Fasilitas</span>
                                    <span className="col-span-3 text-sm flex flex-wrap gap-1">
                                        {destToView.facilities && destToView.facilities.length > 0 
                                            ? destToView.facilities.map((f, i) => <Badge key={i} variant="outline" className="text-xs font-normal">{f}</Badge>) 
                                            : '—'}
                                    </span>
                                </div>
                                {destToView.description && (
                                    <div className="grid grid-cols-4 items-start gap-4 border-t border-[oklch(0.22_0.01_85/8%)] pt-4 mt-2">
                                        <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Deskripsi</span>
                                        <div 
                                            className="col-span-3 text-sm prose prose-sm max-w-none text-[oklch(0.22_0.01_85)] line-clamp-6"
                                            dangerouslySetInnerHTML={{ __html: destToView.description }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Dialog Delete Confirm */}
                <AlertDialog open={!!destToDelete} onOpenChange={(o) => !o && setDestToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda akan menghapus destinasi <strong>{destToDelete?.name}</strong>. Data yang sudah dihapus akan masuk ke keranjang sampah (soft delete).
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Ya, Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}

DestinationsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
