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
            placeholder="연락처를 적어주세요 (숫자만 적어주세요)"
            value={value}
            onChange={handleChange}
            className="h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-mainGray focus:border-mainGreen"
            errorMsg={error?.message}
            maxLength={13}
          />
        );
      }}
    />
  );
}
