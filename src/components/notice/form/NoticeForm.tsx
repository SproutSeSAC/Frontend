import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { defaultNoticeFormValues } from '@/constants';
import { useEditNotice, usePageBlocker, useSubmitNotice } from '@/hooks';
import { NoticeDto, SpecialLectureOrEventValue } from '@/types';
import { findCurrNotice, isTrainee } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import CircleNumber from '@/components/common/CircleNumber';
import LoopLoading from '@/components/common/LoopLoading';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import LabeledSection from '@/components/common/input/LabeledSection';
import ControllerContentEditor from '@/components/common/text-editor/ControllerContentEditor';
import ControllerNoticeType from '@/components/notice/form/ControllerNoticeType';
import ControllerTargetCourses from '@/components/notice/form/ControllerTargetCourses';
import ExtraInfoForm from '@/components/notice/form/ExtraInfoForm';
import { NoticeConditionalFormSchema } from '@/components/notice/form/NoticeFormSchema';

export default function NoticeForm() {
  const {
    targetCourses,
    title,
    content,
    noticeType,
    id: editNoticeId,
    ...rest
  }: NoticeDto.GetNoticeDetail = useLocation()?.state || { state: null };

  const { onSubmit, onError, isCreateEventsPending } = useSubmitNotice();

  const { onEditSubmit } = useEditNotice({ noticeId: editNoticeId, content });

  const NoticeExtraDetailToForm = {
    applicationStartDateTime: rest.applicationStartDateTime,
    applicationEndDateTime: rest.applicationEndDateTime,
    meetingPlace: rest.meetingPlace,
    meetingType: rest.meetingType,
    satisfactionSurvey: rest.satisfactionSurvey,
    participantCapacity: rest.participantCapacity,
    sessions: rest?.sessions?.map(
      ({ sessionEndDateTime, sessionStartDateTime }, index) => ({
        id: index + 1,
        sessionEndDateTime,
        sessionStartDateTime,
      }),
    ),
  };

  const editNoticeDetailToForm: NoticeDto.PostNotice = {
    noticeType,
    title,
    content,
    targetCourseIdList: targetCourses?.map(({ courseId }) => courseId),
    ...(findCurrNotice(noticeType)?.needExtraInfo
      ? NoticeExtraDetailToForm
      : {}),
  };

  const methods = useForm<NoticeDto.PostNotice>({
    defaultValues: editNoticeId
      ? editNoticeDetailToForm
      : defaultNoticeFormValues,
    resolver: zodResolver(NoticeConditionalFormSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitted },
  } = methods;

  const navigate = useNavigate();

  usePageBlocker({
    isBlockRefresh: true,
    form: { isDirty, isSubmitted },
  });

  const noticeKey = useWatch({ control, name: 'noticeType' });

  const { data: { role } = initialUserProfile } = useGetUserProfile();

  useEffect(() => {
    if (isTrainee(role)) {
      navigate(-1);
    }
  }, [navigate, role]);

  return (
    <>
      {isCreateEventsPending && (
        <div className="fixed inset-0 bottom-0 top-0 z-[1000] flex flex-col items-center justify-center gap-10 bg-gray-500 bg-opacity-10">
          <LoopLoading />
          <span className="text-lg font-medium text-darkGray-active">
            캘린더에 일정을 생성중입니다...
          </span>
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            editNoticeId ? onEditSubmit : onSubmit,
            onError,
          )}
          className="mt-[26px]"
        >
          <section>
            <header className="mb-6 flex items-center gap-1.5">
              <CircleNumber number={1} />
              <Title as="h1" title="공지사항 대상 과정" />
            </header>
            <div className="relative mb-16 mt-6 grid grid-cols-2 gap-8 text-lg">
              <ControllerTargetCourses />
            </div>
          </section>

          <section>
            <header className="flex items-center gap-1.5">
              <CircleNumber number={2} />
              <Title as="h1" title="공지사항 상세 정보" />
            </header>

            <div className="relative mb-16 mt-8 grid grid-cols-2 gap-8 text-lg">
              <LabeledSection label="공지 유형">
                <ControllerNoticeType />
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

            <ControllerContentEditor
              type="공지사항"
              controlNames={{ title: 'title', content: 'content' }}
            />

            <div className="mt-8 flex w-full items-center justify-end gap-4 text-end">
              <SquareButton
                name="취소"
                color="gray"
                type="button"
                onClick={() => navigate('/notice')}
              />
              <SquareButton
                name={noticeType ? '수정하기' : '등록하기'}
                type="submit"
              />
            </div>
          </section>
        </form>
      </FormProvider>
    </>
  );
}
