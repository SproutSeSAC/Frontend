import { contactMethodList } from '@/constants';
import { ContactMethodDisplayKey } from '@/types';
import { Control, Controller, useWatch } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TextInput from '@/components/common/input/TextInput';
import { FormValues } from '@/components/lounge/form/LoungeForm';

export default function ContactMethodContainer({
  control,
}: {
  control: Control<FormValues>;
}) {
  const contactMethod: ContactMethodDisplayKey | '' = useWatch({
    control,
    name: 'contactMethod',
  });

  const placeholderByMethod: { [key in ContactMethodDisplayKey]: string } = {
    PHONE: '휴대폰 번호를 입력해주세요.',
    EMAIL: '이메일을 입력해주세요.',
    MESSENGER: '메신저를 입력해주세요.',
  };

  return (
    <div className={`${contactMethod && 'flex gap-2'}`}>
      <Controller
        control={control}
        name="contactMethod"
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedOption = contactMethodList.find(
            ({ key }) => key === value,
          );

          return (
            <SingleSelectDropdown
              defaultLabel="연락 방법"
              options={contactMethodList}
              selectedOption={selectedOption}
              errorMsg={error?.message}
              onChangeValue={data => onChange(data[0].key)}
            />
          );
        }}
      />
      {contactMethod && (
        <Controller
          control={control}
          name="contactDetail"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <div className={`flex w-full ${contactMethod && 'flex-1'}`}>
                <TextInput
                  name="contactDetail"
                  placeholder={placeholderByMethod[contactMethod]}
                  value={value}
                  onChange={onChange}
                  errorMsg={error?.message}
                  className="h-full placeholder:text-mainGray"
                />
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
