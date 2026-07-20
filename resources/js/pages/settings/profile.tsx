import { Head, router, usePage } from '@inertiajs/react';
import { Camera, Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    status?: string;
};

export default function Profile({ status }: { status?: string }) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const getInitials = useInitials();

    const [fullName, setFullName] = useState(user.full_name ?? '');
    const [phoneNumber, setPhoneNumber] = useState(user.phone_number ?? '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const avatarSrc =
        avatarPreview ?? (user.avatar ? `/storage/${user.avatar}` : undefined);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
return;
}

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('full_name', fullName);
        formData.append('phone_number', phoneNumber);

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        router.post('/settings/profile', formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profil berhasil diperbarui.');
                setAvatarFile(null);
                setAvatarPreview(null);
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];

                if (first) {
toast.error(first);
}
            },
            onFinish: () => setProcessing(false),
        });
    };

    const roleBadge =
        user.role === 'admin'
            ? {
                  label: 'Admin',
                  className:
                      'bg-(--forest-mist) text-(--forest-deep) border-0',
              }
            : {
                  label: 'Manager',
                  className: 'bg-blue-100 text-blue-800 border-0',
              };

    return (
        <>
            <Head title="Profil" />
            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profil"
                    description="Kelola informasi profil Anda"
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarSrc} alt={user.name} />
                                <AvatarFallback className="bg-(--forest-mist) text-xl text-(--forest-deep)">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-(--forest) text-white shadow-md transition-colors hover:bg-(--forest-deep)"
                                title="Ganti foto profil"
                            >
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {user.email}
                            </p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-1.5 text-xs text-(--forest) hover:underline"
                            >
                                Ganti foto profil
                            </button>
                        </div>
                    </div>

                    <Separator />

                    {/* Editable fields */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">
                                <UserIcon className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                                Nama Lengkap
                            </Label>
                            <Input
                                id="full_name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">
                                <Phone className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                                No. Telepon
                            </Label>
                            <Input
                                id="phone_number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Contoh: 08123456789"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-(--forest) hover:bg-(--forest-deep)"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        {status && (
                            <p className="text-sm text-green-600">{status}</p>
                        )}
                    </div>
                </form>

                <Separator />

                {/* Read-only info */}
                <div>
                    <Heading
                        variant="small"
                        title="Informasi Akun"
                        description="Data yang tidak dapat diubah"
                    />
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                            <Label className="flex items-center gap-1.5 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" /> Email
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={user.email}
                                    disabled
                                    className="bg-muted/40"
                                />
                                {user.email_verified_at ? (
                                    <Badge className="shrink-0 border-0 bg-(--forest-mist) text-xs text-(--forest-deep)">
                                        Terverifikasi
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="destructive"
                                        className="shrink-0 text-xs"
                                    >
                                        Belum Verifikasi
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="flex items-center gap-1.5 text-muted-foreground">
                                <Shield className="h-3.5 w-3.5" /> Peran
                            </Label>
                            <div className="flex h-9 items-center">
                                <Badge className={roleBadge.className}>
                                    {roleBadge.label}
                                </Badge>
                            </div>
                        </div>

                        {user.village_id && (
                            <div className="grid gap-1.5 sm:col-span-2">
                                <Label className="text-muted-foreground">
                                    Desa Kelolaan
                                </Label>
                                <Input
                                    value={
                                        ((user as Record<string, unknown>)
                                            .village_name as string) ??
                                        `ID Desa: ${user.village_id}`
                                    }
                                    disabled
                                    className="bg-muted/40"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profil',
            href: edit(),
        },
    ],
};
