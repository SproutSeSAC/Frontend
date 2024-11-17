import { useState } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

import CustomDatePicker from '@/components/common/CustomDatePicker';
import XButton from '@/components/common/button/XButton';
import ControllerTime from '@/components/common/input/ControllerTime';
import LabeledSection from '@/components/common/input/LabeledSection';

interface ControllerSessionsProps {
  noticeType: '특강' | '행사';
}

export default function ControllerSessions({
  noticeType,
}: ControllerSessionsProps) {
  const [totalSession, setTotalSession] = useState(1);

  const { control } = useFormContext();

  const sessions = Array.from({ length: totalSession }, (_, i) => i + 1);

  return (
    <div className="col-span-2 mt-1 rounded-2xl border bg-[#eeeeee] p-3">
      {sessions.map(session => (
        <LabeledSection
          key={session}
          label={`${noticeType} ${sessions.length === 1 ? '' : `${session}회차`} 일시`}
          className="col-span-2 mb-2 grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg p-2.5 hover:bg-gray3"
        >
          {sessions.length > 1 && (
            <XButton
              onDeleteClick={() => setTotalSession(prev => prev - 1)}
              iconClassName="!text-text !size-6"
              className="flex justify-end pr-2"
            />
          )}

          <div className="col-span-2 flex gap-4">
            <Controller
              control={control}
              name="eventDate"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <CustomDatePicker
                    currentDate={value ? new Date(value) : undefined}
                    onChange={onChange}
                    errorMsg={error?.message}
                  />
                );
              }}
            />

            <div className="flex w-full items-center gap-2">
              <ControllerTime name="eventStartTime" />
              <span className="text-xl">~</span>
              <ControllerTime name="eventEndTime" />
            </div>
          </div>
        </LabeledSection>
      ))}

      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-2.5 py-1.5"
        onClick={() => setTotalSession(prev => prev + 1)}
        disabled={sessions.length >= 4}
      >
        <FaPlus
          className={`text-base ${sessions.length >= 4 ? 'text-gray2' : 'text-oliveGreen1'}`}
        />
        <span
          className={`text-base font-semibold ${sessions.length >= 4 ? 'text-gray2' : 'text-oliveGreen1'}`}
        >
          회차 정보 추가하기
        </span>
      </button>
    </div>
  );
}
