import { Head, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Compass,
    FileText,
    HelpCircle,
    MapPin,
    Shield,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Auth } from '@/types';

type PageProps = { auth: Auth };

export default function Guide() {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <>
            <Head title="Panduan" />
            <h1 className="sr-only">Panduan Penggunaan</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Panduan"
                    description="Panduan penggunaan sistem E-Desa Digital Mrebet"
                />

                {/* Role info */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Shield className="h-4 w-4 text-[oklch(0.38_0.08_145)]" />
                            Peran Anda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            {isAdmin ? (
                                <Badge className="border-0 bg-[oklch(0.92_0.02_145)] text-[oklch(0.24_0.05_145)]">
                                    Admin
                                </Badge>
                            ) : (
                                <Badge className="border-0 bg-blue-100 text-blue-800">
                                    Manager
                                </Badge>
                            )}
                            <p className="text-sm text-muted-foreground">
                                {isAdmin
                                    ? 'Anda memiliki akses penuh ke seluruh data semua desa.'
                                    : 'Anda hanya dapat mengelola data yang berelasi dengan desa Anda.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Role comparison */}
                <div>
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[oklch(0.24_0.05_145)]">
                        <Users className="h-4 w-4" /> Perbedaan Peran
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Badge className="border-0 bg-[oklch(0.92_0.02_145)] text-xs text-[oklch(0.24_0.05_145)]">
                                        Admin
                                    </Badge>
                                    Superadmin
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>✅ Kelola semua desa</li>
                                    <li>
                                        ✅ Kelola semua destinasi, event & blog
                                    </li>
                                    <li>✅ Manajemen akun pengguna</li>
                                    <li>✅ Toggle status terbit konten</li>
                                    <li>✅ Akses statistik semua desa</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Badge className="border-0 bg-blue-100 text-xs text-blue-800">
                                        Manager
                                    </Badge>
                                    Manager Desa
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    <li>✅ Kelola profil desa sendiri</li>
                                    <li>✅ Tambah & edit destinasi desa</li>
                                    <li>✅ Tambah & edit event desa</li>
                                    <li>✅ Tulis & edit artikel blog desa</li>
                                    <li>❌ Tidak bisa akses desa lain</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator />

                {/* Feature guide */}
                <div>
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[oklch(0.24_0.05_145)]">
                        <BookOpen className="h-4 w-4" /> Panduan Fitur
                    </h2>
                    <div className="space-y-3">
                        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                            <CardHeader className="pb-1">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Compass className="h-4 w-4 text-emerald-600" />{' '}
                                    Destinasi Wisata
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Tambahkan tempat wisata desa Anda lengkap
                                    dengan foto, koordinat peta, harga tiket,
                                    jam operasional, dan fasilitas yang
                                    tersedia. Destinasi perlu diatur ke status{' '}
                                    <strong>Terbit</strong> agar tampil di
                                    halaman publik.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                            <CardHeader className="pb-1">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <CalendarDays className="h-4 w-4 text-amber-600" />{' '}
                                    Event / Acara
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Publikasikan acara atau kegiatan desa dengan
                                    tanggal, waktu, lokasi, dan informasi kontak
                                    penyelenggara. Event yang sudah lewat
                                    tanggalnya tetap tersimpan sebagai arsip.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                            <CardHeader className="pb-1">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4 text-blue-600" />{' '}
                                    Artikel Blog
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Tulis berita atau informasi seputar desa
                                    menggunakan editor teks kaya (rich text).
                                    Simpan sebagai <strong>Draft</strong> dulu
                                    sebelum dipublikasikan.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                            <CardHeader className="pb-1">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin className="h-4 w-4 text-rose-600" />{' '}
                                    Profil Desa
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Lengkapi informasi desa seperti deskripsi,
                                    koordinat, foto utama, dan kontak. Data ini
                                    akan tampil di halaman utama profil desa.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator />

                {/* Tips */}
                <div>
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[oklch(0.24_0.05_145)]">
                        <HelpCircle className="h-4 w-4" /> Tips Umum
                    </h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            📸 Gunakan foto berkualitas tinggi (maks. 5MB per
                            gambar) untuk kesan pertama yang baik.
                        </li>
                        <li>
                            🗺️ Pastikan koordinat peta akurat agar pengunjung
                            mudah menemukan lokasi.
                        </li>
                        <li>
                            📝 Isi deskripsi dengan lengkap dan menarik untuk
                            meningkatkan ketertarikan pengunjung.
                        </li>
                        <li>
                            🔄 Perbarui konten secara rutin agar informasi tetap
                            relevan dan terkini.
                        </li>
                        <li>
                            👁️ Preview konten sebelum dipublikasikan dengan
                            menyimpannya sebagai Draft terlebih dahulu.
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

Guide.layout = {
    breadcrumbs: [
        {
            title: 'Panduan',
            href: '/settings/guide',
        },
    ],
};
