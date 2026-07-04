import { Head, router, useForm } from '@inertiajs/react';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { ImageIcon, Loader2, Save, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { EditorToolbar } from '@/components/admin/editor-toolbar';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Blog, BreadcrumbItem, Village } from '@/types';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const blogSchema = z.object({
    title: z.string().min(1, 'Judul artikel wajib diisi').max(255),
    status: z.enum(['draft', 'published']),
});

type BlogFormData = z.infer<typeof blogSchema>;

// ── Cover Image Preview ───────────────────────────────────────────────────────
type CoverPreviewProps = {
    existingUrl: string | null;
    onFileSelect: (file: File | null) => void;
    onRemoveExisting: () => void;
};

function CoverPreview({ existingUrl, onFileSelect, onRemoveExisting }: CoverPreviewProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removed, setRemoved] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setRemoved(false);
        onFileSelect(file);
    };

    const handleRemove = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            onFileSelect(null);
        } else {
            setRemoved(true);
            onRemoveExisting();
        }
        if (inputRef.current) inputRef.current.value = '';
    };

    const displayUrl = previewUrl ?? (removed ? null : existingUrl ? `/storage/${existingUrl}` : null);

    return (
        <div className="flex flex-col gap-3">
            {displayUrl ? (
                <div className="relative w-full max-w-md">
                    <img
                        src={displayUrl}
                        alt="Cover preview"
                        className="h-48 w-full rounded-xl object-cover ring-1 ring-[oklch(0.22_0.01_85/8%)]"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-opacity hover:bg-red-700"
                        title="Hapus cover"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <label className="flex h-48 w-full max-w-md cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[oklch(0.22_0.01_85/15%)] text-[oklch(0.48_0.01_85)] transition-colors hover:border-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.92_0.02_145)/20%]">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-sm">Klik untuk upload foto cover</span>
                    <span className="text-xs opacity-60">Maks 5 MB • JPG, PNG, WebP</span>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
            )}
            {!displayUrl && (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[oklch(0.38_0.08_145)] hover:underline w-fit">
                    <ImageIcon className="h-4 w-4" />
                    {existingUrl && removed ? 'Pilih foto baru' : displayUrl ? 'Ganti foto' : ''}
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
            )}
        </div>
    );
}

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
    blog: Blog | null;
    villages: Pick<Village, 'id' | 'name'>[];
    isAdmin: boolean;
};

export default function BlogForm({ blog, villages, isAdmin }: Props) {
    const isEditing = !!blog;

    const { data, setData, processing, errors, setError, clearErrors } = useForm<
        BlogFormData & {
            content: string;
            village_id: number | null;
            cover_image: File | null;
            remove_cover: boolean;
        }
    >({
        title: blog?.title ?? '',
        status: blog?.status ?? 'draft',
        content: blog?.content ?? '',
        village_id: blog?.village_id ?? null,
        cover_image: null,
        remove_cover: false,
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Mulai tulis artikel Anda di sini...' }),
        ],
        content: blog?.content ?? '',
        onUpdate({ editor: e }) {
            setData('content', e.getHTML());
        },
    });

    const validate = (): boolean => {
        const result = blogSchema.safeParse(data);

        if (!result.success) {
            clearErrors();
            result.error.issues.forEach((err) => {
                setError(err.path[0] as keyof typeof errors, err.message);
            });
            toast.error('Mohon periksa kembali isian form yang ditandai merah.');
            return false;
        }

        if (!data.content || data.content === '<p></p>') {
            setError('content' as keyof typeof errors, 'Konten artikel wajib diisi.');
            toast.error('Konten artikel wajib diisi.');
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
                `/admin/blogs/${blog.slug}`,
                { ...finalData, _method: 'PUT' } as unknown as Record<string, unknown>,
                options,
            );
        } else {
            router.post('/admin/blogs', finalData as unknown as Record<string, unknown>, options);
        }
    };

    const handleCoverSelect = useCallback(
        (file: File | null) => {
            setData('cover_image', file);
        },
        [setData],
    );

    const handleRemoveExisting = useCallback(() => {
        setData('remove_cover', true);
    }, [setData]);

    return (
        <>
            <Head title={isEditing ? `Edit ${blog.title}` : 'Tulis Artikel'} />

            <form onSubmit={submit} className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-2xl font-semibold text-[oklch(0.24_0.05_145)]">
                        {isEditing ? `Edit: ${blog.title}` : 'Tulis Artikel Baru'}
                    </h1>
                    <p className="mt-0.5 text-sm text-[oklch(0.48_0.01_85)]">Buat konten blog yang informatif dan menarik.</p>
                </div>

                {/* Section 1: Informasi Dasar */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">Informasi Dasar</CardTitle>
                        <CardDescription>Judul dan keterkaitan dengan desa.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="title">Judul Artikel <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="contoh: Mengenal Tradisi Unik Desa Wisata Onje"
                                className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="village_id">Desa Terkait</Label>
                            {isAdmin ? (
                                <Select
                                    value={data.village_id ? String(data.village_id) : 'none'}
                                    onValueChange={(v) => setData('village_id', v === 'none' ? null : Number(v))}
                                >
                                    <SelectTrigger id="village_id" className="w-full sm:w-[280px]">
                                        <SelectValue placeholder="Pilih desa (opsional)..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">— Blog Umum (tidak spesifik desa) —</SelectItem>
                                        {villages.map((v) => (
                                            <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <Input value={villages[0]?.name ?? ''} disabled className="bg-muted/50 font-medium text-muted-foreground" />
                                        <p className="text-xs text-[oklch(0.48_0.01_85)]">Artikel otomatis dikaitkan dengan desa Anda.</p>
                                    </div>
                                )}
                                {isAdmin && (
                                    <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                        Pilih desa jika artikel ini berkaitan dengan desa tertentu.
                                    </p>
                                )}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Konten */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">Konten Artikel</CardTitle>
                        <CardDescription>Tulis isi artikel dengan lengkap dan informatif.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`overflow-hidden rounded-xl border transition-all focus-within:border-[oklch(0.38_0.08_145)] focus-within:ring-1 focus-within:ring-[oklch(0.38_0.08_145)] ${errors.content ? 'border-destructive' : 'border-[oklch(0.22_0.01_85/8%)]'}`}>
                            <EditorToolbar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="min-h-64 px-4 py-3 text-sm text-[oklch(0.22_0.01_85)] [&_.tiptap]:outline-none [&_.tiptap_p]:mb-2 [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:font-semibold [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-4 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-4 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-[oklch(0.38_0.08_145)] [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-[oklch(0.48_0.01_85)] [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
                            />
                        </div>
                        {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content}</p>}
                    </CardContent>
                </Card>

                {/* Section 3: Cover */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">Foto Cover</CardTitle>
                        <CardDescription>Foto utama yang ditampilkan di halaman daftar artikel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CoverPreview
                            existingUrl={blog?.cover_image ?? null}
                            onFileSelect={handleCoverSelect}
                            onRemoveExisting={handleRemoveExisting}
                        />
                    </CardContent>
                </Card>

                {/* Section 4: Pengaturan */}
                <Card className="border-[oklch(0.22_0.01_85/8%)] shadow-none">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[oklch(0.24_0.05_145)]">Pengaturan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="status">Status Publikasi</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v as 'draft' | 'published')}>
                                <SelectTrigger id="status" className="w-full sm:w-[220px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft (Tidak tampil publik)</SelectItem>
                                    <SelectItem value="published">Terbit (Tampil di website)</SelectItem>
                                </SelectContent>
                            </Select>
                            {blog?.published_at && (
                                <p className="text-xs text-[oklch(0.48_0.01_85)]">
                                    Diterbitkan: {new Date(blog.published_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sticky Submit */}
                <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-[oklch(0.22_0.01_85/8%)] bg-white/90 px-6 py-4 backdrop-blur-sm">
                    <p className="text-sm text-[oklch(0.48_0.01_85)]">
                        {isEditing ? 'Perubahan belum disimpan' : 'Artikel belum disimpan'}
                    </p>
                    <div className="flex gap-3">
                        {data.status === 'draft' && (
                            <Button type="button" variant="outline" disabled={processing} onClick={(e) => submit(e, true)}>
                                Simpan & Terbitkan
                            </Button>
                        )}
                        <Button type="submit" disabled={processing} className="bg-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.24_0.05_145)]">
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isEditing ? 'Simpan Perubahan' : 'Simpan Artikel'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

BlogForm.layout = (page: React.ReactNode & { props: Props }) => {
    const blog = page?.props?.blog;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Blog', href: '/admin/blogs' },
        { title: blog ? `Edit: ${blog.title}` : 'Tulis Artikel', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
