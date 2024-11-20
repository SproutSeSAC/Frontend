import { useCallback, useEffect, useMemo, useRef } from 'react';

import EditorModule from './EditorModule';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface TextEditorProps {
  onChange: (value: string) => void;
  placeholder?: string;
  formats?: string[];
}

export default function TextEditor({
  onChange,
  placeholder,
  formats,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const defaultFormats: string[] = useMemo(() => {
    return [
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'indent',
      'link',
      'color',
      'background',
      'align',
      'script',
      'code-block',
    ];
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
      },
    }),
    [],
  );

  const handleChange = useCallback(() => {
    if (quillRef.current) {
      const updatedValue = quillRef.current.root.innerHTML;
      onChange(updatedValue);
    }
  }, [onChange]);

  const handleEmojiSelect = useCallback(
    (emoji: { native: string }) => {
      if (quillRef.current) {
        const editor = quillRef.current;
        const range = editor.getSelection();
        if (range) {
          editor.insertText(range.index, emoji.native);
          editor.setSelection(range.index + emoji.native.length, 0);
          handleChange();
        }
      }
    },
    [handleChange],
  );

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules,
        formats: [...defaultFormats, ...(formats || [])],
        placeholder: placeholder || '',
      });

      quillRef.current.on('text-change', handleChange);
    }
  }, [defaultFormats, formats, handleChange, modules, placeholder]);

  return (
    <div>
      <div id="toolBar">
        <EditorModule onEmojiSelect={handleEmojiSelect} />
      </div>

      <div ref={editorRef} />
    </div>
  );
}
