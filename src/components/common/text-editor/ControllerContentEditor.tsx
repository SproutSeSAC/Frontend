import { Controller, useFormContext } from 'react-hook-form';

import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import TextEditor from '@/components/common/text-editor/TextEditor';

interface ControllerContentEditorProps {
  type: 'notice';
  initialValue: string;
}

export default function ControllerContentEditor({
  type,
  initialValue,
}: ControllerContentEditorProps) {
  const { control } = useFormContext();

  const controlNames: {
    [key in ControllerContentEditorProps[keyof ControllerContentEditorProps]]: {
      name: string;
      title: string;
      content: string;
    };
  } = {
    notice: {
      name: '공지사항',
      title: 'title',
      content: 'content',
    },
  };

  const { name, title, content } = controlNames[type];

  return (
    <div className="w-full">
      <LabeledSection label="제목" className="my-8">
        <Controller
          control={control}
          name={title}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <TextInput
                value={value}
                name="제목"
                placeholder={`${name} 제목을 입력해주세요.`}
                onChange={onChange}
                className="!mr-0 h-full !rounded-2xl py-[18px] pl-3 pr-4 text-lg placeholder:text-gray2"
                errorMsg={error?.message}
              />
            );
          }}
        />
      </LabeledSection>

      <LabeledSection label="상세 내용" className="mb-8 mt-2">
        <Controller
          control={control}
          name={content}
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <div
                className={`${error?.message ? '[&>div]:rounded-lg [&>div]:border [&>div]:border-red-500' : ''}`}
              >
                <TextEditor
                  onChange={onChange}
                  placeholder={`${name} 상세 내용을 작성해 주세요`}
                  value={initialValue}
                />
                {error?.message && <ErrorMsg msg={error.message} />}
              </div>
            );
          }}
        />
      </LabeledSection>
    </div>
  );
}
