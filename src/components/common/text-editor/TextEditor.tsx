import { useMemo } from 'react';

import EditorModule from './EditorModule';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

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
  return (
    <div>
      <div id="toolBar">
        <EditorModule onChange={onChange} />
      </div>

      <ReactQuill
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
