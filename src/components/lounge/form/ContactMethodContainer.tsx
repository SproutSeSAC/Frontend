import { useEffect } from 'react';

import { contactMethodList } from '@/constants';
import { ContactMethodDisplayKey } from '@/types';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';
import TextInput from '@/components/common/input/TextInput';

export default function ContactMethodContainer() {
  const { control, setValue, clearErrors } = useFormContext();

  const contactMethod: ContactMethodDisplayKey | '' = useWatch({
    control,
    name: 'contactMethod',
  });

  const placeholderByMethod: { [key in ContactMethodDisplayKey]: string } = {
    PHONE: '휴대폰 번호를 입력해주세요.',
    EMAIL: '이메일을 입력해주세요.',
    MESSENGER: '오픈채팅방 링크를 입력해주세요.',
  };

  useEffect(() => {
    setValue('contactDetail', '');
    clearErrors('contactDetail');
  }, [clearErrors, contactMethod, setValue]);

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

      {contactMethod &&
        (contactMethod !== 'PHONE' ? (
          <Controller
            control={control}
            name="contactDetail"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <div
                  className={`flex h-full w-full ${contactMethod && 'flex-1'}`}
                >
                  <TextInput
                    name="contactDetail"
                    placeholder={placeholderByMethod[contactMethod]}
                    value={value}
                    onChange={onChange}
                    errorMsg={error?.message}
                    className="h-[57px] !border-mainGray"
                  />
                </div>
              );
            }}
          />
        ) : (
          <ControllerPhoneNumber
            name="contactDetail"
            className="!h-[57px] !border-mainGray !pl-2"
          />
        ))}
    </div>
  );
}
