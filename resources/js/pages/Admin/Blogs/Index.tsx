import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
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
import type { Blog, BreadcrumbItem, PaginatedData, Village } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Blog', href: '/admin/blogs' },
];

type BlogWithRelations = Blog & {
    author?: { id: number; name: string } | null;
    village?: { id: number; name: string } | null;
};

type Props = {
    blogs: PaginatedData<BlogWithRelations>;
    villages: Pick<Village, 'id' | 'name'>[];
    filters: { search?: string; status?: string; village_id?: string };
    isAdmin: boolean;
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogsIndex({ blogs, villages, filters, isAdmin }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [blogToDelete, setBlogToDelete] = useState<BlogWithRelations | null>(null);
    const [blogToView, setBlogToView] = useState<BlogWithRelations | null>(null);

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            router.get('/admin/blogs', { ...filters, ...params }, { preserveState: true, replace: true });
        },
        [filters],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const toggleStatus = (blog: Blog) => {
        const newStatus = blog.status === 'published' ? 'draft' : 'published';
        router.patch(`/admin/blogs/${blog.slug}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const confirmDelete = () => {
        if (blogToDelete) {
            router.delete(`/admin/blogs/${blogToDelete.slug}`, {
                preserveScroll: true,
                onSuccess: () => setBlogToDelete(null),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Blog" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">Manajemen Blog</h1>
                        <p className="mt-1 text-sm text-[oklch(0.48_0.01_85)]">{blogs.total} artikel</p>
                    </div>
                    <Button asChild className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]">
                        <Link href="/admin/blogs/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tulis Artikel
                        </Link>
                    </Button>
                </div>

                {/* Filter */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardContent className="flex flex-wrap gap-3 pt-4">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2 min-w-48">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.48_0.01_85)]" />
                                <Input placeholder="Cari judul artikel..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                        <CardTitle className="font-display text-base text-[oklch(0.24_0.05_145)]">Daftar Artikel</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-[oklch(0.22_0.01_85/8%)] hover:bg-transparent">
                                    <TableHead className="pl-6">Judul</TableHead>
                                    {isAdmin && <TableHead>Desa</TableHead>}
                                    <TableHead>Penulis</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead>Terbit?</TableHead>}
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="pr-6 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 8 : 6} className="py-12 text-center text-[oklch(0.48_0.01_85)]">
                                            Tidak ada artikel ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    blogs.data.map((blog) => (
                                        <TableRow key={blog.id} className="border-[oklch(0.22_0.01_85/8%)] transition-colors hover:bg-[oklch(0.97_0.01_85)]">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    {blog.cover_image ? (
                                                        <img src={`/storage/${blog.cover_image}`} alt={blog.title} className="h-9 w-9 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.92_0.02_145)]">
                                                            <FileText className="h-4 w-4 text-[oklch(0.38_0.08_145)]" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-[oklch(0.22_0.01_85)] max-w-[200px] truncate">{blog.title}</p>
                                                        <p className="text-xs text-[oklch(0.48_0.01_85)]">/{blog.slug}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                    {blog.village?.name ?? '—'}
                                                </TableCell>
                                            )}
                                            <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                {blog.author?.name ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                {blog.views_count.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                {blog.status === 'published' ? (
                                                    <Badge className="border-0 bg-[oklch(0.92_0.02_145)] text-[oklch(0.24_0.05_145)] hover:bg-[oklch(0.92_0.02_145)]">Terbit</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Draft</Badge>
                                                )}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    <Switch
                                                        checked={blog.status === 'published'}
                                                        onCheckedChange={() => toggleStatus(blog)}
                                                        aria-label={`Toggle status ${blog.title}`}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="text-sm text-[oklch(0.48_0.01_85)]">
                                                {formatDate(blog.created_at)}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setBlogToView(blog)} title="Lihat Detail">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/blogs/${blog.slug}/edit`} title="Edit">
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setBlogToDelete(blog)}
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

                        {blogs.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[oklch(0.22_0.01_85/8%)] px-6 py-4">
                                <p className="text-sm text-[oklch(0.48_0.01_85)]">{blogs.from}–{blogs.to} dari {blogs.total}</p>
                                <div className="flex gap-2">
                                    {blogs.links.map((link, i) => (
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
                <Dialog open={!!blogToView} onOpenChange={(o) => !o && setBlogToView(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{blogToView?.title}</DialogTitle>
                            <DialogDescription>Detail informasi artikel</DialogDescription>
                        </DialogHeader>
                        {blogToView && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Penulis</span>
                                    <span className="col-span-3 text-sm">{blogToView.author?.name ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Desa</span>
                                    <span className="col-span-3 text-sm">{blogToView.village?.name ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Tanggal</span>
                                    <span className="col-span-3 text-sm">{formatDate(blogToView.created_at)}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)]">Views</span>
                                    <span className="col-span-3 text-sm">{blogToView.views_count.toLocaleString('id-ID')} views</span>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <span className="text-right text-sm font-medium text-[oklch(0.48_0.01_85)] mt-1">Cuplikan</span>
                                    <span className="col-span-3 text-sm line-clamp-4 text-muted-foreground">
                                        {blogToView.content.replace(/<[^>]*>?/gm, '')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Dialog Delete Confirm */}
                <AlertDialog open={!!blogToDelete} onOpenChange={(o) => !o && setBlogToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda akan menghapus artikel <strong>{blogToDelete?.title}</strong>. Data yang sudah dihapus akan masuk ke keranjang sampah (soft delete).
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

BlogsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
