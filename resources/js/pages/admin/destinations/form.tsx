import { Head, router, useForm } from '@inertiajs/react';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Loader2, MapPin, Save } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/ui/time-picker';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Destination } from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────
const FACILITIES_OPTIONS = [
    'Parkir',
    'Toilet',
    'Mushola',
    'Warung/Kantin',
    'WiFi',
    'Gazebo',
    'Area Bermain',
    'Penginapan',
    'Pemandu Wisata',
    'Souvenir',
];

const DAYS_OPTIONS = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
];

// ── Zod Schema ────────────────────────────────────────────────────────────────
const destinationSchema = z.object({
    name: z.string().min(1, 'Nama destinasi wajib diisi').max(255),
    category: z.enum(['alam', 'budaya', 'buatan'], {
        message: 'Kategori wajib dipilih',
    }),
    ticket_price: z
        .number({ message: 'Harga harus berupa angka' })
        .min(0, 'Harga tidak boleh negatif'),
    ticket_info: z.string().max(500).optional().or(z.literal('')),
    open_time: z.string().optional().or(z.literal('')),
    close_time: z.string().optional().or(z.literal('')),
    gmaps_link: z.string().max(1000).optional().or(z.literal('')),
    qr_code_target: z
        .string()
        .url('Harus berupa URL valid')
        .optional()
        .or(z.literal('')),
    status: z.enum(['draft', 'published']),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
    destination:
        | (Destination & {
              media?: { id: number; file_path: string; is_primary: boolean }[];
          })
        | null;
    isAdmin: boolean;
};

export default function DestinationForm({
    destination,
    isAdmin,
}: Props) {
    const isEditing = !!destination;

    const { data, setData, processing, errors, setError, clearErrors } =
        useForm<
            DestinationFormData & {
                description: string;
                latitude: number | null;
                longitude: number | null;
                operational_days: string;
                facilities: string[];
                images: File[];
                deleted_media_ids: number[];
                primary_media_id: number | null;
            }
        >({
            name: destination?.name ?? '',
            category: destination?.category ?? 'alam',
            ticket_price: Number(destination?.ticket_price ?? 0),
            ticket_info: destination?.ticket_info ?? '',
            open_time: destination?.open_time
                ? destination.open_time.substring(0, 5)
                : '',
            close_time: destination?.close_time
                ? destination.close_time.substring(0, 5)
                : '',
            gmaps_link: destination?.gmaps_link ?? '',
            qr_code_target: destination?.qr_code_target ?? '',
            status: destination?.status ?? 'draft',
            description: destination?.description ?? '',
            latitude: destination?.latitude ?? null,
            longitude: destination?.longitude ?? null,
            operational_days: destination?.operational_days ?? '',
            facilities: destination?.facilities ?? [],
            images: [],
            deleted_media_ids: [],
            primary_media_id: null,
        });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder:
                    'Deskripsikan destinasi wisata ini: keindahan, keunikan, tips berkunjung...',
            }),
        ],
        content: destination?.description ?? '',
        onUpdate({ editor: e }) {
            setData('description', e.getHTML());
        },
    });

    const validate = (): boolean => {
        const result = destinationSchema.safeParse({
            ...data,
            ticket_price: Number(data.ticket_price),
        });

        if (!result.success) {
            clearErrors();
            result.error.issues.forEach((err) => {
                setError(err.path[0] as keyof typeof errors, err.message);
            });
            toast.error(
                'Mohon periksa kembali isian form yang ditandai merah.',
            );

            return false;
        }

        clearErrors();

        return true;
    };

    const submit = (e: React.FormEvent, publishNow = false) => {
        e.preventDefault();

        if (!validate()) {
return;
}

        const finalData = { ...data };

        if (publishNow) {
finalData.status = 'published';
}

        const options = {
            forceFormData: true,
            onError: (errs: Record<string, string>) => {
                toast.error('Terjadi kesalahan validasi dari server.');
            },
        };

        if (isEditing) {
            router.post(
                `/admin/destinations/${destination.slug}`,
                { ...finalData, _method: 'PUT' } as unknown as Record<string, any>,
                options,
            );
        } else {
            router.post(
                '/admin/destinations',
                finalData as unknown as Record<string, any>,
                options,
            );
        }
    };

    const handleMediaChange = useCallback(
        (files: File[], deletedIds: number[], primaryId: number | null) => {
            setData((prev) => ({
                ...prev,
                images: files,
                deleted_media_ids: deletedIds,
                primary_media_id: primaryId,
            }));
        },
        [setData],
    );

    const toggleDay = (day: string) => {
        const current = data.operational_days
            ? data.operational_days.split(', ').filter(Boolean)
            : [];
        const updated = current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day];
        setData('operational_days', updated.join(', '));
    };

    const toggleFacility = (facility: string) => {
        const current = data.facilities ?? [];
        const updated = current.includes(facility)
            ? current.filter((f) => f !== facility)
            : [...current, facility];
        setData('facilities', updated);
    };

    const selectedDays = data.operational_days
        ? data.operational_days.split(', ').filter(Boolean)
        : [];

    return (
        <>
            <Head
                title={
                    isEditing ? `Edit ${destination.name}` : 'Tambah Destinasi'
                }
            />

            <form onSubmit={submit} className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-xl sm:text-2xl font-semibold text-(--forest-deep)">
                        {isEditing
                            ? `Edit: ${destination.name}`
                            : 'Tambah Destinasi Baru'}
                    </h1>
                    <p className="mt-0.5 text-xs sm:text-sm text-(--charcoal-soft)">
                        Lengkapi semua informasi destinasi wisata Desa Serayu Larangan.
                    </p>
                </div>

                {/* Section 1: Informasi Dasar */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Identitas utama dan kategori destinasi wisata.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">
                                Nama Destinasi{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="contoh: Air Terjun Curug Jenggala"
                                className={
                                    errors.name ? 'border-destructive' : ''
                                }
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            {/* Category */}
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label htmlFor="category">
                                    Kategori{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(v) =>
                                        setData(
                                            'category',
                                            v as typeof data.category,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="category"
                                        className={
                                            errors.category
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="alam">
                                            🌲 Wisata Alam
                                        </SelectItem>
                                        <SelectItem value="budaya">
                                            🏛️ Wisata Budaya & Religi
                                        </SelectItem>
                                        <SelectItem value="buatan">
                                            🎡 Wisata Buatan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-xs text-destructive">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Deskripsi */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Deskripsi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Ceritakan tentang destinasi: keindahan, keunikan,
                            dan tips berkunjung.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="overflow-hidden rounded-xl border border-(--line) transition-all focus-within:border-[oklch(0.38_0.08_145)] focus-within:ring-1 focus-within:ring-[oklch(0.38_0.08_145)]">
                            <EditorToolbar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="min-h-48 px-3 py-2 sm:px-4 sm:py-3 text-sm text-[oklch(0.22_0.01_85)] [&_.tiptap]:outline-none [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-(--charcoal-soft) [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:font-semibold [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-4 [&_.tiptap_p]:mb-2 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-4"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Tiket & Operasional */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Tiket & Operasional
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Informasi harga tiket, jam buka, dan fasilitas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-6 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ticket_price">
                                    Harga Tiket (Rp){' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="ticket_price"
                                    type="number"
                                    min={0}
                                    step={500}
                                    value={data.ticket_price}
                                    onChange={(e) =>
                                        setData(
                                            'ticket_price',
                                            parseFloat(e.target.value) || 0,
                                        )
                                    }
                                    placeholder="0 = gratis"
                                    className={
                                        errors.ticket_price
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                <p className="text-xs text-(--charcoal-soft)">
                                    Isi 0 jika gratis.
                                </p>
                                {errors.ticket_price && (
                                    <p className="text-xs text-destructive">
                                        {errors.ticket_price}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ticket_info">
                                    Keterangan Tiket
                                </Label>
                                <Input
                                    id="ticket_info"
                                    value={data.ticket_info ?? ''}
                                    onChange={(e) =>
                                        setData('ticket_info', e.target.value)
                                    }
                                    placeholder="contoh: Termasuk parkir motor"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="open_time">Jam Buka</Label>
                                <TimePicker
                                    id="open_time"
                                    value={data.open_time ?? ''}
                                    onChange={(val) =>
                                        setData('open_time', val)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="close_time">Jam Tutup</Label>
                                <TimePicker
                                    id="close_time"
                                    value={data.close_time ?? ''}
                                    onChange={(val) =>
                                        setData('close_time', val)
                                    }
                                />
                            </div>
                        </div>

                        {/* Hari Operasional */}
                        <div className="flex flex-col gap-2">
                            <Label>Hari Operasional</Label>
                            <div className="flex flex-wrap gap-3">
                                {DAYS_OPTIONS.map((day) => (
                                    <label
                                        key={day}
                                        className="flex cursor-pointer items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={selectedDays.includes(day)}
                                            onCheckedChange={() =>
                                                toggleDay(day)
                                            }
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Fasilitas */}
                        <div className="flex flex-col gap-2">
                            <Label>Fasilitas</Label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {FACILITIES_OPTIONS.map((facility) => (
                                    <label
                                        key={facility}
                                        className="flex cursor-pointer items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={(
                                                data.facilities ?? []
                                            ).includes(facility)}
                                            onCheckedChange={() =>
                                                toggleFacility(facility)
                                            }
                                        />
                                        {facility}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Lokasi */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Lokasi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-(--forest)" />
                                Seret pin atau klik peta untuk menentukan
                                koordinat.
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="gmaps_link">Link Google Maps (opsional)</Label>
                            <Input
                                id="gmaps_link"
                                type="url"
                                value={data.gmaps_link ?? ''}
                                onChange={(e) =>
                                    setData('gmaps_link', e.target.value)
                                }
                                placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/..."
                                className={
                                    errors.gmaps_link ? 'border-destructive' : ''
                                }
                            />
                            <p className="text-xs text-(--charcoal-soft)">
                                Tempelkan link dari Google Maps. Koordinat
                                latitude & longitude akan otomatis terdeteksi saat
                                disimpan.
                            </p>
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
                                            e.target.value
                                                ? parseFloat(e.target.value)
                                                : null,
                                        )
                                    }
                                    placeholder="-7.4267"
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
                                            e.target.value
                                                ? parseFloat(e.target.value)
                                                : null,
                                        )
                                    }
                                    placeholder="109.3619"
                                />
                            </div>
                        </div>
                        <MapPicker
                            lat={data.latitude ?? null}
                            lng={data.longitude ?? null}
                            onChange={(lat, lng) =>
                                setData((prev) => ({
                                    ...prev,
                                    latitude: lat,
                                    longitude: lng,
                                }))
                            }
                        />
                    </CardContent>
                </Card>

                {/* Section 5: Foto */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Foto Destinasi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Upload foto-foto terbaik destinasi. Klik foto untuk
                            jadikan cover.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <ImageUploader
                            existing={destination?.media ?? []}
                            onChange={handleMediaChange}
                        />
                    </CardContent>
                </Card>

                {/* Section 6: Pengaturan */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Pengaturan
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Atur status publikasi dan tautan QR Code destinasi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="status">Status Publikasi</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) =>
                                    setData(
                                        'status',
                                        v as 'draft' | 'published',
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="status"
                                    className="w-full sm:w-55"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">
                                        Draft (Tidak tampil publik)
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Terbit (Tampil di website)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="qr_code_target">
                                URL Target QR Code
                            </Label>
                            <Input
                                id="qr_code_target"
                                type="url"
                                value={data.qr_code_target ?? ''}
                                onChange={(e) =>
                                    setData('qr_code_target', e.target.value)
                                }
                                placeholder="https://maps.google.com/..."
                                className={
                                    errors.qr_code_target
                                        ? 'border-destructive'
                                        : ''
                                }
                            />
                            <p className="text-xs text-(--charcoal-soft)">
                                Kosongkan untuk menggunakan URL halaman
                                destinasi ini.
                            </p>
                            {errors.qr_code_target && (
                                <p className="text-xs text-destructive">
                                    {errors.qr_code_target}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sticky Submit */}
                <div className="sticky bottom-0 -mx-3 sm:-mx-6 flex items-center justify-between border-t border-(--line) bg-white/90 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-(--charcoal-soft)">
                        {isEditing
                            ? 'Perubahan belum disimpan'
                            : 'Form belum tersimpan'}
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                        {data.status === 'draft' && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={processing}
                                onClick={(e) => submit(e, true)}
                            >
                                Simpan & Terbitkan
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="bg-(--forest) hover:bg-(--forest-deep)"
                        >
                            {processing ? (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-1.5 h-4 w-4" />
                            )}
                            {isEditing
                                ? 'Simpan'
                                : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

DestinationForm.layout = (page: React.ReactNode & { props: Props }) => {
    const destination = page?.props?.destination;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Destinasi', href: '/admin/destinations' },
        {
            title: destination
                ? `Edit: ${destination.name}`
                : 'Tambah Destinasi',
            href: '#',
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
