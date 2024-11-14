import { useCallback, useMemo, useRef } from 'react';

import EditorModule from './EditorModule';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

const Size = Quill.import('formats/size');

Size.whitelist = ['small', 'medium', 'large', 'huge'];
Quill.register(Size, true);

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  formats?: string[];
}

export default function TextEditor({
  value,
  onChange,
  placeholder,
  className,
  formats,
}: TextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const defaultFormats: string[] = [
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'color',
    'background',
    'align',
    'script',
    'code-block',
  ];

  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
      },
    }),
    [],
  );

  const handleChange = useCallback(
    (newValue: string) => {
      const updatedValue = newValue;
      onChange(updatedValue);
    },
    [onChange],
  );

  const handleEmojiSelect = useCallback(
    (emoji: { native: string }) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();

        if (range) {
          editor.insertText(range.index, emoji.native, 'user');
          editor.setSelection(range.index + emoji.native.length, 0);

          handleChange(editor.root.innerHTML);
        }
      }
    },
    [handleChange],
  );

  return (
    <div>
      <div id="toolBar">
        <EditorModule onEmojiSelect={handleEmojiSelect} />
      </div>

      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        className={className}
        modules={modules}
        formats={[...defaultFormats, ...(formats || [])]}
        placeholder={placeholder}
      />
    </div>
  );
}
