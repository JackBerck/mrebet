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
            qr_code_target: event?.qr_code_target ?? '',
            status: event?.status ?? 'draft',
            description: event?.description ?? '',
            images: [],
            deleted_media_ids: [],
            primary_media_id: null,
        });

                        <div className="grid gap-5 sm:grid-cols-2">
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
                    </CardContent>
                </Card>

                {/* Section 2: Waktu */}
                <Card className="border-(--line) shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-(--forest-deep)">
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
                <Card className="border-(--line) shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-(--forest-deep)">
                            Deskripsi Event
                        </CardTitle>
                        <CardDescription>
                            Informasi lengkap tentang event, kegiatan, dan hal
                            penting lainnya.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-xl border border-(--line) transition-all focus-within:border-[oklch(0.38_0.08_145)] focus-within:ring-1 focus-within:ring-[oklch(0.38_0.08_145)]">
                            <EditorToolbar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="min-h-48 px-4 py-3 text-sm text-[oklch(0.22_0.01_85)] [&_.tiptap]:outline-none [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-(--charcoal-soft) [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:font-semibold [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-4 [&_.tiptap_p]:mb-2 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-4"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Detail */}
                <Card className="border-(--line) shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-(--forest-deep)">
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
                            <p className="text-xs text-(--charcoal-soft)">
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
                <Card className="border-(--line) shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-(--forest-deep)">
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
                <Card className="border-(--line) shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-(--forest-deep)">
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

                {/* Sticky Submit */}
                <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-(--line) bg-white/90 px-6 py-4 backdrop-blur-sm">
                    <p className="text-sm text-(--charcoal-soft)">
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
                            className="bg-(--forest) hover:bg-(--forest-deep)"
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
