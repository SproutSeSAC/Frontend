import { useState } from 'react';

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
  meetingTypeOptions,
  tooltip,
} from '@/constants/announcement';
import { hours, minutes } from '@/constants/optionList';
import { AnnouncementDto } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

import { AnnouncementEditorSchema } from '@/components/announcement/editor/AnnouncementEditorSchema';
import AnnouncementTextEditor from '@/components/announcement/editor/AnnouncementTextEditor';
import CircleNumber from '@/components/common/CircleNumber';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import XButton from '@/components/common/button/XButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import DateInput from '@/components/common/input/DateInput';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';

export default function AnnouncementEditor() {
  const [totalSession, setTotalSession] = useState(1);

  const methods = useForm<AnnouncementDto.PostRequest>({
    defaultValues: defaultAnnouncementFormValues,
    resolver: zodResolver(AnnouncementEditorSchema),
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
  const noticeTypeName = announcementCategoryOptions.find(
    ({ key }) => key === noticeType,
  )?.name;

  const sessions = Array.from({ length: totalSession }, (_, i) => i + 1);

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
                        const ids = data.map(item => item.id);
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
          <div className="flex items-center gap-1.5">
            <CircleNumber number={2} />
            <Title as="h1" title="공지사항 상세 정보" />
          </div>

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
                        <div className="relative">
                          <TextInput
                            name="신청 폼"
                            placeholder="Google Forms 링크 등을 적어주세요."
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
                      name="applicationStartDateTime"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => {
                        return (
                          <div className="flex w-full items-center gap-1.5">
                            <DateInput
                              value={value}
                              onChange={onChange}
                              errorMsg={error?.message}
                            />
                            <SingleSelectDropdown
                              defaultLabel="시"
                              options={hours}
                              // selectedOption={selectedOption}
                              onChangeValue={data => onChange(data[0].id)}
                              errorMsg={error?.message}
                              selectBoxClassName="min-w-[95px]"
                              optionClassName="hover:bg-vividGreen3 text-gray1"
                            />
                            <SingleSelectDropdown
                              defaultLabel="분"
                              options={minutes}
                              // selectedOption={selectedOption}
                              onChangeValue={data => onChange(data[0].id)}
                              errorMsg={error?.message}
                              selectBoxClassName="min-w-[95px]"
                              optionClassName="hover:bg-vividGreen3 text-gray1"
                            />
                          </div>
                        );
                      }}
                    />
                    <span className="text-xl">~</span>
                    <Controller
                      control={control}
                      name="applicationEndDateTime"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => {
                        return (
                          <div className="flex w-full items-center gap-1.5">
                            <DateInput
                              value={value}
                              onChange={onChange}
                              errorMsg={error?.message}
                            />
                            <SingleSelectDropdown
                              defaultLabel="시"
                              options={hours}
                              // selectedOption={selectedOption}
                              onChangeValue={data => onChange(data[0].id)}
                              errorMsg={error?.message}
                              selectBoxClassName="min-w-[95px]"
                              optionClassName="hover:bg-vividGreen3 text-gray1"
                            />
                            <SingleSelectDropdown
                              defaultLabel="분"
                              options={minutes}
                              // selectedOption={selectedOption}
                              onChangeValue={data => onChange(data[0].id)}
                              errorMsg={error?.message}
                              selectBoxClassName="min-w-[95px]"
                              optionClassName="hover:bg-vividGreen3 text-gray1"
                            />
                          </div>
                        );
                      }}
                    />
                  </div>
                </LabeledSection>

                <LabeledSection
                  label={`${noticeTypeName} 장소`}
                  tooltip={tooltip.meetingType}
                >
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
                                const type = data[0].key;
                                onChange({ ...value, type });
                              }}
                              selectBoxClassName="min-w-[120px] gap-0 h-[40px] my-2 border-0 border-r rounded-r-none pr-3"
                            />
                            <TextInput
                              name="온오프라인"
                              placeholder={
                                value.type === 'ONLINE'
                                  ? 'Zoom 링크를 적어주세요.'
                                  : '장소 위치를 적어주세요.'
                              }
                              value={value.detail}
                              onChange={e =>
                                onChange({ ...value, detail: e.target.value })
                              }
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

                <LabeledSection label="인원 제한">
                  <Controller
                    control={control}
                    name="applicationForm"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => {
                      return (
                        <div className="relative">
                          <TextInput
                            name="인원제한"
                            placeholder="인원제한없음"
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

                <div className="col-span-2 rounded-2xl border bg-[#eeeeee] p-3">
                  {sessions.map(session => (
                    <LabeledSection
                      key={session}
                      label={`${noticeTypeName} ${sessions.length === 1 ? '' : `${session}회차`} 일시`}
                      className="col-span-2 mb-4 grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg p-3 hover:bg-gray3"
                    >
                      {sessions.length > 1 && (
                        <div className="flex justify-end pr-2">
                          <XButton
                            onDeleteClick={() =>
                              setTotalSession(prev => prev - 1)
                            }
                            iconClassName="!text-text !size-6"
                          />
                        </div>
                      )}

                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <Controller
                          control={control}
                          name="eventDate"
                          render={({
                            field: { onChange },
                            fieldState: { error },
                          }) => {
                            return (
                              <DateInput
                                value={new Date().toLocaleDateString()}
                                onChange={onChange}
                                errorMsg={error?.message}
                              />
                            );
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <Controller
                            control={control}
                            name="eventStartTime"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => {
                              // const selectedOption = hours.find(
                              //   ({ id }) => id === value,
                              // );
                              return (
                                <div className="flex w-full items-center gap-1.5">
                                  <div className="flex w-full flex-col">
                                    <SingleSelectDropdown
                                      defaultLabel="시"
                                      options={hours}
                                      selectedOption={hours[0]}
                                      onChangeValue={data =>
                                        onChange(data[0].id)
                                      }
                                      errorMsg={error?.message}
                                      optionClassName="hover:bg-vividGreen3 text-gray1"
                                    />
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <SingleSelectDropdown
                                      defaultLabel="분"
                                      options={minutes}
                                      selectedOption={minutes[0]}
                                      onChangeValue={data =>
                                        onChange(data[0].id)
                                      }
                                      errorMsg={error?.message}
                                      optionClassName="hover:bg-vividGreen3 text-gray1"
                                    />
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <span className="text-xl">~</span>
                          <Controller
                            control={control}
                            name="eventEndTime"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => {
                              // const selectedOption = minutes.find(
                              //   ({ id }) => id === value,
                              // );

                              return (
                                <div className="flex w-full items-center gap-1.5">
                                  <div className="flex w-full flex-col">
                                    <SingleSelectDropdown
                                      defaultLabel="시"
                                      options={hours}
                                      selectedOption={hours[0]}
                                      onChangeValue={data =>
                                        onChange(data[0].id)
                                      }
                                      errorMsg={error?.message}
                                      optionClassName="hover:bg-vividGreen3 text-gray1"
                                    />
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <SingleSelectDropdown
                                      defaultLabel="분"
                                      options={minutes}
                                      selectedOption={minutes[0]}
                                      onChangeValue={data =>
                                        onChange(data[0].id)
                                      }
                                      errorMsg={error?.message}
                                      optionClassName="hover:bg-vividGreen3 text-gray1"
                                    />
                                  </div>
                                </div>
                              );
                            }}
                          />
                        </div>
                      </div>
                    </LabeledSection>
                  ))}

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5"
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

                <p className="self-end text-end text-gray2">
                  Zoom, 만족도 조사 링크는 추후에 등록해 주셔도 됩니다.
                </p>
              </>
            )}
          </div>
        </section>

        <div className="mt-12 flex items-center gap-1.5">
          <CircleNumber number={isNeedMoreInfoNoticeType ? 3 : 2} />
          <Title as="h1" title="공지사항 상세 정보" />
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
