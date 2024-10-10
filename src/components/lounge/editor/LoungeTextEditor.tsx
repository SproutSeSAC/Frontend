import { Controller, useFormContext } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

import ErrorMsg from '@/components/common/input/ErrorMsg';
import TextEditor from '@/components/common/text-editor/TextEditor';

export default function LoungeTextEditor() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="projectDescription"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleChange = (e: string | { native?: string }) => {
          let newValue;

          if (typeof e === 'object' && e.native) {
            if (value) {
              newValue = `${value} <span>${e.native}</span>`;
            } else {
              newValue = `<span>${e.native}</span>`;
            }
          } else {
            newValue = e;
          }

          onChange(newValue);
        };

        return (
          <div className="flex flex-col">
            <TextEditor
              value={value}
              onChange={handleChange}
              className="h-[523px] w-full"
              placeholder="프로젝트 상세 정보를 작성해 주세요"
            />
            {error && <ErrorMsg msg={error?.message || ''} className="ml-2" />}
          </div>
        );
      }}
    />
  );
}
