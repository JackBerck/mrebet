import { X } from 'lucide-react';
import { useCallback, useState } from 'react';

export type ExistingMedia = {
    id: number;
    file_path: string;
    is_primary: boolean;
};

type PreviewImage = {
    id?: number;
    url: string;
    file?: File;
    is_primary: boolean;
};

type ImageUploaderProps = {
    existing: ExistingMedia[];
    onChange: (files: File[], deletedIds: number[], primaryId: number | null) => void;
    maxFiles?: number;
};

export function ImageUploader({ existing, onChange, maxFiles = 10 }: ImageUploaderProps) {
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
                            className={`h-28 w-full cursor-pointer rounded-xl object-cover ring-2 transition-all ${
                                p.is_primary
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
                            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                {previews.length < maxFiles && (
                    <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[oklch(0.22_0.01_85/15%)] text-[oklch(0.48_0.01_85)] transition-colors hover:border-[oklch(0.38_0.08_145)] hover:bg-[oklch(0.92_0.02_145)/30%]">
                        <span className="text-2xl">+</span>
                        <span className="mt-1 text-xs">Tambah Foto</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                    </label>
                )}
            </div>
            <p className="text-xs text-[oklch(0.48_0.01_85)]">
                Klik gambar untuk menjadikan foto utama. Maks {maxFiles} foto, 5 MB per file.
            </p>
        </div>
    );
}
