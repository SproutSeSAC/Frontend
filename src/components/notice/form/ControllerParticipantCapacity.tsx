import { LIMITLESS_CAPACITY_NUM } from '@/constants';
import { Controller, useFormContext } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';

import NumberInput from '@/components/common/input/NumberInput';

const DEFAULT_CAPACITY_NUM = 30;

export default function ControllerParticipantCapacity() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="participantCapacity"
      render={({
        field: { onChange, value: participantCapacityNum },
        fieldState: { error },
      }) => {
        /* 10000 이상을 값으로 보내면 '제한 없음' */
        const isLimited = participantCapacityNum >= 10000;

        return (
          <div
            className={`relative flex items-center rounded-2xl border bg-white ${error?.message ? 'border-red-600' : 'border-lightGray'}`}
          >
            <button
              type="button"
              className={`flex h-full min-w-[125px] items-center gap-2 rounded-l-2xl px-4 py-1.5 ${isLimited ? 'bg-[#fafafa] font-medium text-mainGreen' : 'text-mainGray'}`}
              onClick={() => {
                onChange(
                  isLimited ? DEFAULT_CAPACITY_NUM : LIMITLESS_CAPACITY_NUM,
                );
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
              className={`border-y-0 border-r-0 ${error?.message ? '' : 'border-l'} mr-0 !h-full !rounded-l-none rounded-r-2xl px-4 py-[18px] text-lg text-black placeholder:text-mainGray`}
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
