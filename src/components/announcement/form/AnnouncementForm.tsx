import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';

import {
  announcementCategoryOptions,
  defaultAnnouncementFormValues,
  tooltip,
} from '@/constants/announcement';
import { AnnouncementDto } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { AnnouncementFormSchema } from '@/components/announcement/form/AnnouncementFormSchema';
import ControlMeetingType from '@/components/announcement/form/ControlMeetingType';
import ControllerParticipantCapacity from '@/components/announcement/form/ControllerParticipantCapacity';
import ControllerSessions from '@/components/announcement/form/ControllerSessions';
import CircleNumber from '@/components/common/CircleNumber';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import ControllerDateTime from '@/components/common/input/ControllerDateTime';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import ControllerContentEditor from '@/components/common/text-editor/ControllerContentEditor';

export default function AnnouncementForm() {
  const methods = useForm<AnnouncementDto.PostRequest>({
    defaultValues: defaultAnnouncementFormValues,
    resolver: zodResolver(AnnouncementFormSchema),
  });

  const { handleSubmit, control } = methods;

  // NOTE: 삭제 예정
  const { data: userProfile = initialUserProfile } = useGetUserProfile();
  const { data: allCampusList } = useGetCampusList();
  const userCampus = allCampusList?.find(
    ({ name }) => name === userProfile?.campusList[0],
  );
  const { data: courseList } = useGetCourseList(userCampus?.id);
  // ------

  const noticeType = useWatch({ control, name: 'noticeType' });

  const isNeedMoreInfoNoticeType =
    noticeType === 'SPECIAL_LECTURE' || noticeType === 'EVENT';

  const noticeTypeName = noticeType === 'SPECIAL_LECTURE' ? '특강' : '행사';

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(() => {})} className="mt-[26px]">
        <section>
          <header className="mb-6 flex items-center gap-1.5">
            <CircleNumber number={1} />
            <Title as="h1" title="공지사항 대상 과정" />
          </header>
          <div className="relative mb-16 mt-6 grid grid-cols-2 gap-8 text-lg">
            {courseList && (
              <Controller
                control={control}
                name="targetCourseList"
                render={({ field: { onChange }, fieldState: { error } }) => {
                  const courseListOption = courseList.map(({ id, title }) => ({
                    id,
                    name: title,
                  }));
                  return (
                    <MultiSelectDropdown
                      defaultLabel="교육과정을 선택해주세요."
                      options={courseListOption}
                      onChangeValue={data => {
                        const ids = data.map(({ id }) => id);
                        onChange(ids);
                      }}
                      errorMsg={error?.message}
                      hasFullCheck
                    />
                  );
                }}
              />
            )}
          </div>
        </section>

        <section>
          <header className="flex items-center gap-1.5">
            <CircleNumber number={2} />
            <Title as="h1" title="공지사항 상세 정보" />
          </header>

          <div className="relative mb-16 mt-8 grid grid-cols-2 gap-8 text-lg">
            <LabeledSection label="공지 유형">
              <Controller
                control={control}
                name="noticeType"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const selectedOption = announcementCategoryOptions.find(
                    ({ key }) => key === value,
                  );
                  return (
                    <SingleSelectDropdown
                      defaultLabel="일반공지, 특강, 취업정보 ..."
                      options={announcementCategoryOptions}
                      selectedOption={selectedOption}
                      onChangeValue={data => onChange(data[0].key)}
                      errorMsg={error?.message}
                    />
                  );
                }}
              />
            </LabeledSection>

            {isNeedMoreInfoNoticeType && (
              <>
                <LabeledSection label="신청 폼">
                  <Controller
                    control={control}
                    name="applicationForm"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => {
                      return (
                        <TextInput
                          name="신청 폼"
                          placeholder="Google Forms 링크 등을 적어주세요."
                          onChange={onChange}
                          className="!h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-gray2"
                          errorMsg={error?.message}
                        />
                      );
                    }}
                  />
                </LabeledSection>

                <LabeledSection label="신청 기간" className="col-span-2">
                  <div className="flex w-full items-center gap-2">
                    <ControllerDateTime name="applicationStartDateTime" />
                    <span className="text-xl">~</span>
                    <ControllerDateTime name="applicationEndDateTime" />
                  </div>
                </LabeledSection>

                <ControllerSessions noticeType={noticeTypeName} />

                <LabeledSection
                  label={`${noticeTypeName} 장소`}
                  tooltip={tooltip.meetingType}
                >
                  <ControlMeetingType />
                </LabeledSection>

                <LabeledSection label="인원 제한">
                  <ControllerParticipantCapacity />
                </LabeledSection>

                <LabeledSection
                  label="만족도 조사"
                  tooltip={tooltip.satisfactionSurvey}
                >
                  <Controller
                    control={control}
                    name="satisfactionSurvey"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => {
                      return (
                        <div className="relative">
                          <TextInput
                            name="만족도 조사"
                            placeholder="만족도 조사 링크를 적어주세요."
                            onChange={onChange}
                            className="!h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-gray2"
                            errorMsg={error?.message}
                          />
                        </div>
                      );
                    }}
                  />
                </LabeledSection>

                <p className="self-end text-end text-gray2">
                  Zoom, 만족도 조사 링크는 추후에 등록해 주셔도 됩니다.
                </p>
              </>
            )}
          </div>
        </section>

        {/* 에디터  */}
        <section>
          <header className="mt-12 flex items-center gap-1.5">
            <CircleNumber number={isNeedMoreInfoNoticeType ? 3 : 2} />
            <Title as="h1" title="공지사항 상세 정보" />
          </header>

          <ControllerContentEditor type="announcement" />

          <div className="mt-8 flex w-full items-center justify-end gap-4 text-end">
            <SquareButton name="취소" color="gray" type="button" />
            <SquareButton name="등록하기" type="submit" />
          </div>
        </section>
      </form>
    </FormProvider>
  );
}
