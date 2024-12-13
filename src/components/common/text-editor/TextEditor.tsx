import { useCallback, useEffect, useMemo, useRef } from 'react';

import EmojiTool from './EmojiTool';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface TextEditorProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export default function TextEditor({
  onChange,
  placeholder,
  value,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const handleChange = useCallback(() => {
    if (quillRef.current) {
      const updatedValue = quillRef.current.root.innerHTML;
      onChange(updatedValue);
    }
  }, [onChange]);

  const handleEmojiSelect = useCallback((emoji: { native: string }) => {
    if (quillRef.current) {
      const editor = quillRef.current;
      let range = editor.getSelection();
      if (!range) {
        range = { index: editor.getLength() - 1, length: 0 };
      }
      editor.insertText(range.index, emoji.native);
      editor.setSelection(range.index + emoji.native.length, 0);
    }
  }, []);

  const toolbarOptions = useMemo(() => {
    return [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],

      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }],

      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['blockquote', 'link', 'image'],
    ];
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
        },
        placeholder: placeholder || '',
      });

      quillRef.current.on('text-change', handleChange);
    }
  }, [handleChange, handleEmojiSelect, placeholder, toolbarOptions]);

  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const editorContent = quillRef.current.root.innerHTML;
      if (editorContent !== value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  return (
    <div id="quill-editor">
      <EmojiTool onEmojiSelect={handleEmojiSelect} />
      <div ref={editorRef} className="!h-[523px] pb-6" />
    </div>
  );
}
