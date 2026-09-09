import { useEffect } from 'react'
import { Button, ButtonGroup } from '@mui/material'
import LinkExtension from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps {
    value: string
    onChange: (payload: { html: string; json: string }) => void
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
            }),
        ],
        content: value || '<p></p>',
        onUpdate: ({ editor }) => {
            onChange({
                html: editor.getHTML(),
                json: JSON.stringify(editor.getJSON()),
            })
        },
    })

    useEffect(() => {
        if (!editor) return
        const nextValue = value || '<p></p>'
        if (editor.getHTML() !== nextValue) {
            editor.commands.setContent(nextValue, { emitUpdate: false })
        }
    }, [editor, value])

    const setLink = () => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href as string | undefined
        const url = window.prompt('Введите ссылку', previousUrl || 'https://')

        if (url === null) return
        if (!url.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
    }

    if (!editor) return null

    return (
        <div className={styles.editorShell}>
            <div className={styles.toolbar}>
                <ButtonGroup
                    size='small'
                    variant='outlined'
                >
                    <Button
                        variant={editor.isActive('bold') ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        B
                    </Button>
                    <Button
                        variant={editor.isActive('italic') ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        I
                    </Button>
                    <Button
                        variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        H2
                    </Button>
                    <Button
                        variant={editor.isActive('heading', { level: 3 }) ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        H3
                    </Button>
                    <Button
                        variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        •
                    </Button>
                    <Button
                        variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        1.
                    </Button>
                    <Button
                        variant={editor.isActive('blockquote') ? 'contained' : 'outlined'}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        Quote
                    </Button>
                    <Button
                        variant={editor.isActive('link') ? 'contained' : 'outlined'}
                        onClick={setLink}
                    >
                        Link
                    </Button>
                    <Button onClick={() => editor.chain().focus().undo().run()}>Undo</Button>
                    <Button onClick={() => editor.chain().focus().redo().run()}>Redo</Button>
                </ButtonGroup>
            </div>
            <div className={styles.editor}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
