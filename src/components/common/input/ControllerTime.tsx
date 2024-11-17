import { hours, minutes } from '@/constants/optionList';
import { Controller, useFormContext } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';

interface ControllerTimeProps {
  name: 'eventStartTime' | 'eventEndTime';
}

export default function ControllerTime({ name }: ControllerTimeProps) {
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
          <div className="flex w-full items-center gap-1.5 [&>div]:w-full">
            <SingleSelectDropdown
              defaultLabel="시"
              options={hours}
              selectedOption={selectedHourOption}
              onChangeValue={data => onChange(data[0].id)}
              errorMsg={error?.message ? ' ' : undefined}
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
              optionClassName="hover:bg-vividGreen3 text-gray1"
            />
          </div>
        );
      }}
    />
  );
}
