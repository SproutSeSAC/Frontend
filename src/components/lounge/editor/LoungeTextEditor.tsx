import { Controller, useFormContext } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

import TextEditor from '@/components/common/text-editor/TextEditor';

export default function LoungeTextEditor() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="projectDescription"
      render={({ field: { onChange, value } }) => {
        return (
          <TextEditor
            value={value}
            onChange={onChange}
            className="h-[523px] w-full"
            placeholder="프로젝트 상세 정보를 작성해 주세요"
          />
        );
      }}
    />
  );
}
