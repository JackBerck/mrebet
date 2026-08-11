import { Head, useForm } from '@inertiajs/react';
import { Building2, Globe, Loader2, Mail, MapPin, Phone, Save, Share2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

interface Props {
    settings: {
        site_name: string;
        contact_phone: string;
        contact_whatsapp: string;
        contact_email: string;
        contact_address: string;
        gmaps_link: string;
        operational_hours: string;
        instagram_url: string;
        facebook_url: string;
        youtube_url: string;
        tiktok_url: string;
    };
}

export default function AdminSettingsPage({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name || 'Desa Wisata Serayu Larangan',
        contact_phone: settings.contact_phone || '+62 813-9848-0422',
        contact_whatsapp: settings.contact_whatsapp || '6281398480422',
        contact_email: settings.contact_email || 'info@serayularangan.desa.id',
        contact_address: settings.contact_address || 'Desa Serayu Larangan, Kec. Mrebet, Kab. Purbalingga, Jawa Tengah 53352',
        gmaps_link: settings.gmaps_link || 'https://maps.app.goo.gl/FMsGayqxuncMJUuU7',
        operational_hours: settings.operational_hours || 'Senin - Minggu: 08.00 - 17.00 WIB',
        instagram_url: settings.instagram_url || 'https://instagram.com',
        facebook_url: settings.facebook_url || 'https://facebook.com',
        youtube_url: settings.youtube_url || 'https://youtube.com',
        tiktok_url: settings.tiktok_url || 'https://tiktok.com',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings/site', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Pengaturan Kontak & Website" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-xl sm:text-2xl font-semibold text-(--forest-deep)">
                            Pengaturan Kontak & Website
                        </h1>
                        <p className="mt-0.5 text-xs sm:text-sm text-(--charcoal-soft)">
                            Kelola informasi kontak, alamat, jam operasional, dan tautan sosial media desa wisata.
                        </p>
                    </div>
                </div>

                {/* Section 1: Identitas & Kontak Utama */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep) flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-(--forest)" />
                            Identitas & Kontak Utama
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Nama situs dan informasi kontak resmi yang tampil di seluruh website publik.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="site_name">Nama Situs / Branding Desa</Label>
                            <Input
                                id="site_name"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                placeholder="contoh: Desa Wisata Serayu Larangan"
                            />
                            {errors.site_name && <p className="text-xs text-destructive">{errors.site_name}</p>}
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contact_phone" className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-(--forest)" />
                                    Nomor Telepon Kontak
                                </Label>
                                <Input
                                    id="contact_phone"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    placeholder="contoh: +62 813-9848-0422"
                                />
                                {errors.contact_phone && <p className="text-xs text-destructive">{errors.contact_phone}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contact_whatsapp" className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-emerald-600" />
                                    Nomor WhatsApp (Format: 628xxx)
                                </Label>
                                <Input
                                    id="contact_whatsapp"
                                    value={data.contact_whatsapp}
                                    onChange={(e) => setData('contact_whatsapp', e.target.value)}
                                    placeholder="contoh: 6281398480422"
                                />
                                {errors.contact_whatsapp && <p className="text-xs text-destructive">{errors.contact_whatsapp}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contact_email" className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    Email Resmi
                                </Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    placeholder="contoh: info@serayularangan.desa.id"
                                />
                                {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="operational_hours">Jam Operasional / Kunjungan</Label>
                                <Input
                                    id="operational_hours"
                                    value={data.operational_hours}
                                    onChange={(e) => setData('operational_hours', e.target.value)}
                                    placeholder="contoh: Senin - Minggu: 08.00 - 17.00 WIB"
                                />
                                {errors.operational_hours && <p className="text-xs text-destructive">{errors.operational_hours}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="contact_address" className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-rose-600" />
                                Alamat Lengkap Kantor / Sekretariat Desa
                            </Label>
                            <Textarea
                                id="contact_address"
                                rows={2}
                                value={data.contact_address}
                                onChange={(e) => setData('contact_address', e.target.value)}
                                placeholder="Desa Serayu Larangan, Kec. Mrebet, Kab. Purbalingga, Jawa Tengah 53352"
                            />
                            {errors.contact_address && <p className="text-xs text-destructive">{errors.contact_address}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="gmaps_link" className="flex items-center gap-1.5">
                                <Globe className="h-4 w-4 text-indigo-600" />
                                Link Google Maps Alamat
                            </Label>
                            <Input
                                id="gmaps_link"
                                value={data.gmaps_link}
                                onChange={(e) => setData('gmaps_link', e.target.value)}
                                placeholder="https://maps.app.goo.gl/FMsGayqxuncMJUuU7"
                            />
                            {errors.gmaps_link && <p className="text-xs text-destructive">{errors.gmaps_link}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Media Sosial */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep) flex items-center gap-2">
                            <Share2 className="h-5 w-5 text-(--forest)" />
                            Akun Media Sosial Resmi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Tautan akun media sosial yang tampil di bagian footer website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="instagram_url">Link Instagram</Label>
                            <Input
                                id="instagram_url"
                                value={data.instagram_url}
                                onChange={(e) => setData('instagram_url', e.target.value)}
                                placeholder="https://instagram.com/desawisataserayularangan"
                            />
                            {errors.instagram_url && <p className="text-xs text-destructive">{errors.instagram_url}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="facebook_url">Link Facebook</Label>
                            <Input
                                id="facebook_url"
                                value={data.facebook_url}
                                onChange={(e) => setData('facebook_url', e.target.value)}
                                placeholder="https://facebook.com/desawisataserayularangan"
                            />
                            {errors.facebook_url && <p className="text-xs text-destructive">{errors.facebook_url}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="youtube_url">Link YouTube</Label>
                            <Input
                                id="youtube_url"
                                value={data.youtube_url}
                                onChange={(e) => setData('youtube_url', e.target.value)}
                                placeholder="https://youtube.com/@desawisataserayularangan"
                            />
                            {errors.youtube_url && <p className="text-xs text-destructive">{errors.youtube_url}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tiktok_url">Link TikTok</Label>
                            <Input
                                id="tiktok_url"
                                value={data.tiktok_url}
                                onChange={(e) => setData('tiktok_url', e.target.value)}
                                placeholder="https://tiktok.com/@desawisataserayularangan"
                            />
                            {errors.tiktok_url && <p className="text-xs text-destructive">{errors.tiktok_url}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Sticky Submit Bar (Sesuai Form UMKM) */}
                <div className="sticky bottom-0 -mx-3 sm:-mx-6 flex items-center justify-between border-t border-(--line) bg-white/90 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-(--charcoal-soft)">
                        Perubahan pengaturan kontak website
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-(--forest) hover:bg-(--forest-deep)"
                            size="sm"
                        >
                            {processing ? (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-1.5 h-4 w-4" />
                            )}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

AdminSettingsPage.layout = (page: React.ReactNode) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengaturan Kontak & Web', href: '/admin/settings/site' },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
