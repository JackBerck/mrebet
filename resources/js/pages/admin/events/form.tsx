import { Head, router, useForm } from '@inertiajs/react';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MapPin, Loader2, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { DatePicker } from '@/components/admin/date-picker';
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
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/ui/time-picker';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Destination, Event } from '@/types';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const eventSchema = z.object({
    title: z.string().min(1, 'Judul event wajib diisi').max(255),
    start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
    end_date: z.string().optional().or(z.literal('')),
    start_time: z.string().optional().or(z.literal('')),
    end_time: z.string().optional().or(z.literal('')),
    ticket_price: z.number().min(0, 'Harga tidak boleh negatif'),
    organizer: z.string().max(255).optional().or(z.literal('')),
    instagram: z.string().max(255).optional().or(z.literal('')),
    contact_person: z.string().max(255).optional().or(z.literal('')),
    address: z.string().max(500).optional().or(z.literal('')),
    gmaps_link: z.string().max(1000).optional().or(z.literal('')),
    qr_code_target: z
        .string()
        .url('Harus berupa URL valid')
        .optional()
        .or(z.literal('')),
    status: z.enum(['draft', 'published']),
});

type EventFormData = z.infer<typeof eventSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
    event:
        | (Event & {
              media?: { id: number; file_path: string; is_primary: boolean }[];
          })
        | null;
    destinations: Pick<Destination, 'id' | 'name'>[];
    isAdmin: boolean;
};

export default function EventForm({
    event,
    destinations,
    isAdmin,
}: Props) {
    const isEditing = !!event;

    const { data, setData, processing, errors, setError, clearErrors } =
        useForm<
            EventFormData & {
                description: string;
                destination_id: number | null;
                latitude: number | null;
                longitude: number | null;
                images: File[];
                deleted_media_ids: number[];
                primary_media_id: number | null;
            }
        >({
            title: event?.title ?? '',
            destination_id: event?.destination_id ?? null,
            start_date: event?.start_date ?? '',
            end_date: event?.end_date ?? '',
            start_time: event?.start_time
                ? event.start_time.substring(0, 5)
                : '',
            end_time: event?.end_time ? event.end_time.substring(0, 5) : '',
            ticket_price: Number(event?.ticket_price ?? 0),
            organizer: event?.organizer ?? '',
            instagram: event?.instagram ?? '',
            contact_person: event?.contact_person ?? '',
            address: event?.address ?? '',
            gmaps_link: event?.gmaps_link ?? '',
            latitude: event?.latitude ?? null,
            longitude: event?.longitude ?? null,
            qr_code_target: event?.qr_code_target ?? '',
            status: event?.status ?? 'draft',
            description: event?.description ?? '',
            images: [],
            deleted_media_ids: [],
            primary_media_id: null,
        });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder:
                    'Deskripsikan event ini: jadwal kegiatan, narasumber, ketentuan peserta...',
            }),
        ],
        content: event?.description ?? '',
        onUpdate({ editor: e }) {
            setData('description', e.getHTML());
        },
    });

    const validate = (): boolean => {
        const result = eventSchema.safeParse({
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

        return true;
    };

    const submit = (e: React.FormEvent, forcePublish = false) => {
        e.preventDefault();
        if (!validate()) return;

        const targetStatus = forcePublish ? 'published' : data.status;

        if (isEditing && event) {
            router.post(
                `/admin/events/${event.slug}`,
                {
                    _method: 'put',
                    ...data,
                    status: targetStatus,
                },
                {
                    onError: (errs) => {
                        toast.error(
                            'Gagal menyimpan event. Periksa kembali form.',
                        );
                    },
                },
            );
        } else {
            router.post(
                '/admin/events',
                {
                    ...data,
                    status: targetStatus,
                },
                {
                    onError: (errs) => {
                        toast.error(
                            'Gagal menambahkan event. Periksa kembali form.',
                        );
                    },
                },
            );
        }
    };

    return (
        <>
            <Head
                title={
                    isEditing ? `Edit Event: ${event.title}` : 'Tambah Event'
                }
            />

            <form onSubmit={(e) => submit(e)} className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-xl sm:text-2xl font-semibold text-(--forest-deep)">
                        {isEditing
                            ? `Edit: ${event.title}`
                            : 'Tambah Event Baru'}
                    </h1>
                    <p className="mt-0.5 text-xs sm:text-sm text-(--charcoal-soft)">
                        Kelola data agenda dan event Desa Serayu Larangan.
                    </p>
                </div>

                {/* Section 1: Informasi Utama */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Informasi Utama Event
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Judul, status publikasi, dan destinasi lokasi event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="title">
                                Judul Event{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Contoh: Festival Larangan Sewu Tumpeng 2026"
                                className={
                                    errors.title ? 'border-destructive' : ''
                                }
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label htmlFor="destination_id">
                                    Lokasi Destinasi (opsional)
                                </Label>
                                <Select
                                    value={
                                        data.destination_id
                                            ? String(data.destination_id)
                                            : 'none'
                                    }
                                    onValueChange={(v) =>
                                        setData(
                                            'destination_id',
                                            v === 'none' ? null : Number(v),
                                        )
                                    }
                                >
                                    <SelectTrigger id="destination_id">
                                        <SelectValue placeholder="Pilih destinasi..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            — Tidak ada —
                                        </SelectItem>
                                        {destinations.map((d) => (
                                            <SelectItem
                                                key={d.id}
                                                value={String(d.id)}
                                            >
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <Label className="text-sm sm:text-base font-semibold">
                                    Status Publikasi
                                </Label>
                                <p className="text-xs text-(--charcoal-soft)">
                                    Event terbit akan langsung terlihat oleh
                                    pengunjung publik.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-medium">
                                    {data.status === 'published'
                                        ? 'Terbit'
                                        : 'Draft'}
                                </span>
                                <Switch
                                    checked={data.status === 'published'}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'status',
                                            checked ? 'published' : 'draft',
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Waktu */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Waktu Pelaksanaan
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Tanggal dan jam mulai/selesai event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:gap-5 sm:grid-cols-2 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="start_date">
                                Tanggal Mulai{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <DatePicker
                                value={data.start_date}
                                onChange={(date) => setData('start_date', date)}
                            />
                            {errors.start_date && (
                                <p className="text-xs text-destructive">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="end_date">Tanggal Selesai</Label>
                            <DatePicker
                                value={data.end_date}
                                onChange={(date) => setData('end_date', date)}
                            />
                            {errors.end_date && (
                                <p className="text-xs text-destructive">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="start_time">Jam Mulai</Label>
                            <TimePicker
                                id="start_time"
                                value={data.start_time ?? ''}
                                onChange={(val) => setData('start_time', val)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="end_time">Jam Selesai</Label>
                            <TimePicker
                                id="end_time"
                                value={data.end_time ?? ''}
                                onChange={(val) => setData('end_time', val)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Deskripsi */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Deskripsi Event
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Informasi lengkap tentang event, kegiatan, dan hal
                            penting lainnya.
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

                {/* Section 4: Detail & Kontak */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Detail & Kontak
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Informasi tiket, penyelenggara, dan kontak.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:gap-5 sm:grid-cols-2 p-3.5 pt-0 sm:p-5 sm:pt-0">
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
                            {errors.ticket_price && (
                                <p className="text-xs text-destructive">
                                    {errors.ticket_price}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="organizer">Penyelenggara</Label>
                            <Input
                                id="organizer"
                                value={data.organizer}
                                onChange={(e) =>
                                    setData('organizer', e.target.value)
                                }
                                placeholder="Pokdarwis / Karang Taruna Desa"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="contact_person">Nomor Kontak / WA</Label>
                            <Input
                                id="contact_person"
                                value={data.contact_person}
                                onChange={(e) =>
                                    setData('contact_person', e.target.value)
                                }
                                placeholder="081234567890"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="instagram">Akun Instagram</Label>
                            <Input
                                id="instagram"
                                value={data.instagram}
                                onChange={(e) =>
                                    setData('instagram', e.target.value)
                                }
                                placeholder="@serayularangan"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label htmlFor="qr_code_target">
                                Link Pendaftaran / Tiket (QR Code Target)
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
                                Kosongkan untuk menggunakan URL halaman event
                                ini.
                            </p>
                            {errors.qr_code_target && (
                                <p className="text-xs text-destructive">
                                    {errors.qr_code_target}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5: Lokasi Event */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Lokasi & Peta Pelaksanaan
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-(--forest)" />
                                Alamat spesifik, Google Maps link, atau pilih lokasi di peta.
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:gap-5 p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="address">Alamat / Patokan Tempat</Label>
                            <Input
                                id="address"
                                value={data.address ?? ''}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="Contoh: Lapangan Agrowisata Serayu Larangan"
                            />
                        </div>

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

                {/* Section 6: Galeri Foto */}
                <Card className="border-(--line) shadow-none gap-2 sm:gap-3 py-0">
                    <CardHeader className="p-3.5 pb-0 sm:p-5 sm:pb-0">
                        <CardTitle className="font-display text-base sm:text-lg text-(--forest-deep)">
                            Foto Event
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Upload foto brosur atau galeri event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 sm:p-5 sm:pt-0">
                        <ImageUploader
                            existing={event?.media ?? []}
                            onChange={(files, deletedIds, primaryId) => {
                                setData('images', files);
                                setData('deleted_media_ids', deletedIds);
                                setData('primary_media_id', primaryId);
                            }}
                        />
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
                            {isEditing ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

EventForm.layout = (page: React.ReactNode & { props: Props }) => {
    const event = page?.props?.event;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Event', href: '/admin/events' },
        { title: event ? `Edit: ${event.title}` : 'Tambah Event', href: '#' },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
