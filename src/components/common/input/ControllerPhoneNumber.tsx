import { formatPhoneNumber } from '@/utils';
import { Controller, useFormContext } from 'react-hook-form';

import TextInput from '@/components/common/input/TextInput';

interface ControllerPhoneNumberProps {
  name: string;
}

export default function ControllerPhoneNumber({
  name,
}: ControllerPhoneNumberProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = event.target.value;

          const onlyNumericValue = rawValue.replace(/\D/g, '');

          if (onlyNumericValue.length <= 11) {
            onChange(formatPhoneNumber(onlyNumericValue));
          }
        };

        return (
          <TextInput
            name="연락처"
            placeholder="전화번호를 적어주세요. (숫자만 적어주세요)"
            value={value}
            onChange={handleChange}
            className="h-[50px] !rounded-2xl px-4 py-[18px] placeholder:text-mainGray"
            errorMsg={error?.message}
            maxLength={13}
          />
        );
      }}
    />
  );
}
