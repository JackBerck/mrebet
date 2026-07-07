import { Head, router, useForm } from '@inertiajs/react';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { Loader2, MapPin, Save } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { EditorToolbar } from '@/components/admin/editor-toolbar';
import { ImageUploader } from '@/components/admin/image-uploader';
import { MapPicker } from '@/components/admin/map-picker';
import AppLayout from '@/layouts/app-layout';
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
import type { BreadcrumbItem, Destination, Village } from '@/types';

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
    village_id: z
        .number({ message: 'Desa wajib dipilih' })
        .int()
        .positive('Desa wajib dipilih'),
    category: z.enum(['alam', 'budaya', 'buatan'], {
        message: 'Kategori wajib dipilih',
    }),
    ticket_price: z
        .number({ message: 'Harga harus berupa angka' })
        .min(0, 'Harga tidak boleh negatif'),
    ticket_info: z.string().max(500).optional().or(z.literal('')),
    open_time: z.string().optional().or(z.literal('')),
    close_time: z.string().optional().or(z.literal('')),
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
    villages: Pick<Village, 'id' | 'name'>[];
    isAdmin: boolean;
};

export default function DestinationForm({
    destination,
    villages,
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
            village_id: destination?.village_id ?? villages[0]?.id ?? 0,
            category: destination?.category ?? 'alam',
            ticket_price: Number(destination?.ticket_price ?? 0),
            ticket_info: destination?.ticket_info ?? '',
            open_time: destination?.open_time
                ? destination.open_time.substring(0, 5)
                : '',
            close_time: destination?.close_time
                ? destination.close_time.substring(0, 5)
                : '',
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
            village_id: Number(data.village_id),
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
        if (!validate()) return;

        const finalData = { ...data };
        if (publishNow) finalData.status = 'published';

        const options = {
            forceFormData: true,
            onError: (errs: Record<string, string>) => {
                toast.error('Terjadi kesalahan validasi dari server.');
            },
        };

        if (isEditing) {
            router.post(
                `/admin/destinations/${destination.slug}`,
                { ...finalData, _method: 'PUT' } as unknown as Record<
                    string,
                    unknown
                >,
                options,
            );
        } else {
            router.post(
                '/admin/destinations',
                finalData as unknown as Record<string, unknown>,
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

            <form onSubmit={submit} className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">
                        {isEditing
                            ? `Edit: ${destination.name}`
                            : 'Tambah Destinasi Baru'}
                    </h1>
                    <p className="mt-0.5 text-sm text-[oklch(0.48_0.01_85)]">
                        Lengkapi semua informasi destinasi wisata.
                    </p>
                </div>

                {/* Section 1: Informasi Dasar */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription>
                            Identitas utama destinasi wisata.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
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

                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Village selector */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="village_id">
                                    Desa{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                {isAdmin ? (
                                    <Select
                                        value={String(data.village_id)}
                                        onValueChange={(v) =>
                                            setData('village_id', Number(v))
                                        }
                                    >
                                        <SelectTrigger
                                            id="village_id"
                                            className={
                                                errors.village_id
                                                    ? 'border-destructive'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Pilih desa..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {villages.map((v) => (
                                                <SelectItem
                                                    key={v.id}
                                                    value={String(v.id)}
                                                >
                                                    {v.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <Input
                                            value={villages[0]?.name ?? ''}
                                            disabled
                                            className="bg-muted/50 font-medium text-muted-foreground"
                                        />
                                        <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                            Desa penyelenggara (otomatis desa
                                            Anda).
                                        </p>
                                    </div>
                                )}
                                {errors.village_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.village_id}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1.5">
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
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Deskripsi
                        </CardTitle>
                        <CardDescription>
                            Ceritakan tentang destinasi: keindahan, keunikan,
                            dan tips berkunjung.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-xl border border-[oklch(0.22_0.01_85/8%)] transition-all focus-within:border-[oklch(0.38_0.08_145)] focus-within:ring-1 focus-within:ring-[oklch(0.38_0.08_145)]">
                            <EditorToolbar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="min-h-48 px-4 py-3 text-sm text-[oklch(0.22_0.01_85)] [&_.tiptap]:outline-none [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-[oklch(0.48_0.01_85)] [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:font-semibold [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-4 [&_.tiptap_p]:mb-2 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-4"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Tiket & Operasional */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Tiket & Operasional
                        </CardTitle>
                        <CardDescription>
                            Informasi harga tiket, jam buka, dan fasilitas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="grid gap-5 sm:grid-cols-2">
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
                                <p className="text-xs text-[oklch(0.48_0.01_85)]">
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

                        <div className="grid gap-5 sm:grid-cols-2">
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
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Lokasi
                        </CardTitle>
                        <CardDescription>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-[oklch(0.38_0.08_145)]" />
                                Seret pin atau klik peta untuk menentukan
                                koordinat.
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
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Foto Destinasi
                        </CardTitle>
                        <CardDescription>
                            Upload foto-foto terbaik destinasi. Klik foto untuk
                            jadikan cover.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUploader
                            existing={destination?.media ?? []}
                            onChange={handleMediaChange}
                        />
                    </CardContent>
                </Card>

                {/* Section 6: Pengaturan */}
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
                                onValueChange={(v) =>
                                    setData(
                                        'status',
                                        v as 'draft' | 'published',
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="status"
                                    className="w-full sm:w-[220px]"
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
                            <p className="text-xs text-[oklch(0.48_0.01_85)]">
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
                <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-[oklch(0.22_0.01_85/8%)] bg-white/90 px-6 py-4 backdrop-blur-sm">
                    <p className="text-sm text-[oklch(0.48_0.01_85)]">
                        {isEditing
                            ? 'Perubahan belum disimpan'
                            : 'Form belum tersimpan'}
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
                            {isEditing
                                ? 'Simpan Perubahan'
                                : 'Tambah Destinasi'}
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
