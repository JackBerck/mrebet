import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

type Props = {
    user: User | null;
    isAdmin: boolean;
};

export default function UserForm({ user, isAdmin }: Props) {
    const isEditing = !!user;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengguna', href: '/admin/users' },
        { title: isEditing ? 'Edit Pengguna' : 'Tambah Pengguna', href: '#' },
    ];

    const { data, setData, post, patch, processing, errors } = useForm({
        full_name: user?.full_name ?? '',
        email: user?.email ?? '',
        phone_number: user?.phone_number ?? '',
        password: '',
        password_confirmation: '',
        is_active: user?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            patch(`/admin/users/${user.id}`, {
                preserveScroll: true,
            });
        } else {
            post('/admin/users', {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title={isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-(--forest-deep)">
                            {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}
                        </h1>
                        <p className="mt-1 text-sm text-(--charcoal-soft)">
                            {isEditing
                                ? 'Ubah informasi akun pengguna.'
                                : 'Tambahkan akun admin baru ke sistem.'}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6 max-w-2xl">
                    <Card className="border-(--line) shadow-none">
                        <CardHeader>
                            <CardTitle className="font-display text-lg text-(--forest-deep)">
                                Informasi Dasar
                            </CardTitle>
                            <CardDescription>
                                Detail profil dan kontak pengguna.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="full_name" className="text-sm font-medium">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="full_name"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                />
                                {errors.full_name && (
                                    <p className="text-xs text-red-500">{errors.full_name}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Contoh: budi@desa.id"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="phone_number" className="text-sm font-medium">
                                    Nomor Telepon
                                </Label>
                                <Input
                                    id="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                />
                                {errors.phone_number && (
                                    <p className="text-xs text-red-500">{errors.phone_number}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-(--line) shadow-none">
                        <CardHeader>
                            <CardTitle className="font-display text-lg text-(--forest-deep)">
                                Keamanan & Akses
                            </CardTitle>
                            <CardDescription>
                                {isEditing ? 'Kosongkan jika tidak ingin mengubah password.' : 'Atur kata sandi untuk akun ini.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password {!isEditing && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                    Konfirmasi Password {!isEditing && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-xs text-red-500">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex flex-row items-center justify-between rounded-lg border border-(--line) p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Akun Aktif</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Izinkan pengguna ini masuk ke sistem.
                                    </p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(c) => setData('is_active', c)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sticky Submit */}
                    <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-(--line) bg-white/90 px-6 py-4 backdrop-blur-sm sm:mx-0 sm:rounded-b-lg">
                        <p className="text-sm text-(--charcoal-soft)">
                            Pastikan data sudah benar sebelum menyimpan.
                        </p>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-(--forest) hover:bg-(--forest-deep)"
                        >
                            {processing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Simpan Pengguna
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UserForm.layout = (page: React.ReactNode & { props: Props }) => {
    const user = page?.props?.user;
    const isEditing = !!user;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengguna', href: '/admin/users' },
        { title: isEditing ? 'Edit Pengguna' : 'Tambah Pengguna', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
