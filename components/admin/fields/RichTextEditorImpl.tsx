"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { MediaPicker } from "./MediaPicker";

interface Props {
  value: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  rtl?: boolean;
  placeholder?: string;
}

/** TipTap editor. Loaded only on editor screens (see RichTextEditor.tsx). */
export default function RichTextEditorImpl({ value, onChange, readOnly, rtl, placeholder }: Props) {
  const [picker, setPicker] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Write here..." }),
    ],
    content: value || "",
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[14rem] px-4 py-3 text-sm leading-relaxed outline-none [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-extrabold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-600 [&_a]:text-brand-red [&_a]:underline [&_img]:my-2 [&_img]:max-w-full [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-slate-400 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        dir: rtl ? "rtl" : "ltr",
      },
    },
  });

  if (!editor) return <div className="h-64 animate-pulse border border-slate-200 bg-slate-50" />;

  const btn = (active: boolean) =>
    cn("flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30", active && "bg-ink text-white hover:bg-ink");

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="border border-slate-300 bg-white focus-within:border-brand-red">
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 p-1" role="toolbar" aria-label="Formatting">
          <button type="button" aria-label="Bold" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Italic" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Underline" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" aria-label="Heading 2" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Heading 3" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Bullet list" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Numbered list" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Quote" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" aria-label="Link" className={btn(editor.isActive("link"))} onClick={setLink}>
            <Link2 className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Insert image" className={btn(false)} onClick={() => setPicker(true)}>
            <ImageIcon className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" aria-label="Undo" className={btn(false)} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Redo" className={btn(false)} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
      <MediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        onPick={(url) => editor.chain().focus().setImage({ src: url }).run()}
        title="Insert image"
      />
    </div>
  );
}
