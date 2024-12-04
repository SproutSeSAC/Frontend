import { useState } from 'react';

import { LIMITLESS_CAPACITY_NUM } from '@/constants';
import { Controller, useFormContext } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';

import NumberInput from '@/components/common/input/NumberInput';

const DEFAULT_CAPACITY_NUM = 30;

export default function ControllerParticipantCapacity() {
  const [isLimited, setIsLimited] = useState(true);

  const toggleLimit = () => setIsLimited(prev => !prev);

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="participantCapacity"
      render={({
        field: { onChange, value: participantCapacityNum },
        fieldState: { error },
      }) => {
        return (
          <div
            className={`relative flex items-center rounded-2xl border bg-white ${error?.message ? 'border-red-600' : 'border-gray4'}`}
          >
            <button
              type="button"
              className={`flex h-full min-w-[125px] items-center gap-2 rounded-l-2xl px-4 py-1.5 ${isLimited ? 'bg-[#fafafa] font-medium text-oliveGreen1' : 'text-gray2'}`}
              onClick={() => {
                onChange(
                  isLimited ? DEFAULT_CAPACITY_NUM : LIMITLESS_CAPACITY_NUM,
                );
                toggleLimit();
              }}
            >
              <span className="">제한 없음</span>
              <FiCheckCircle className="size-4" />
            </button>

            <NumberInput
              name="인원제한"
              placeholder="10"
              onChange={e => {
                const { valueAsNumber } = e.target;
                onChange(Number.isNaN(valueAsNumber) ? '' : valueAsNumber);
              }}
              className={`border-y-0 border-r-0 ${error?.message ? '' : 'border-l text-gray2'} mr-0 !h-full !rounded-l-none rounded-r-2xl px-4 py-[18px] text-lg text-text placeholder:text-gray2`}
              errorMsg={error?.message}
              value={participantCapacityNum}
              disabled={isLimited}
            />
          </div>
        );
      }}
    />
  );
}
