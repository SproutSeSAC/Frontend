import { type FormValues } from './NoticeModal';

import { Control, Controller, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import TextInput from '@/components/common/input/TextInput';

export default function NoticeModalForm({
  control,
  isPhoneNumberRequired,
}: {
  control: Control<FormValues>;
  isPhoneNumberRequired: boolean;
}) {
  const sessionId = useWatch({ name: 'sessionId', control });
  const phoneNumber = useWatch({ name: 'phoneNumber', control });

  return (
    <div className="flex h-[57px] items-center justify-end gap-6">
      {sessionId > 0 && isPhoneNumberRequired && (
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const formatPhoneNumber = (phoneNum: string) => {
              const numbers = phoneNum.replace(/\D/g, '');

              if (numbers.length <= 11) {
                const match = numbers.match(/^(\d{3})(\d{3,4})(\d{4})$/);
                if (match) {
                  return `${match[1]}-${match[2]}-${match[3]}`;
                }
              }
              return numbers;
            };

            const handleChange = (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const rawValue = event.target.value;

              const numericValue = rawValue.replace(/\D/g, '');
              if (numericValue.length <= 11) {
                onChange(formatPhoneNumber(numericValue));
              }
            };
            return (
              <TextInput
                name="연락처"
                placeholder="연락처를 적어주세요."
                value={value}
                onChange={handleChange}
                className="h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-gray2 focus:border-oliveGreen1"
                errorMsg={error?.message}
              />
            );
          }}
        />
      )}
      <SquareButton
        color={
          (!phoneNumber && isPhoneNumberRequired) || !sessionId
            ? 'gray'
            : 'oliveGreen'
        }
        name="신청하기"
        disabled={(!phoneNumber && isPhoneNumberRequired) || !sessionId}
        type="submit"
        className="h-full self-end whitespace-nowrap px-3 py-[12px] text-xl"
      />
    </div>
  );
}
