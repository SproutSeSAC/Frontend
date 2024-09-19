import { useMemo } from 'react';

import EditorModule from './EditorModule';

import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function LoungeTextEditor() {
  const { control } = useFormContext();

  const formats: string[] = [
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
    <Controller
      control={control}
      name="모집기간"
      render={({ field: { onChange, value } }) => {
        return (
          <div>
            <div id="toolBar">
              <EditorModule />
            </div>
            <ReactQuill
              value={value}
              onChange={onChange}
              className="h-[523px] w-full"
              modules={modules}
              formats={formats}
              placeholder="프로젝트 상세 정보를 작성해 주세요"
            />
          </div>
        );
      }}
    />
  );
}
