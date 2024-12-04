import { meetingTypeOptions } from '@/constants';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TextInput from '@/components/common/input/TextInput';

export default function ControlMeetingType() {
  const {
    control,
    register,
    formState: { errors },
    clearErrors,
  } = useFormContext();

  const watchedMeetingType = useWatch({ control, name: 'meetingType' });

  return (
    <div
      className={`relative flex items-center rounded-2xl border ${errors?.meetingPlace?.message ? 'border-red-600' : 'border-gray4'} bg-white [&>div:first-child]:w-44`}
    >
      <Controller
        control={control}
        name="meetingType"
        render={({ field: { onChange, value } }) => {
          const selectedOption = meetingTypeOptions.find(
            ({ key }) => key === value,
          );
          return (
            <SingleSelectDropdown
              defaultLabel="온오프라인"
              options={meetingTypeOptions}
              selectedOption={selectedOption}
              onChangeValue={data => {
                const type = data[0].key;
                onChange(type);
                clearErrors('meetingPlace');
              }}
              selectBoxClassName="gap-0 h-[40px] my-2 border-0 border-r rounded-r-none pr-3"
            />
          );
        }}
      />

      <TextInput
        {...register('meetingPlace')}
        placeholder={
          watchedMeetingType === 'ONLINE'
            ? 'Zoom 링크를 적어주세요.'
            : '장소 위치를 적어주세요.'
        }
        className="!mr-0 h-full !w-full !rounded-2xl border-none py-[18px] pl-3 pr-4 text-lg placeholder:text-gray2"
        errorMsg={errors?.meetingPlace?.message as string}
      />
    </div>
  );
}
