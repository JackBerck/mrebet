import { Head, Link } from '@inertiajs/react';
import { Edit, MapPin, Phone, Globe, Tag, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { UmkmItem } from './index';

type Props = {
    umkm: UmkmItem & {
        description?: string;
        media?: { id: number; file_path: string; is_primary: boolean }[];
    };
    recentDestinations: any[];
    recentEvents: any[];
    recentBlogs: any[];
    isAdmin: boolean;
};

export default function UmkmShow({ umkm, recentDestinations, recentEvents, recentBlogs, isAdmin }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'UMKM & Kuliner', href: '/admin/umkms' },
        { title: umkm.name, href: '#' },
    ];

    const primaryMedia = umkm.media?.find((m) => m.is_primary) ?? umkm.media?.[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail UMKM — ${umkm.name}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-display text-2xl font-semibold text-(--forest-deep)">
                                {umkm.name}
                            </h1>
                            <Badge className={umkm.status === 'published' ? 'bg-(--forest-mist) text-(--forest-deep)' : 'bg-neutral-100 text-neutral-600'}>
                                {umkm.status === 'published' ? 'Terbit' : 'Draft'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-(--charcoal-soft)">
                            Pemilik: {umkm.owner_name ?? '—'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {umkm.gmaps_link && (
                            <Button variant="outline" asChild>
                                <a href={umkm.gmaps_link} target="_blank" rel="noopener noreferrer">
                                    <Globe className="mr-2 h-4 w-4 text-blue-600" />
                                    Buka Google Maps
                                </a>
                            </Button>
                        )}
                        <Button asChild className="bg-(--forest) hover:bg-(--forest-deep)">
                            <Link href={`/admin/umkms/${umkm.slug}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit UMKM
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2 border-(--line) shadow-none">
                        <CardHeader>
                            <CardTitle className="font-display text-lg text-(--forest-deep)">
                                Profil & Deskripsi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {primaryMedia && (
                                <img
                                    src={primaryMedia.file_path.startsWith('http') ? primaryMedia.file_path : `/storage/${primaryMedia.file_path}`}
                                    alt={umkm.name}
                                    className="h-64 w-full rounded-xl object-cover"
                                />
                            )}
                            <div
                                className="prose prose-sm max-w-none text-(--charcoal)"
                                dangerouslySetInnerHTML={{ __html: umkm.description || '<p>Belum ada deskripsi.</p>' }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-(--line) shadow-none h-fit">
                        <CardHeader>
                            <CardTitle className="font-display text-lg text-(--forest-deep)">
                                Informasi Kontak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 text-sm">
                            <div className="flex items-start gap-2 text-(--charcoal)">
                                <Tag className="h-4 w-4 text-(--forest) shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-(--charcoal-soft) block">Kategori</span>
                                    <span className="font-medium capitalize">{umkm.category}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-(--charcoal)">
                                <Phone className="h-4 w-4 text-(--forest) shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-(--charcoal-soft) block">Kontak WA</span>
                                    <span className="font-medium">{umkm.contact_phone ?? '—'}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-(--charcoal)">
                                <MapPin className="h-4 w-4 text-(--forest) shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-(--charcoal-soft) block">Alamat</span>
                                    <span className="font-medium">{umkm.address ?? 'Serayu Larangan'}</span>
                                </div>
                            </div>

                            {umkm.price_range && (
                                <div className="mt-2 p-3 bg-(--cream-soft) rounded-lg border border-(--line)">
                                    <span className="text-xs font-semibold text-(--forest-deep) block">Kisaran Harga Produk</span>
                                    <span className="text-sm font-medium text-(--charcoal)">{umkm.price_range}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
