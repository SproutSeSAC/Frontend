import { hours, minutes } from '@/constants/optionList';
import { Controller, useFormContext } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import DateInput from '@/components/common/input/DateInput';

interface ControllerDateTimeProps {
  name: 'applicationStartDateTime' | 'applicationEndDateTime';
}

export default function ControllerDateTime({ name }: ControllerDateTimeProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const date = new Date(value);

        const hour = date.getHours();
        const selectedHourOption = hours.find(({ id }) => id === hour);

        const minute = date.getMinutes();
        const selectedMinuteOption = minutes.find(({ id }) => id === minute);

        return (
          <div className="relative flex w-full items-center gap-1.5 [&>label]:static">
            <DateInput
              value={value}
              onChange={onChange}
              errorMsg={error?.message}
            />
            <SingleSelectDropdown
              defaultLabel="시"
              options={hours}
              selectedOption={selectedHourOption}
              onChangeValue={data => {
                date.setHours(data[0].id, 0, 0, 0);
                return onChange(date.toString());
              }}
              errorMsg={error?.message ? ' ' : undefined}
              selectBoxClassName="min-w-[95px]"
              optionClassName="hover:bg-vividGreen3 text-gray1"
            />
            <SingleSelectDropdown
              defaultLabel="분"
              options={minutes}
              selectedOption={selectedMinuteOption}
              onChangeValue={data => {
                date.setMinutes(data[0].id, 0, 0);
                return onChange(date.toString());
              }}
              errorMsg={error?.message ? ' ' : undefined}
              selectBoxClassName="min-w-[95px]"
              optionClassName="hover:bg-vividGreen3 text-gray1"
            />
          </div>
        );
      }}
    />
  );
}
