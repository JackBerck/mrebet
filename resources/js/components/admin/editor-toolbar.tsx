import type { useEditor } from '@tiptap/react';
import {
    Bold,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Quote,
    Strikethrough,
    Undo,
    Redo,
} from 'lucide-react';

type EditorInstance = ReturnType<typeof useEditor>;

interface EditorToolbarProps {
    editor: EditorInstance;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
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
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={btn(editor.isActive('strike'))}
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </button>
            {divider}
            <button
                type="button"
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
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btn(editor.isActive('blockquote'))}
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </button>
            {divider}
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className={btn(false) + ' disabled:opacity-30'}
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className={btn(false) + ' disabled:opacity-30'}
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
}
