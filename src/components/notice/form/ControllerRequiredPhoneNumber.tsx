import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';

export default function ControllerRequiredPhoneNumber() {
  const { control } = useFormContext();

  const isRequired = useWatch({ control, name: 'isPhoneNumberRequired' });

  return (
    <Controller
      control={control}
      name="isPhoneNumberRequired"
      render={({ field: { onChange } }) => {
        return (
          <div className="flex h-full gap-2">
            <button
              type="button"
              className={`flex h-full w-full items-center justify-between rounded-2xl border bg-[#fafafa] px-5 py-1.5 ${isRequired ? 'font-medium text-oliveGreen1' : 'text-gray2'}`}
              onClick={() => onChange(true)}
            >
              <span>입력 요청 필수</span>
              <FiCheckCircle className="size-4" />
            </button>

            <button
              type="button"
              className={`flex h-full w-full items-center justify-between rounded-2xl border bg-[#fafafa] px-5 py-1.5 ${!isRequired ? 'font-medium text-oliveGreen1' : 'text-gray2'}`}
              onClick={() => onChange(false)}
            >
              <span>입력 요청 비필수</span>
              <FiCheckCircle className="size-4" />
            </button>
          </div>
        );
      }}
    />
  );
}
