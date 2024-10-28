import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';

import {
  announcementCategoryOptions,
  defaultAnnouncementFormValues,
  meetingTypeOptions,
} from '@/constants/announcement';
import { AnnouncementDto } from '@/types';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import AnnouncementTextEditor from '@/components/announcement/editor/AnnouncementTextEditor';
import CircleNumber from '@/components/common/CircleNumber';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import DateInput from '@/components/common/input/DateInput';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import TimeInput from '@/components/common/input/TimeInput';

export default function AnnouncementEditor() {
  const { data: userProfile } = useGetUserProfile();

  const methods = useForm<AnnouncementDto.PostRequest>({
    defaultValues: defaultAnnouncementFormValues,
    // resolver: zodResolver(),
  });

  const { handleSubmit, control } = methods;

  const { data: campusList } = useGetCampusList();
  const userCampus = campusList?.find(
    ({ name }) => name === userProfile?.campusName,
  );

  const { data: courseList } = useGetCourseList(userCampus?.id);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(() => {})} className="mt-[26px]">
        <div className="flex items-center gap-1.5">
          <CircleNumber number={1} />
          <Title as="h1" title="공지사항 대상 과정" />
        </div>
        <div className="relative mb-20 mt-8 grid grid-cols-2 gap-4 text-lg">
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
                    defaultLabel="교육과정 선택"
                    options={courseListOption}
                    onChangeValue={data => {
                      const ids = data.map(item => item.id);
                      onChange(ids);
                    }}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <CircleNumber number={2} />
          <Title as="h1" title="공지사항 필수 정보" />
        </div>
        <div className="relative mb-20 mt-8 grid grid-cols-2 gap-4">
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
                    defaultLabel="공지 유형"
                    options={announcementCategoryOptions}
                    selectedOption={selectedOption}
                    onChangeValue={data => onChange(data[0].key)}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="신청 폼">
            <Controller
              control={control}
              name="applicationForm"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="relative">
                    <TextInput
                      name="신청 폼"
                      placeholder="Google Forms 등"
                      onChange={onChange}
                      className="!h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-gray2"
                    />
                    {error && (
                      <ErrorMsg
                        msg={error?.message || ''}
                        className="absolute bottom-[-26px] ml-2"
                      />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="신청 기간" className="col-span-2">
            <div className="flex w-full items-center gap-2">
              <Controller
                control={control}
                name="applicationStartDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  return (
                    <DateInput
                      value={value}
                      onChange={onChange}
                      errorMsg={error?.message}
                    />
                  );
                }}
              />
              <span className="text-xl">~</span>
              <Controller
                control={control}
                name="applicationEndDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  return (
                    <DateInput
                      value={value}
                      onChange={onChange}
                      errorMsg={error?.message}
                    />
                  );
                }}
              />
            </div>
          </LabeledSection>

          <LabeledSection label="일시">
            <Controller
              control={control}
              name="eventSchedule"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <DateInput
                    value={value}
                    onChange={onChange}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="시간">
            <Controller
              control={control}
              name="eventTime"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <TimeInput
                    value={value}
                    onChange={onChange}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="온오프라인">
            <Controller
              control={control}
              name="meetingType"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = meetingTypeOptions.find(
                  ({ key }) => key === value.type,
                );
                return (
                  <div className="relative">
                    <div className="flex items-center rounded-2xl border border-gray4 bg-white">
                      <SingleSelectDropdown
                        defaultLabel="온오프라인"
                        options={meetingTypeOptions}
                        selectedOption={selectedOption}
                        onChangeValue={data => {
                          const option = {
                            type: data[0].key,
                            name: data[0].name,
                          };
                          onChange(option);
                        }}
                        selectBoxClassName="min-w-[140px] h-[40px] my-2 border-0 border-r rounded-r-none pr-3"
                      />
                      <TextInput
                        name="신청 폼"
                        placeholder="온라인, 오프라인을 먼저 선택해주세요."
                        value={value.detail}
                        onChange={onChange}
                        className="!mr-0 h-full !rounded-2xl border-none py-[18px] pl-3 pr-4 text-lg placeholder:text-gray2"
                      />
                    </div>
                    {error && (
                      <ErrorMsg
                        msg={error?.message || ''}
                        className="absolute bottom-[-26px] ml-2"
                      />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="만족도 조사">
            <Controller
              control={control}
              name="satisfactionSurvey"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="relative">
                    <TextInput
                      name="만족도 조사"
                      placeholder="만족도 조사 링크를 적어주세요."
                      onChange={onChange}
                      className="!h-full !rounded-2xl px-4 py-[18px] text-lg placeholder:text-gray2"
                    />
                    {error && (
                      <ErrorMsg
                        msg={error?.message || ''}
                        className="absolute bottom-[-26px] ml-2"
                      />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>
        </div>

        <div className="mt-16 flex items-center gap-1.5">
          <CircleNumber number={2} />
          <Title as="h1" title="프로젝트 상세 정보" />
        </div>
        <div className="w-full">
          <LabeledSection label="제목" className="mb-6 mt-8">
            <Controller
              control={control}
              name="title"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <TextInput
                    value={value}
                    name="제목"
                    placeholder="제목을 입력해주세요."
                    onChange={onChange}
                    className="!mr-0 h-full !rounded-2xl border-none py-[18px] pl-3 pr-4 text-lg placeholder:text-gray2"
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>
          <AnnouncementTextEditor />
        </div>
        <div className="flax mt-8 w-full items-center justify-end gap-4 text-end">
          <button
            type="button"
            className="mr-2 rounded-lg bg-gray2 px-4 py-2 tracking-tight text-white"
            // onClick={handleLeave}
          >
            취소
          </button>
          <SquareButton name="등록하기" type="submit" />
        </div>
      </form>
    </FormProvider>
  );
}
