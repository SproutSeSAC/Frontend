import { tooltip } from '@/constants';
import { NoticeCategoryDisplayValue } from '@/types';
import { Controller, useFormContext } from 'react-hook-form';

import ControllerDateTime from '@/components/common/input/ControllerDateTime';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import ControllerMeetingType from '@/components/notice/form/ControllerMeetingType';
import ControllerParticipantCapacity from '@/components/notice/form/ControllerParticipantCapacity';
import ControllerSessions from '@/components/notice/form/ControllerSessions';

interface ExtraInfoFormProps {
  noticeType: NoticeCategoryDisplayValue;
}

export default function ExtraInfoForm({ noticeType }: ExtraInfoFormProps) {
  const { control } = useFormContext();

  return (
    <>
      <LabeledSection label="참여 정원">
        <ControllerParticipantCapacity />
      </LabeledSection>

      <LabeledSection label="신청 기간" className="col-span-2">
        <div className="col-span-2 grid w-full grid-cols-[1fr_0.04fr_1fr] items-center gap-2">
          <ControllerDateTime name="applicationStartDateTime" />
          <span className="text-center text-xl">~</span>
          <ControllerDateTime name="applicationEndDateTime" />
        </div>
      </LabeledSection>

      <ControllerSessions noticeType={noticeType} />

      <LabeledSection
        label={`${noticeType} 장소`}
        tooltip={tooltip.meetingType}
      >
        <ControllerMeetingType />
      </LabeledSection>

      <LabeledSection label="만족도 조사" tooltip={tooltip.satisfactionSurvey}>
        <Controller
          control={control}
          name="satisfactionSurvey"
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <TextInput
                name="만족도 조사"
                placeholder="만족도 조사 링크를 적어주세요."
                onChange={onChange}
                className="!h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-mainGray"
                errorMsg={error?.message}
              />
            );
          }}
        />
      </LabeledSection>

      <p className="col-span-2 text-end text-darkGray">
        Zoom, 만족도 조사 링크는 추후에 등록해 주셔도 됩니다.
      </p>
    </>
  );
}
