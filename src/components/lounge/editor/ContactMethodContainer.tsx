import { contactMethodList } from '@/constants';
import { Control, Controller, useWatch } from 'react-hook-form';

import { FormValues, inputStyle } from '@/pages/LoungeEditor';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import ErrorMsg from '@/components/common/input/ErrorMsg';

export default function ContactMethodContainer({
  control,
}: {
  control: Control<FormValues>;
}) {
  const contactMethod = useWatch({ control, name: 'contactMethod' });

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
                <input
                  type="text"
                  className={`${error ? inputStyle.error : inputStyle.default} w-full`}
                  onChange={onChange}
                  value={value}
                />

                {error && (
                  <ErrorMsg
                    msg={error?.message || ''}
                    className="absolute bottom-[-26px] ml-2"
                  />
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
