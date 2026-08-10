import type { useEditor } from '@tiptap/react';
import {
    Bold,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Redo,
    Sparkles,
    Strikethrough,
    Undo,
} from 'lucide-react';

type EditorInstance = ReturnType<typeof useEditor>;

interface EditorToolbarProps {
    editor: EditorInstance;
    onGenerateAi?: () => void;
    isGeneratingAi?: boolean;
}

export function EditorToolbar({
    editor,
    onGenerateAi,
    isGeneratingAi = false,
}: EditorToolbarProps) {
    if (!editor) {
        return null;
    }

    const btn = (active: boolean) =>
        `rounded p-1.5 transition-colors ${active ? 'bg-(--forest-mist) text-(--forest-deep)' : 'text-(--charcoal-soft) hover:bg-(--cream-warm)'}`;

    const divider = (
        <div className="mx-1 w-px self-stretch bg-[oklch(0.22_0.01_85/8%)]" />
    );

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-(--line) px-3 py-2">
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btn(editor.isActive('bold'))}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btn(editor.isActive('italic'))}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={btn(editor.isActive('strike'))}
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </button>
            {divider}
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={btn(editor.isActive('heading', { level: 2 }))}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </button>
            {divider}
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btn(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btn(editor.isActive('orderedList'))}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btn(editor.isActive('blockquote'))}
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </button>
            {divider}
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className={btn(false) + ' disabled:opacity-30'}
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className={btn(false) + ' disabled:opacity-30'}
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </button>

            {onGenerateAi && (
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={onGenerateAi}
                        disabled={isGeneratingAi}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[oklch(0.8_0.08_145)] bg-[oklch(0.96_0.03_145)] px-2.5 py-1 text-xs font-medium text-(--forest-deep) shadow-2xs transition-all hover:bg-[oklch(0.92_0.05_145)] disabled:opacity-50"
                        title="Buat deskripsi otomatis dengan AI berdasarkan data yang telah diisi"
                    >
                        {isGeneratingAi ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-(--forest)" />
                        ) : (
                            <Sparkles className="h-3.5 w-3.5 text-(--forest)" />
                        )}
                        {isGeneratingAi ? 'Membuat AI...' : 'Buat AI Deskripsi'}
                    </button>
                </div>
            )}
        </div>
    );
}
