import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useHandleImage } from '@/hooks/common/useHandleImage';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Toolbar from 'quill/modules/toolbar';

import EmojiTool from '@/components/common/text-editor/EmojiTool';

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

  const { alertLimitCapacity } = useHandleImage();

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 1048576) {
        alertLimitCapacity({ limitCapacity: '1MB' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (quillRef.current) {
          const range = quillRef.current.getSelection();
          const base64String = reader.result as string;

          quillRef.current.insertEmbed(
            range?.index || 0,
            'image',
            base64String,
          );
        }
      };
      reader.readAsDataURL(file);
    };
  }, [alertLimitCapacity]);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
        },
        placeholder: placeholder || '',
      });
      const toolbar = quillRef.current.getModule('toolbar') as Toolbar;
      toolbar.addHandler('image', handleImageUpload);
      toolbar.addHandler('emoji', handleEmojiSelect);
      quillRef.current.on('text-change', handleChange);
    }
  }, [
    handleChange,
    handleEmojiSelect,
    handleImageUpload,
    placeholder,
    toolbarOptions,
  ]);

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
