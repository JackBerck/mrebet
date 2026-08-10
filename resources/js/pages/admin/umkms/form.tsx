import { Head, router, useForm } from '@inertiajs/react';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Loader2, MapPin, Save, Globe } from 'lucide-react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { EditorToolbar } from '@/components/admin/editor-toolbar';
import { ImageUploader } from '@/components/admin/image-uploader';
import { MapPicker } from '@/components/admin/map-picker';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { UmkmItem } from './index';
import { toast } from 'sonner';

const umkmSchema = z.object({
    name: z.string().min(1, 'Nama UMKM wajib diisi').max(255),
    category: z.string().min(1, 'Kategori wajib dipilih'),
    owner_name: z.string().max(255).optional().or(z.literal('')),
    contact_phone: z.string().max(20).optional().or(z.literal('')),
    price_range: z.string().max(100).optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    gmaps_link: z.string().max(1000).optional().or(z.literal('')),
    latitude: z
        .number({ message: 'Harus berupa angka' })
        .min(-90, 'Min -90')
        .max(90, 'Max 90')
        .optional()
        .or(z.nan()),
    longitude: z
        .number({ message: 'Harus berupa angka' })
        .min(-180, 'Min -180')
        .max(180, 'Max 180')
        .optional()
        .or(z.nan()),
    status: z.enum(['draft', 'published']),
});

type UmkmFormSchema = z.infer<typeof umkmSchema>;

type Props = {
    umkm:
        | (UmkmItem & {
              media?: { id: number; file_path: string; is_primary: boolean }[];
          })
        | null;
    categories: { value: string; label: string }[];
    isAdmin: boolean;
};

export default function UmkmForm({ umkm, categories, isAdmin }: Props) {
    const isEditing = !!umkm;

    const { data, setData, processing, errors, setError, clearErrors } =
        useForm<
            UmkmFormSchema & {
                description: string;
                images: File[];
                deleted_media_ids: number[];
                primary_media_id: number | null;
            }
        >({
            name: umkm?.name ?? '',
            category: umkm?.category ?? 'kuliner',
            owner_name: umkm?.owner_name ?? '',
            contact_phone: umkm?.contact_phone ?? '',
            price_range: umkm?.price_range ?? '',
            address: umkm?.address ?? '',
            gmaps_link: umkm?.gmaps_link ?? '',
            latitude: umkm?.latitude ?? undefined,
            longitude: umkm?.longitude ?? undefined,
            status: umkm?.status ?? 'draft',
            description: umkm?.description ?? '',
            images: [],
            deleted_media_ids: [],
            primary_media_id: null,
        });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Tuliskan profil usaha, keunggulan produk, atau kisah di balik usaha ini...',
            }),
        ],
        content: umkm?.description ?? '',
        onUpdate({ editor: e }) {
            setData('description', e.getHTML());
        },
    });

    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    const handleGenerateAi = async () => {
        if (!data.name.trim()) {
            toast.error('Isi terlebih dahulu nama usaha UMKM sebelum membuat deskripsi AI.');
            return;
        }

        setIsGeneratingAi(true);
        try {
            const res = await fetch('/admin/ai/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    type: 'umkm',
                    title: data.name,
                    context: {
                        category: data.category,
                        owner_name: data.owner_name,
                        address: data.address,
                        contact_phone: data.contact_phone,
                        price_range: data.price_range,
                    },
                }),
            });

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Gagal membuat deskripsi dengan AI.');
            }

            editor?.commands.setContent(json.description);
            setData('description', json.description);
            toast.success('Deskripsi AI berhasil dibuat!');
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan saat generate AI.');
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const validate = (): boolean => {
        const result = umkmSchema.safeParse({
            ...data,
            latitude: data.latitude ? Number(data.latitude) : undefined,
            longitude: data.longitude ? Number(data.longitude) : undefined,
        });

        if (!result.success) {
            clearErrors();
            result.error.issues.forEach((err) => {
                setError(err.path[0] as keyof typeof errors, err.message);
            });
            return false;
        }

        clearErrors();
        return true;
    };

    const submit = (e: React.FormEvent, publishNow = false) => {
        e.preventDefault();

        if (!validate()) return;

        const finalData = { ...data };
        if (publishNow) {
            finalData.status = 'published';
        }

        if (isEditing) {
            router.post(
                `/admin/umkms/${umkm.slug}`,
                { ...finalData, _method: 'PUT' } as any,
                { forceFormData: true },
            );
        } else {
            router.post('/admin/umkms', finalData as any, {
                forceFormData: true,
            });
        }
    };

    const handleMediaChange = (
        files: File[],
        deletedIds: number[],
        primaryId: number | null,
    ) => {
        setData((prev) => ({
            ...prev,
            images: files,
            deleted_media_ids: deletedIds,
            primary_media_id: primaryId,
        }));
    };

    return (
        <>
            <Head
                title={
                    isEditing ? `Edit UMKM — ${umkm.name}` : 'Tambah UMKM Desa'
                }
            />

            <form onSubmit={submit} className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <h1 className="font-display text-xl sm:text-2xl font-semibold text-(--forest-deep)">
                            {isEditing ? `Edit UMKM: ${umkm.name}` : 'Tambah UMKM / Warung Baru'}
                        </h1>
                        <p className="mt-0.5 text-xs sm:text-sm text-(--charcoal-soft)">
                            Kelola data UMKM, kuliner, dan warung lokal Desa Serayu Larangan.
                        </p>
                    </div>
                </div>

                {/* Section 1: Informasi Usaha */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Informasi Usaha & Pemilik
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Isi nama usaha, kategori, nama pemilik, kontak, serta kisaran harga produk.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name">
                                    Nama UMKM / Warung <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="contoh: Sentra Gula Semut Serayu"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="category">
                                    Kategori <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(v) => setData('category', v)}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="owner_name">Nama Pemilik / Pengelola</Label>
                                <Input
                                    id="owner_name"
                                    value={data.owner_name}
                                    onChange={(e) => setData('owner_name', e.target.value)}
                                    placeholder="contoh: Ibu Srimulyati"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contact_phone">Nomor Telepon / WhatsApp</Label>
                                <Input
                                    id="contact_phone"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    placeholder="contoh: 08123456789"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="price_range">Kisaran Harga Produk</Label>
                                <Input
                                    id="price_range"
                                    value={data.price_range}
                                    onChange={(e) => setData('price_range', e.target.value)}
                                    placeholder="contoh: Rp 10.000 - Rp 35.000"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Deskripsi */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Deskripsi UMKM
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Tuliskan profil usaha dan cerita produk. Disarankan mengisikan data bidang lain terlebih dahulu sebelum menekan tombol Buat AI Deskripsi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="overflow-hidden rounded-xl border border-(--line) transition-all focus-within:border-(--forest) focus-within:ring-1 focus-within:ring-(--forest)">
                            <EditorToolbar
                                editor={editor}
                                onGenerateAi={handleGenerateAi}
                                isGeneratingAi={isGeneratingAi}
                            />
                            <EditorContent
                                editor={editor}
                                className="min-h-36 sm:min-h-40 px-3 py-2 sm:px-4 sm:py-3 text-sm text-(--charcoal) [&_.tiptap]:outline-none [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-(--charcoal-soft) [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:font-display [&_.tiptap_h2]:text-base [&_.tiptap_h2]:sm:text-lg [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:text-(--forest-deep) [&_.tiptap_p]:mb-2 [&_.tiptap_p]:leading-relaxed [&_.tiptap_ul]:mb-3 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ol]:mb-3 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_blockquote]:my-3 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-(--forest) [&_.tiptap_blockquote]:bg-(--forest-mist)/30 [&_.tiptap_blockquote]:px-3 [&_.tiptap_blockquote]:py-1.5 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:rounded-r-md"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Lokasi & Link Google Maps */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Alamat & Peta Lokasi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Isi alamat lengkap, link Google Maps, serta titik koordinat lokasi usaha.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="address">Alamat Lengkap</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="RT 03/RW 02, Serayu Larangan"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="gmaps_link" className="flex items-center gap-1.5">
                                <Globe className="h-4 w-4 text-blue-600" />
                                Link Google Maps (URL Share Maps)
                            </Label>
                            <Input
                                id="gmaps_link"
                                type="url"
                                value={data.gmaps_link}
                                onChange={(e) => setData('gmaps_link', e.target.value)}
                                placeholder="https://maps.google.com/?q=..."
                            />
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={data.latitude ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            'latitude',
                                            e.target.value ? parseFloat(e.target.value) : undefined,
                                        )
                                    }
                                    placeholder="-7.3235"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={data.longitude ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            'longitude',
                                            e.target.value ? parseFloat(e.target.value) : undefined,
                                        )
                                    }
                                    placeholder="109.3642"
                                />
                            </div>
                        </div>

                        <MapPicker
                            lat={data.latitude ?? null}
                            lng={data.longitude ?? null}
                            onChange={(lat, lng) => {
                                setData((prev) => ({
                                    ...prev,
                                    latitude: lat,
                                    longitude: lng,
                                }));
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Section 4: Foto / Media */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Galeri Foto Produk / Warung
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Unggah foto produk, tempat usaha, atau proses pembuatan sebagai media promosi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <ImageUploader
                            existing={umkm?.media ?? []}
                            onChange={handleMediaChange}
                        />
                    </CardContent>
                </Card>

                {/* Section 5: Status Publikasi */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Status Publikasi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Atur visibilitas data UMKM ini apakah disimpan sebagai draft atau langsung terbit di website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as 'draft' | 'published')}
                        >
                            <SelectTrigger id="status" className="w-full sm:w-55">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft (Tidak tampil publik)</SelectItem>
                                <SelectItem value="published">Terbit (Tampil di website)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Submit Bar */}
                <div className="sticky bottom-0 -mx-3 sm:-mx-6 flex items-center justify-between border-t border-(--line) bg-white/90 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-(--charcoal-soft)">
                        {isEditing ? 'Perubahan belum disimpan' : 'Form belum tersimpan'}
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
                            {isEditing ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

UmkmForm.layout = (page: React.ReactNode & { props: Props }) => {
    const umkm = page?.props?.umkm;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'UMKM & Kuliner', href: '/admin/umkms' },
        {
            title: umkm ? `Edit: ${umkm.name}` : 'Tambah UMKM',
            href: '#',
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
