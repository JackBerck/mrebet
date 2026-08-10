import { Link } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/admin/status-badge';

export type RecentUmkm = {
    id: number;
    name: string;
    slug: string;
    category: string;
    status: 'draft' | 'published';
    owner_name?: string;
    created_at: string;
};

interface RecentUmkmsCardProps {
    umkms: RecentUmkm[];
}

export function RecentUmkmsCard({ umkms }: RecentUmkmsCardProps) {
    return (
        <Card className="col-span-1 border-(--line) shadow-none lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-display text-lg text-(--forest-deep)">
                    UMKM & Kuliner Terbaru
                </CardTitle>
                <CardDescription>
                    Daftar UMKM terdaftar di desa
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="divide-y divide-[oklch(0.22_0.01_85/8%)]">
                    {umkms.map((umkm) => (
                        <div
                            key={umkm.id}
                            className="flex items-center justify-between px-3 py-3 transition-colors hover:bg-(--cream-warm)"
                        >
                            <div className="min-w-0 flex-1 pr-4">
                                <p className="truncate font-medium text-[oklch(0.22_0.01_85)]" title={umkm.name}>
                                    {umkm.name}
                                </p>
                                <p className="truncate text-xs text-(--charcoal-soft)" title={umkm.owner_name ?? '—'}>
                                    Pemilik: {umkm.owner_name ?? '—'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={umkm.status} />
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/admin/umkms/${umkm.slug}/edit`}>
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full"
                    asChild
                >
                    <Link href="/admin/umkms">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Semua UMKM
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
