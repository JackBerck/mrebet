import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import type { BreadcrumbItem, PaginatedData, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengguna', href: '/admin/users' },
];

type Props = {
    users: PaginatedData<User>;
    filters: { search?: string; status?: string };
    auth: { user: User };
};

export default function UsersIndex({ users, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/users',
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

    const toggleStatus = (user: User) => {
        router.patch(
            `/admin/users/${user.id}/status`,
            { is_active: !user.is_active },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-(--forest-deep)">
                            Manajemen Pengguna
                        </h1>
                        <p className="mt-1 text-sm text-(--charcoal-soft)">
                            {users.total} pengguna terdaftar
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-(--forest) hover:bg-(--forest-deep)"
                    >
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Pengguna
                        </Link>
                    </Button>
                </div>

                <Card className="border-(--line) shadow-none">
                    <CardContent className="p-0">
                        {/* Filters */}
                        <div className="flex flex-col gap-4 border-b border-(--line) p-6 sm:flex-row sm:items-center sm:justify-between">
                            <form
                                onSubmit={handleSearch}
                                className="relative max-w-sm flex-1"
                            >
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau email..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
                            <Select
                                value={filters.status ?? 'all'}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Aktif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Nonaktif
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Nama Pengguna</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aktif?</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            Tidak ada pengguna ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="font-medium text-(--forest-deep)">
                                                    {user.full_name}
                                                </div>
                                                {auth.user.id === user.id && (
                                                    <span className="mt-1 inline-block rounded-full bg-(--forest-mist) px-2 py-0.5 text-[10px] font-semibold tracking-wider text-(--forest) uppercase">
                                                        Anda
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm whitespace-nowrap text-(--charcoal-soft)">
                                                <div className="flex flex-col gap-0.5">
                                                    <span>{user.email}</span>
                                                    <span>
                                                        {user.phone_number ??
                                                            '—'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.is_active ? (
                                                    <Badge className="border-0 bg-(--forest-mist) text-(--forest-deep) hover:bg-(--forest-mist)">
                                                        Aktif
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Nonaktif
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={user.is_active}
                                                    onCheckedChange={() =>
                                                        toggleStatus(user)
                                                    }
                                                    disabled={
                                                        auth.user.id === user.id
                                                    }
                                                    aria-label={`Toggle status ${user.full_name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/users/${user.id}/edit`}
                                                            title="Edit Pengguna"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-(--line) px-6 py-4">
                                <p className="text-sm text-(--charcoal-soft)">
                                    {users.from}–{users.to} dari {users.total}{' '}
                                    pengguna
                                </p>
                                <div className="flex gap-2">
                                    {users.links.map((link, i) => (
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

UsersIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
