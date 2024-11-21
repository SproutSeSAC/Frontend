import { Controller, useFormContext } from 'react-hook-form';

import ErrorMsg from '@/components/common/input/ErrorMsg';
import TextEditor from '@/components/common/text-editor/TextEditor';

export default function LoungeTextEditor() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="projectDescription"
      render={({ field: { onChange }, fieldState: { error } }) => {
        return (
          <div className="flex flex-col">
            <TextEditor
              onChange={onChange}
              placeholder="프로젝트 상세 정보를 작성해 주세요"
            />
            {error && <ErrorMsg msg={error?.message || ''} className="ml-2" />}
          </div>
        );
      }}
    />
  );
}
