import { meetingTypeOptions } from '@/constants/announcement';
import { Controller, useFormContext } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TextInput from '@/components/common/input/TextInput';

export default function ControlMeetingType() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="meetingType"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = meetingTypeOptions.find(
          ({ key }) => key === value?.type,
        );

        return (
          <div className="relative flex items-center rounded-2xl border border-gray4 bg-white">
            <SingleSelectDropdown
              defaultLabel="온오프라인"
              options={meetingTypeOptions}
              selectedOption={selectedOption}
              onChangeValue={data => {
                const type = data[0].key;
                onChange({ ...value, type });
              }}
              selectBoxClassName="w-32 gap-0 h-[40px] my-2 border-0 border-r rounded-r-none pr-3"
            />
            <TextInput
              name="온오프라인"
              placeholder={
                value?.type === 'ONLINE'
                  ? 'Zoom 링크를 적어주세요.'
                  : '장소 위치를 적어주세요.'
              }
              value={value?.detail}
              onChange={e => onChange({ ...value, detail: e.target.value })}
              className="!mr-0 h-full !w-full border-none py-[18px] pl-3 pr-4 text-lg placeholder:text-gray2"
              errorMsg={error?.message}
            />
          </div>
        );
      }}
    />
  );
}
