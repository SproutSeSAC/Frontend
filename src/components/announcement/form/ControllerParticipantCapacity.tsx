import { useState } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';

import NumberInput from '@/components/common/input/NumberInput';

export default function ControllerParticipantCapacity() {
  const [isLimited, setIsLimited] = useState(true);

  const toggleLimit = () => setIsLimited(prev => !prev);

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="participantCapacity"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        console.log(value);
        return (
          <div
            className={`relative flex items-center rounded-2xl border border-gray4 bg-white ${error?.message ? 'border border-red-600' : ''}`}
          >
            <button
              type="button"
              className={`flex h-full min-w-[155px] items-center gap-2 rounded-l-2xl px-4 py-1.5 ${isLimited ? 'bg-[#fafafa] font-medium text-oliveGreen1' : 'text-gray2'}`}
              onClick={() => {
                if (value === 0) {
                  onChange(10);
                } else {
                  onChange(0);
                }
                toggleLimit();
              }}
            >
              <span className="">인원제한 없음</span>
              <FiCheckCircle className="size-4" />
            </button>

            <NumberInput
              name="인원제한"
              placeholder="10"
              onChange={onChange}
              className={`border-y-0 border-r-0 ${error?.message ? '' : 'border-l text-gray2'} mr-0 !h-full rounded-l-none rounded-r-2xl px-4 py-[18px] text-lg placeholder:text-gray2`}
              errorMsg={error?.message}
              value={value}
              disabled={isLimited}
            />
          </div>
        );
      }}
    />
  );
}
