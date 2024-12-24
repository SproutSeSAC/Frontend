import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import {
  defaultNoticeFormValues,
  noticeCategoryListOfForm,
  specialLectureEventFormValues,
} from '@/constants';
import {
  useCalendarData,
  useDialogContext,
  useGetUserAclList,
  usePageBlocker,
  useSubmitNotice,
} from '@/hooks';
import {
  NoticeCategoryDisplayKey,
  NoticeDto,
  Option,
  SpecialLectureOrEventValue,
} from '@/types';
import { isManagerAndAdmin } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import CircleNumber from '@/components/common/CircleNumber';
import LoopLoading from '@/components/common/LoopLoading';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import LabeledSection from '@/components/common/input/LabeledSection';
import ControllerContentEditor from '@/components/common/text-editor/ControllerContentEditor';
import ExtraInfoForm from '@/components/notice/form/ExtraInfoForm';
import { NoticeConditionalFormSchema } from '@/components/notice/form/NoticeFormSchema';

export default function NoticeForm() {
  const methods = useForm<NoticeDto.PostNotice>({
    defaultValues: defaultNoticeFormValues,
    resolver: zodResolver(NoticeConditionalFormSchema),
  });

  const { alert, hideDialog } = useDialogContext();

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitted },
    reset,
    getValues,
  } = methods;

  const { courseCalendarList } = useCalendarData();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { onSubmit, onError, findCurrNotice, isCreateEventsPending } =
    useSubmitNotice();

  const navigate = useNavigate();

  usePageBlocker({
    isBlockRefresh: true,
    form: { isDirty, isSubmitted },
  });

  const setConditionalKey = (type: NoticeCategoryDisplayKey) => {
    if (type === 'SPECIAL_LECTURE' || type === 'EVENT') {
      reset({ ...specialLectureEventFormValues, ...getValues() });
    } else {
      const { noticeType, title, content, targetCourseIdList } = getValues();
      reset({ noticeType, title, content, targetCourseIdList });
    }
  };

  const noticeKey = useWatch({ control, name: 'noticeType' });

  const { hasNotAclCalendarList } = useGetUserAclList();

  const onTargetCourseIdChange = (
    data: Option[],
    onChange: (event: number[]) => void,
  ) => {
    const courseIds = data.map(({ id }) => id);

    const selectedCourseCalendarList = courseCalendarList.filter(
      ({ courseId }) => courseIds.includes(courseId),
    );

    // 캘린더 비생성 확인 Alert
    const isNotCreatedCalendarCourseTitle = selectedCourseCalendarList
      .filter(calendar => !calendar.isCreated)
      .map(({ courseTitle }) => courseTitle);

    if (isNotCreatedCalendarCourseTitle.length > 0) {
      return alert({
        text: `${isNotCreatedCalendarCourseTitle.join(', ')} 캘린더가 아직 생성되어 있지 않습니다!`,
        subText: '일정 관리 페이지에서 캘린더를 먼저 생성해주세요.',
        subTextColor: 'green',
        buttonList: [
          {
            name: '나가기',
            color: 'gray',
            onClick: () => hideDialog(),
          },
          {
            name: '바로 이동하기',
            onClick: () => {
              hideDialog();
              navigate('/schedule');
            },
          },
        ],
      });
    }

    // 캘린더 권한 확인 Alert
    const hasNotAclCourse = hasNotAclCalendarList.find(({ courseId }) =>
      courseIds.includes(courseId),
    );

    if (hasNotAclCourse) {
      return alert({
        text: `${hasNotAclCourse.courseTitle} 교육과정 캘린더에 일정관리 권한이 부여되지 않았습니다.`,
        subText:
          '잠시만 기다려주시면 바로 관리자가 확인 후 권한을 부여해드리겠습니다.',
        subTextColor: 'green',
        buttonList: [
          {
            name: '확인',
            onClick: hideDialog,
          },
        ],
      });
    }
    return onChange(courseIds);
  };

  const { data: { role } = initialUserProfile } = useGetUserProfile();

  useEffect(() => {
    if (!isManagerAndAdmin(role)) {
      navigate(-1);
    }
  }, [navigate, role]);

  return (
    <>
      {isCreateEventsPending && (
        <div className="fixed inset-0 bottom-0 top-0 z-[1000] flex flex-col items-center justify-center gap-10 bg-gray-500 bg-opacity-10">
          <LoopLoading />
          <span className="text-lg font-medium text-gray1">
            캘린더에 일정을 생성중입니다...
          </span>
        </div>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-[26px]">
          <section>
            <header className="mb-6 flex items-center gap-1.5">
              <CircleNumber number={1} />
              <Title as="h1" title="공지사항 대상 과정" />
            </header>
            <div className="relative mb-16 mt-6 grid grid-cols-2 gap-8 text-lg">
              <Controller
                control={control}
                name="targetCourseIdList"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const courseListOption = userProfile?.courseList.map(
                    ({ courseId, courseTitle }) => ({
                      id: courseId,
                      name: courseTitle,
                    }),
                  );

                  return (
                    <MultiSelectDropdown
                      defaultLabel="교육과정을 선택해주세요."
                      options={courseListOption}
                      value={value}
                      onChangeValue={data => {
                        onTargetCourseIdChange(data, onChange);
                      }}
                      errorMsg={error?.message}
                      hasFullCheck={courseListOption.length > 1}
                    />
                  );
                }}
              />
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
                    const selectedOption = findCurrNotice(value);

                    return (
                      <SingleSelectDropdown
                        defaultLabel="일반공지, 특강, 취업정보 ..."
                        options={noticeCategoryListOfForm}
                        selectedOption={selectedOption}
                        onChangeValue={data => {
                          const newNoticeKey = data[0]
                            .key as NoticeCategoryDisplayKey;
                          onChange(newNoticeKey);
                          setConditionalKey(newNoticeKey);
                        }}
                        errorMsg={error?.message}
                      />
                    );
                  }}
                />
              </LabeledSection>

              {findCurrNotice(noticeKey)?.needExtraInfo && (
                <ExtraInfoForm
                  noticeType={
                    findCurrNotice(noticeKey)
                      ?.name as SpecialLectureOrEventValue
                  }
                />
              )}
            </div>
          </section>

          {/* 에디터  */}
          <section>
            <header className="mt-12 flex items-center gap-1.5">
              <CircleNumber
                number={findCurrNotice(noticeKey)?.needExtraInfo ? 3 : 2}
              />
              <Title as="h1" title="공지사항 상세 내용" />
            </header>

            <ControllerContentEditor type="notice" />

            <div className="mt-8 flex w-full items-center justify-end gap-4 text-end">
              <SquareButton
                name="취소"
                color="gray"
                type="button"
                onClick={() => navigate('/notice')}
              />
              <SquareButton name="등록하기" type="submit" />
            </div>
          </section>
        </form>
      </FormProvider>
    </>
  );
}
