import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DatePicker } from '@/components/admin/date-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BreadcrumbItem, Event, PaginatedData, Village } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Event', href: '/admin/events' },
];

type Props = {
    events: PaginatedData<Event & { primary_media?: { file_path: string } | null }>;
    villages: Pick<Village, 'id' | 'name'>[];
    filters: { search?: string; status?: string; village_id?: string; date_from?: string; date_to?: string };
    isAdmin: boolean;
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventsIndex({ events, villages, filters, isAdmin }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [eventToView, setEventToView] = useState<Event | null>(null);

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            router.get('/admin/events', { ...filters, ...params }, { preserveState: true, replace: true });
        },
        [filters],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const toggleStatus = (event: Event) => {
        const newStatus = event.status === 'published' ? 'draft' : 'published';
        router.patch(`/admin/events/${event.slug}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const confirmDelete = () => {
        if (eventToDelete) {
            router.delete(`/admin/events/${eventToDelete.slug}`, {
                preserveScroll: true,
                onSuccess: () => setEventToDelete(null),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Event" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">Manajemen Event</h1>
                        <p className="mt-1 text-sm text-[oklch(0.48_0.01_85)]">{events.total} event terdaftar</p>
                    </div>
                    <Button asChild className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]">
                        <Link href="/admin/events/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Event
                        </Link>
                    </Button>
                </div>

                {/* Filter */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardContent className="flex flex-wrap gap-3 pt-4">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2 min-w-48">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.48_0.01_85)]" />
                                <Input placeholder="Cari judul event..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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

                        <div className="flex items-center gap-2">
                            <div className="w-[145px]">
                                <DatePicker
                                    value={filters.date_from ?? ''}
                                    onChange={(date) => applyFilter({ date_from: date })}
                                    placeholder="Dari tgl"
                                />
                            </div>
                            <span className="text-sm text-[oklch(0.48_0.01_85)]">–</span>
                            <div className="w-[145px]">
                                <DatePicker
                                    value={filters.date_to ?? ''}
                                    onChange={(date) => applyFilter({ date_to: date })}
                                    placeholder="Sampai tgl"
                                />
                            </div>
                        </div>

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
                        <CardTitle className="font-display text-base text-[oklch(0.24_0.05_145)]">Daftar Event</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-[oklch(0.22_0.01_85/8%)] hover:bg-transparent">
                                    <TableHead className="pl-6">Judul Event</TableHead>
                                    {isAdmin && <TableHead>Desa</TableHead>}
                                    <TableHead>Tgl Mulai</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead>Terbit?</TableHead>}
                                    <TableHead className="pr-6 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 7 : 5} className="py-12 text-center text-[oklch(0.48_0.01_85)]">
                                            Tidak ada event ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    events.data.map((event) => (
                                        <TableRow key={event.id} className="border-[oklch(0.22_0.01_85/8%)] transition-colors hover:bg-[oklch(0.97_0.01_85)]">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    {event.primary_media ? (
                                                        <img src={`/storage/${event.primary_media.file_path}`} alt={event.title} className="h-9 w-9 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.92_0.02_145)]">
                                                            <Calendar className="h-4 w-4 text-[oklch(0.38_0.08_145)]" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-[oklch(0.22_0.01_85)]">{event.title}</p>
                                                        <p className="text-xs text-[oklch(0.48_0.01_85)]">/{event.slug}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                    {event.village?.name ?? '—'}
                                                </TableCell>
                                            )}
                                            <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                {formatDate(event.start_date)}
                                                {event.start_time && <span className="ml-1 text-xs">{event.start_time}</span>}
                                            </TableCell>
                                            <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                {Number(event.ticket_price) === 0 ? 'Gratis' : `Rp ${Number(event.ticket_price).toLocaleString('id-ID')}`}
                                            </TableCell>
                                            <TableCell>
                                                {event.status === 'published' ? (
                                                    <Badge className="border-0 bg-[oklch(0.92_0.02_145)] text-[oklch(0.24_0.05_145)] hover:bg-[oklch(0.92_0.02_145)]">Terbit</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Draft</Badge>
                                                )}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    <Switch
                                                        checked={event.status === 'published'}
                                                        onCheckedChange={() => toggleStatus(event)}
                                                        aria-label={`Toggle status ${event.title}`}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setEventToView(event)} title="Lihat Detail">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/events/${event.slug}/edit`} title="Edit">
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setEventToDelete(event)}
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

                        {events.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[oklch(0.22_0.01_85/8%)] px-6 py-4">
                                <p className="text-sm text-[oklch(0.48_0.01_85)]">{events.from}–{events.to} dari {events.total}</p>
                                <div className="flex gap-2">
                                    {events.links.map((link, i) => (
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
                <Dialog open={!!eventToView} onOpenChange={(o) => !o && setEventToView(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{eventToView?.title}</DialogTitle>
                            <DialogDescription>Detail informasi event</DialogDescription>
                        </DialogHeader>
                        {eventToView && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Mulai</span>
                                    <span className="col-span-3 text-sm">{formatDate(eventToView.start_date)} {eventToView.start_time}</span>
                                </div>
                                {eventToView.end_date && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Selesai</span>
                                        <span className="col-span-3 text-sm">{formatDate(eventToView.end_date)} {eventToView.end_time}</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Harga Tiket</span>
                                    <span className="col-span-3 text-sm">
                                        {Number(eventToView.ticket_price) === 0 ? 'Gratis' : `Rp ${Number(eventToView.ticket_price).toLocaleString('id-ID')}`}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Desa</span>
                                    <span className="col-span-3 text-sm">{eventToView.village?.name || '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Penyelenggara</span>
                                    <span className="col-span-3 text-sm">{eventToView.organizer || '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Kontak Person</span>
                                    <span className="col-span-3 text-sm">{eventToView.contact_person || '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Instagram</span>
                                    <span className="col-span-3 text-sm">{eventToView.instagram || '—'}</span>
                                </div>
                                {eventToView.description && (
                                    <div className="grid grid-cols-4 items-start gap-4 border-t border-[oklch(0.22_0.01_85/8%)] pt-4 mt-2">
                                        <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Deskripsi</span>
                                        <div 
                                            className="col-span-3 text-sm prose prose-sm max-w-none text-[oklch(0.22_0.01_85)] line-clamp-6"
                                            dangerouslySetInnerHTML={{ __html: eventToView.description }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Dialog Delete Confirm */}
                <AlertDialog open={!!eventToDelete} onOpenChange={(o) => !o && setEventToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda akan menghapus event <strong>{eventToDelete?.title}</strong>. Data yang sudah dihapus akan masuk ke keranjang sampah (soft delete).
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

EventsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
