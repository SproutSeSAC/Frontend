import { Controller, useFormContext } from 'react-hook-form';

import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import TextEditor from '@/components/common/text-editor/TextEditor';

interface ControllerContentEditorProps {
  type: '공지사항' | '프로젝트';
  controlNames: { title: string; content: string };
}

export default function ControllerContentEditor({
  type,
  controlNames: { title, content },
}: ControllerContentEditorProps) {
  const { control } = useFormContext();

  return (
    <div className="w-full">
      <LabeledSection label="제목" className="mb-2 mt-8">
        <Controller
          control={control}
          name={title}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <TextInput
                value={value}
                name="제목"
                placeholder={`${type} 제목을 입력해주세요.`}
                onChange={onChange}
                className="!mr-0 h-full !rounded-2xl border-mainGray py-[18px] pl-3 pr-4 text-lg placeholder:text-mainGray"
                errorMsg={error?.message}
              />
            );
          }}
        />
      </LabeledSection>

      <Controller
        control={control}
        name={content}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <div
              className={`${error?.message ? '[&>div]:rounded-lg [&>div]:border [&>div]:!border-red-500' : ''}`}
            >
              <TextEditor
                onChange={onChange}
                placeholder={`${type} 상세 내용을 작성해 주세요`}
                value={value}
              />
              {error?.message && (
                <ErrorMsg msg={error.message} className="pl-2" />
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
