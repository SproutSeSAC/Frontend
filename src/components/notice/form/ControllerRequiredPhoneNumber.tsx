import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';

export default function ControllerRequiredPhoneNumber() {
  const { control } = useFormContext();

  const isRequired = useWatch({ control, name: 'isPhoneNumberRequired' });

  const activeClassName = 'font-medium text-mainGreen';
  const inActiveClassName = 'bg-lightGrey text-mainGray';

  return (
    <Controller
      control={control}
      name="isPhoneNumberRequired"
      render={({ field: { onChange } }) => {
        return (
          <div className="flex h-full gap-2">
            <button
              type="button"
              className={`flex h-full w-full items-center justify-between rounded-2xl border bg-[#fafafa] px-5 py-1.5 ${isRequired ? activeClassName : inActiveClassName}`}
              onClick={() => onChange(true)}
            >
              <span>입력 요청</span>
              <FiCheckCircle className="size-4" />
            </button>

            <button
              type="button"
              className={`flex h-full w-full items-center justify-between rounded-2xl border bg-[#fafafa] px-5 py-1.5 ${!isRequired ? activeClassName : inActiveClassName}`}
              onClick={() => onChange(false)}
            >
              <span>입력 비요청</span>
              <FiCheckCircle className="size-4" />
            </button>
          </div>
        );
      }}
    />
  );
}
