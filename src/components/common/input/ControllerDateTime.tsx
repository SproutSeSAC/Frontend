import { hours, minutes } from '@/constants/optionList';
import { formatDate } from '@/utils';
import { Controller, useFormContext } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import CustomDatePicker from '@/components/common/input/CustomDatePicker';

interface ControllerDateTimeProps {
  type?: 'date' | 'dateTime';
  name: string;
}

export default function ControllerDateTime({
  type = 'dateTime',
  name,
}: ControllerDateTimeProps) {
  const { control } = useFormContext();

  return (
    <>
      {type === 'date' && (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <CustomDatePicker
                id={name}
                currentDate={value ? new Date(value) : undefined}
                onChange={data => {
                  if (data) {
                    const dateTime = formatDate(data, "yyyy-MM-dd'T'HH:mm:ss");
                    onChange(dateTime);
                  }
                }}
                errorMsg={error?.message || ''}
              />
            );
          }}
        />
      )}

      {type === 'dateTime' && (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const date = new Date(value);

            const hour = date.getHours();
            const selectedHourOption = hours.find(({ id }) => id === hour);

            const minute = date.getMinutes();
            const selectedMinuteOption = minutes.find(
              ({ id }) => id === minute,
            );

            return (
              <div className="relative flex h-full w-full items-center gap-1.5">
                <CustomDatePicker
                  id={name}
                  currentDate={value ? new Date(value) : undefined}
                  onChange={data => {
                    if (data) {
                      const dateTime = formatDate(
                        data,
                        "yyyy-MM-dd'T'HH:mm:ss",
                      );
                      onChange(dateTime);
                    }
                  }}
                  errorMsg={error?.message || ''}
                />

                <SingleSelectDropdown
                  defaultLabel="시"
                  options={hours}
                  selectedOption={selectedHourOption}
                  onChangeValue={data => {
                    const dateToFormat = date.setHours(data[0].id, 0, 0, 0);
                    const dateTime = formatDate(
                      dateToFormat,
                      "yyyy-MM-dd'T'HH:mm:ss",
                    );
                    return onChange(dateTime);
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
                    const dateToFormat = date.setMinutes(data[0].id, 0, 0);
                    const dateTime = formatDate(
                      dateToFormat,
                      "yyyy-MM-dd'T'HH:mm:ss",
                    );
                    return onChange(dateTime);
                  }}
                  errorMsg={error?.message ? ' ' : undefined}
                  selectBoxClassName="min-w-[95px]"
                  optionClassName="hover:bg-vividGreen3 text-gray1"
                />
              </div>
            );
          }}
        />
      )}
    </>
  );
}
