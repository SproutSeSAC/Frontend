import { hours, minutes } from '@/constants';
import { formatDate } from '@/utils';
import { Controller, useFormContext } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import CustomDatePicker from '@/components/common/input/CustomDatePicker';

// import ErrorMsg from '@/components/common/input/ErrorMsg';

interface ControllerDateTimeProps {
  type?: 'date' | 'dateTime';
  name: string;
}

export default function ControllerDateTime({
  type = 'dateTime',
  name,
}: ControllerDateTimeProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="relative flex h-full w-full flex-col">
      {type === 'date' && (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => {
            return (
              <CustomDatePicker
                id={name}
                currentDate={value ? new Date(value) : undefined}
                className={`h-[60px] ${errors[name]?.message ? 'border-red-500' : 'border-mainGray'}`}
                onChange={data => {
                  if (data) {
                    const dateTime = formatDate(data, "yyyy-MM-dd'T'HH:mm:ss");
                    onChange(dateTime);
                  }
                }}
                errorMsg={errors[name]?.message as string}
              />
            );
          }}
        />
      )}

      {type === 'dateTime' && (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => {
            const date = new Date(value);

            const hour = date.getHours();
            const selectedHourOption = hours.find(({ id }) => id === hour);

            const minute = date.getMinutes();
            const selectedMinuteOption = minutes.find(
              ({ id }) => id === minute,
            );

            return (
              <div className="relative grid size-full grid-cols-[2fr_1fr_1fr] items-center gap-1.5">
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
                  className={`!h-[58px] ${errors[name]?.message ? 'border-red-500' : ''}`}
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
                  selectBoxClassName={`min-w-[95px] h-[58px] !gap-0 ${errors[name]?.message ? 'border-red-500' : ''}`}
                  optionClassName="hover:bg-darkGreen-active text-darkGray-active"
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
                  selectBoxClassName={`min-w-[95px] !gap-0 ${errors[name]?.message ? 'border-red-500' : ''}`}
                  optionClassName="hover:bg-darkGreen-active darkGray-activedarkGray-active"
                />
              </div>
            );
          }}
        />
      )}

      {/* {errors[name]?.message && (
        <ErrorMsg
          msg={errors[name]?.message as string}
          className="absolute -bottom-6 left-0 pl-2"
        />
      )} */}
    </div>
  );
}
