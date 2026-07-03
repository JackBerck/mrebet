import { Head, router, useForm } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    ChevronLeft,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Loader2,
    MapPin,
    Save,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem, Village } from '@/types';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const villageSchema = z.object({
    name: z.string().min(1, 'Nama desa wajib diisi').max(255),
    head_name: z.string().max(255).optional().or(z.literal('')),
    contact_phone: z.string().max(20).optional().or(z.literal('')),
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
    qr_code_target: z.string().url('Harus berupa URL valid').optional().or(z.literal('')),
    status: z.enum(['draft', 'published']),
});

type VillageForm = z.infer<typeof villageSchema>;

// ── Tiptap Toolbar ────────────────────────────────────────────────────────────
function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    if (!editor) return null;

    const btn = (active: boolean) =>
        `rounded p-1.5 transition-colors ${active ? 'bg-[oklch(0.92_0.02_145)] text-[oklch(0.24_0.05_145)]' : 'text-[oklch(0.48_0.01_85)] hover:bg-[oklch(0.97_0.01_85)]'}`;

    return (
        <div className="flex flex-wrap gap-1 border-b border-[oklch(0.22_0.01_85/8%)] px-3 py-2">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btn(editor.isActive('bold'))}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btn(editor.isActive('italic'))}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </button>
            <div className="mx-1 w-px bg-[oklch(0.22_0.01_85/8%)]" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btn(editor.isActive('heading', { level: 2 }))}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </button>
            <div className="mx-1 w-px bg-[oklch(0.22_0.01_85/8%)]" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btn(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btn(editor.isActive('orderedList'))}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </button>
        </div>
    );
}

// ── Map Picker (Leaflet) ──────────────────────────────────────────────────────
type MapPickerProps = {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number) => void;
};

function MapPicker({ lat, lng, onChange }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Dynamic import to avoid SSR issues
        import('leaflet').then((L) => {
            const defaultLat = lat ?? -7.4267;
            const defaultLng = lng ?? 109.3619;

            const map = L.default.map(mapRef.current!, {
                center: [defaultLat, defaultLng],
                zoom: 14,
            });

            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
            }).addTo(map);

            const marker = L.default
                .marker([defaultLat, defaultLng], { draggable: true })
                .addTo(map);

            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                onChange(parseFloat(pos.lat.toFixed(8)), parseFloat(pos.lng.toFixed(8)));
            });

            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat: clickLat, lng: clickLng } = e.latlng;
                marker.setLatLng([clickLat, clickLng]);
                onChange(parseFloat(clickLat.toFixed(8)), parseFloat(clickLng.toFixed(8)));
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;
        });

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Update marker when lat/lng change externally
    useEffect(() => {
        if (!markerRef.current || lat === null || lng === null) return;
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current?.panTo([lat, lng]);
    }, [lat, lng]);

    return (
        <div className="overflow-hidden rounded-xl border border-[oklch(0.22_0.01_85/8%)]">
            <div ref={mapRef} className="h-72 w-full" />
        </div>
    );
}

// ── Image Preview ─────────────────────────────────────────────────────────────
type PreviewImage = {
    id?: number; // existing media
    url: string;
    file?: File; // new upload
    is_primary: boolean;
};

type ImageUploaderProps = {
    existing: { id: number; file_path: string; is_primary: boolean }[];
    onChange: (files: File[], deletedIds: number[], primaryId: number | null) => void;
};

function ImageUploader({ existing, onChange }: ImageUploaderProps) {
    const [previews, setPreviews] = useState<PreviewImage[]>(
        existing.map((m) => ({
            id: m.id,
            url: `/storage/${m.file_path}`,
            is_primary: m.is_primary,
        })),
    );
    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    const notifyParent = useCallback(
        (updated: PreviewImage[], deleted: number[]) => {
            const newFiles = updated.filter((p) => p.file).map((p) => p.file!);
            const primaryId = updated.find((p) => p.is_primary && p.id)?.id ?? null;
            onChange(newFiles, deleted, primaryId);
        },
        [onChange],
    );

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const newPreviews: PreviewImage[] = files.map((file, i) => ({
            url: URL.createObjectURL(file),
            file,
            is_primary: previews.length === 0 && i === 0,
        }));
        const updated = [...previews, ...newPreviews];
        setPreviews(updated);
        notifyParent(updated, deletedIds);
        e.target.value = '';
    };

    const remove = (idx: number) => {
        const target = previews[idx];
        const updated = previews.filter((_, i) => i !== idx);
        // If removing primary, auto-assign to first remaining
        if (target.is_primary && updated.length > 0) updated[0].is_primary = true;
        const newDeleted = target.id ? [...deletedIds, target.id] : deletedIds;
        if (!target.id && target.url.startsWith('blob:')) URL.revokeObjectURL(target.url);
        setPreviews(updated);
        setDeletedIds(newDeleted);
        notifyParent(updated, newDeleted);
    };

    const setPrimary = (idx: number) => {
        const updated = previews.map((p, i) => ({ ...p, is_primary: i === idx }));
        setPreviews(updated);
        notifyParent(updated, deletedIds);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((p, i) => (
                    <div key={i} className="group relative">
                        <img
                            src={p.url}
                            alt="Preview"
                            className={`h-28 w-full rounded-xl object-cover cursor-pointer ring-2 transition-all ${p.is_primary
                                    ? 'ring-[oklch(0.38_0.08_145)]'
                                    : 'ring-transparent hover:ring-[oklch(0.88_0.06_82)]'
                                }`}
                            onClick={() => setPrimary(i)}
                            title="Klik untuk jadikan foto utama"
                        />
                        {p.is_primary && (
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-[oklch(0.38_0.08_145)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                Utama
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                {previews.length < 10 && (
                    <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[oklch(0.22_0.01_85/15%)] text-[oklch(0.48_0.01_85)] transition-colors hover:border-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.92_0.02_145)/30%]">
                        <span className="text-2xl">+</span>
                        <span className="mt-1 text-xs">Tambah Foto</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFiles}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-[oklch(0.48_0.01_85)]">
                Klik gambar untuk menjadikan foto utama (cover). Maks 10 foto, 5 MB per file.
            </p>
        </div>
    );
}

// ── Main Form ─────────────────────────────────────────────────────────────────
type Props = {
    village: (Village & { media?: { id: number; file_path: string; is_primary: boolean }[] }) | null;
    isAdmin: boolean;
};

export default function VillageForm({ village, isAdmin }: Props) {
    const isEditing = !!village;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Desa', href: '/admin/villages' },
        { title: isEditing ? `Edit: ${village.name}` : 'Tambah Desa', href: '#' },
    ];

    const { data, setData, processing, errors, setError, clearErrors } = useForm<
        VillageForm & {
            description: string;
            images: File[];
            deleted_media_ids: number[];
            primary_media_id: number | null;
        }
    >({
        name: village?.name ?? '',
        head_name: village?.head_name ?? '',
        contact_phone: village?.contact_phone ?? '',
        latitude: village?.latitude ?? undefined,
        longitude: village?.longitude ?? undefined,
        qr_code_target: village?.qr_code_target ?? '',
        status: village?.status ?? 'draft',
        description: village?.description ?? '',
        images: [],
        deleted_media_ids: [],
        primary_media_id: null,
    });

    // Tiptap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Tuliskan deskripsi desa wisata ini...' }),
        ],
        content: village?.description ?? '',
        onUpdate({ editor: e }) {
            setData('description', e.getHTML());
        },
    });

    // Client-side Zod validation
    const validate = (): boolean => {
        const result = villageSchema.safeParse({
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
        if (publishNow) finalData.status = 'published';

        if (isEditing) {
            router.post(
                `/admin/villages/${village.slug}`,
                { ...finalData, _method: 'PUT' } as any,
                { forceFormData: true },
            );
        } else {
            router.post('/admin/villages', finalData as any, { forceFormData: true });
        }
    };

    const handleMediaChange = (files: File[], deletedIds: number[], primaryId: number | null) => {
        setData((prev) => ({
            ...prev,
            images: files,
            deleted_media_ids: deletedIds,
            primary_media_id: primaryId,
        }));
    };

    return (
        <>
            <Head title={isEditing ? `Edit Desa — ${village.name}` : 'Tambah Desa'} />

            <form onSubmit={submit} className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center flex-wrap gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">
                            {isEditing ? `Edit Desa: ${village.name}` : 'Tambah Desa Baru'}
                        </h1>
                        <p className="mt-0.5 text-sm text-[oklch(0.48_0.01_85)]">
                            Isi semua informasi di bawah ini dengan lengkap dan benar.
                        </p>
                    </div>
                </div>

                {/* Section 1: Informasi Dasar */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription>Identitas utama desa wisata.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">
                                Nama Desa <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="contoh: Desa Onje"
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="head_name">Nama Kepala Desa / Ketua Pokdarwis</Label>
                                <Input
                                    id="head_name"
                                    value={data.head_name ?? ''}
                                    onChange={(e) => setData('head_name', e.target.value)}
                                    placeholder="contoh: Bapak Suparno"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contact_phone">Nomor Kontak (WhatsApp)</Label>
                                <Input
                                    id="contact_phone"
                                    type="tel"
                                    value={data.contact_phone ?? ''}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    placeholder="contoh: 08123456789"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Deskripsi */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Deskripsi Desa
                        </CardTitle>
                        <CardDescription>
                            Ceritakan tentang desa ini: sejarah, keunggulan, dan potensi wisatanya.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-xl border border-[oklch(0.22_0.01_85/8%)] focus-within:border-[oklch(0.38_0.08_145)] focus-within:ring-1 focus-within:ring-[oklch(0.38_0.08_145)] transition-all">
                            <EditorToolbar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="min-h-48 px-4 py-3 text-sm text-[oklch(0.22_0.01_85)] [&_.tiptap]:outline-none [&_.tiptap_p]:mb-2 [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:font-semibold [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-4 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-4 [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-[oklch(0.48_0.01_85)] [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Lokasi */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Lokasi
                        </CardTitle>
                        <CardDescription>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-[oklch(0.38_0.08_145)]" />
                                Seret pin atau klik peta untuk menentukan titik koordinat desa.
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={data.latitude ?? ''}
                                    onChange={(e) =>
                                        setData('latitude', e.target.value ? parseFloat(e.target.value) : undefined)
                                    }
                                    placeholder="-7.4267"
                                    className={errors.latitude ? 'border-destructive' : ''}
                                />
                                {errors.latitude && (
                                    <p className="text-xs text-destructive">{errors.latitude}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={data.longitude ?? ''}
                                    onChange={(e) =>
                                        setData('longitude', e.target.value ? parseFloat(e.target.value) : undefined)
                                    }
                                    placeholder="109.3619"
                                    className={errors.longitude ? 'border-destructive' : ''}
                                />
                                {errors.longitude && (
                                    <p className="text-xs text-destructive">{errors.longitude}</p>
                                )}
                            </div>
                        </div>

                        <MapPicker
                            lat={data.latitude ?? null}
                            lng={data.longitude ?? null}
                            onChange={(lat, lng) => {
                                setData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Section 4: Foto / Media */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Foto Desa
                        </CardTitle>
                        <CardDescription>
                            Upload foto-foto terbaik desa. Foto pertama otomatis jadi cover.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUploader
                            existing={village?.media ?? []}
                            onChange={handleMediaChange}
                        />
                    </CardContent>
                </Card>

                {/* Section 5: Pengaturan */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Pengaturan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="status">Status Publikasi</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v as 'draft' | 'published')}
                            >
                                <SelectTrigger id="status" className="w-full sm:w-[220px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft (Tidak tampil publik)</SelectItem>
                                    <SelectItem value="published">Terbit (Tampil di website)</SelectItem>
                                </SelectContent>
                            </Select>
                            {!isAdmin && (
                                <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                    Status terbit hanya bisa diubah oleh Admin Kecamatan.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="qr_code_target">URL Target QR Code</Label>
                            <Input
                                id="qr_code_target"
                                type="url"
                                value={data.qr_code_target ?? ''}
                                onChange={(e) => setData('qr_code_target', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className={errors.qr_code_target ? 'border-destructive' : ''}
                            />
                            <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                Kosongkan untuk menggunakan link halaman desa ini secara otomatis.
                            </p>
                            {errors.qr_code_target && (
                                <p className="text-xs text-destructive">{errors.qr_code_target}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sticky Submit Bar */}
                <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-[oklch(0.22_0.01_85/8%)] bg-white/90 px-6 py-4 backdrop-blur-sm">
                    <p className="text-sm text-[oklch(0.48_0.01_85)]">
                        {isEditing ? 'Perubahan belum disimpan' : 'Form belum tersimpan'}
                    </p>
                    <div className="flex gap-3">
                        {data.status === 'draft' && (
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                                onClick={(e) => submit(e, true)}
                            >
                                Simpan & Terbitkan
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]"
                        >
                            {processing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Desa'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

VillageForm.layout = (page: React.ReactNode & { props: Props }) => {
    const village = page?.props?.village;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Desa', href: '/admin/villages' },
        {
            title: village ? `Edit: ${village.name}` : 'Tambah Desa',
            href: '#',
        },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
