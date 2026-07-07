import { Head, router, useForm } from '@inertiajs/react';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Loader2, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { DatePicker } from '@/components/admin/date-picker';
import { EditorToolbar } from '@/components/admin/editor-toolbar';
import { ImageUploader } from '@/components/admin/image-uploader';
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
import type { BreadcrumbItem, Destination, Event, Village } from '@/types';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const eventSchema = z.object({
    title: z.string().min(1, 'Judul event wajib diisi').max(255),
    village_id: z
        .number({ message: 'Desa wajib dipilih' })
        .int()
        .positive('Desa wajib dipilih'),
    start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
    end_date: z.string().optional().or(z.literal('')),
    start_time: z.string().optional().or(z.literal('')),
    end_time: z.string().optional().or(z.literal('')),
    ticket_price: z.number().min(0, 'Harga tidak boleh negatif'),
    organizer: z.string().max(255).optional().or(z.literal('')),
    instagram: z.string().max(255).optional().or(z.literal('')),
    contact_person: z.string().max(255).optional().or(z.literal('')),
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
    villages: Pick<Village, 'id' | 'name'>[];
    destinations: Pick<Destination, 'id' | 'name' | 'village_id'>[];
    isAdmin: boolean;
};

export default function EventForm({
    event,
    villages,
    destinations,
    isAdmin,
}: Props) {
    const isEditing = !!event;

    const { data, setData, processing, errors, setError, clearErrors } =
        useForm<
            EventFormData & {
                description: string;
                destination_id: number | null;
                images: File[];
                deleted_media_ids: number[];
                primary_media_id: number | null;
            }
        >({
            title: event?.title ?? '',
            village_id: event?.village_id ?? villages[0]?.id ?? 0,
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
            qr_code_target: event?.qr_code_target ?? '',
            status: event?.status ?? 'draft',
            description: event?.description ?? '',
            images: [],
            deleted_media_ids: [],
            primary_media_id: null,
        });

    // Filter destinations by selected village (admin only)
    const [filteredDestinations, setFilteredDestinations] =
        useState(destinations);

    useEffect(() => {
        if (isAdmin && data.village_id) {
            setFilteredDestinations(
                destinations.filter((d) => d.village_id === data.village_id),
            );
            setData('destination_id', null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.village_id]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder:
                    'Deskripsikan event ini: kegiatan, jadwal, informasi penting...',
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

        // Extra: validate end_date >= start_date
        if (
            data.end_date &&
            data.start_date &&
            data.end_date < data.start_date
        ) {
            setError(
                'end_date' as keyof typeof errors,
                'Tanggal selesai harus sama atau setelah tanggal mulai.',
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
                `/admin/events/${event.slug}`,
                { ...finalData, _method: 'PUT' } as unknown as Record<
                    string,
                    unknown
                >,
                options,
            );
        } else {
            router.post(
                '/admin/events',
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

    return (
        <>
            <Head title={isEditing ? `Edit ${event.title}` : 'Tambah Event'} />

            <form onSubmit={submit} className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">
                        {isEditing
                            ? `Edit: ${event.title}`
                            : 'Tambah Event Baru'}
                    </h1>
                    <p className="mt-0.5 text-sm text-[oklch(0.48_0.01_85)]">
                        Lengkapi semua informasi event.
                    </p>
                </div>

                {/* Section 1: Informasi Dasar */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription>
                            Judul, desa penyelenggara, dan lokasi event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
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
                                placeholder="contoh: Festival Budaya Desa Onje 2025"
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

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="village_id">
                                    Desa Penyelenggara{' '}
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

                            <div className="flex flex-col gap-1.5">
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
                                        {filteredDestinations.map((d) => (
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
                    </CardContent>
                </Card>

                {/* Section 2: Waktu */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Waktu Pelaksanaan
                        </CardTitle>
                        <CardDescription>
                            Tanggal dan jam mulai/selesai event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 sm:grid-cols-2">
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
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Deskripsi Event
                        </CardTitle>
                        <CardDescription>
                            Informasi lengkap tentang event, kegiatan, dan hal
                            penting lainnya.
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

                {/* Section 4: Detail */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Detail & Kontak
                        </CardTitle>
                        <CardDescription>
                            Informasi tiket, penyelenggara, dan kontak.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 sm:grid-cols-2">
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
                            />
                            <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                Isi 0 jika gratis.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="organizer">Penyelenggara</Label>
                            <Input
                                id="organizer"
                                value={data.organizer ?? ''}
                                onChange={(e) =>
                                    setData('organizer', e.target.value)
                                }
                                placeholder="contoh: Pokdarwis Desa Onje"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="contact_person">
                                Kontak Person (WA/HP)
                            </Label>
                            <Input
                                id="contact_person"
                                value={data.contact_person ?? ''}
                                onChange={(e) =>
                                    setData('contact_person', e.target.value)
                                }
                                placeholder="contoh: 08123456789"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                value={data.instagram ?? ''}
                                onChange={(e) =>
                                    setData('instagram', e.target.value)
                                }
                                placeholder="contoh: @desaonje"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5: Foto */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">
                            Foto Event
                        </CardTitle>
                        <CardDescription>
                            Upload foto poster atau dokumentasi event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUploader
                            existing={event?.media ?? []}
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
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Event'}
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
