import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useCreateEventsForMultipleCalendars } from '@/services/calendar/calendarMutations';
import { usePostMyPost } from '@/services/post/postMutation';

import { useCalendarList, useDialogContext, useHandleImage } from '@/hooks';
import { GoogleCalendarApiDto, NoticeDto } from '@/types';
import { findCurrNotice } from '@/utils';
import { SubmitErrorHandler } from 'react-hook-form';

import { Session } from '@/components/notice/form/ControllerSessions';
import { SessionSchemaType } from '@/components/notice/form/NoticeFormSchema';

export const useSubmitNotice = () => {
  const { showToast, alert, hideDialog } = useDialogContext();

  const queryClient = useQueryClient();

  const { courseCalendarList } = useCalendarList();

  const navigate = useNavigate();

  const { mutateAsync: mutateCreateEvent, isPending: isCreateEventsPending } =
    useCreateEventsForMultipleCalendars();

  const confirmBtn = {
    name: '확인',
    onClick: async () => {
      hideDialog();
      await queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteNoticeList'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['useGetThisWeekNoticeList'],
        exact: false,
      });
      navigate('/notice');
    },
  };

  const createEventsForTargetCourse = (data: {
    sessions: SessionSchemaType[];
    title: string;
    targetCourseIdList: number[];
    meetingPlace?: string;
    linkedPost: string;
  }) => {
    const { sessions, title, meetingPlace, targetCourseIdList, linkedPost } =
      data;

    const eventsFromSession: GoogleCalendarApiDto.PostEvent[] = sessions.map(
      ({ sessionEndDateTime, sessionStartDateTime }, index) => ({
        summary: `${title} ${index + 1}회차`,
        start: {
          dateTime: sessionStartDateTime,
          timeZone: 'Asia/Seoul',
        },
        end: {
          dateTime: sessionEndDateTime,
          timeZone: 'Asia/Seoul',
        },
        location: meetingPlace,
        description: linkedPost,
      }),
    );

    const targetCalendar = courseCalendarList.filter(({ courseId }) =>
      targetCourseIdList.includes(courseId),
    );

    const events = targetCalendar.map(({ calendarId }) => ({
      calendarId,
      events: eventsFromSession,
    }));

    return mutateCreateEvent(events);
  };

  const { mutateAsync: postNotice, isPending: isPostMyPostPending } =
    usePostMyPost<NoticeDto.PostNotice>({
      onError: () => {
        alert({
          text: '공지사항 등록 중 오류가 발생했습니다.',
          subText: '다시 시도해주세요.',
          buttonList: [confirmBtn],
        });
      },
      onSuccess: async (successResData, data: NoticeDto.PostNotice) => {
        const currNotice = findCurrNotice(data.noticeType);

        if (!currNotice?.needExtraInfo) {
          alert({
            dimClick: false,
            text: '공지사항이 성공적으로 등록되었습니다!',
            buttonList: [confirmBtn],
          });
          return;
        }

        if (currNotice?.needExtraInfo && data.sessions) {
          const { sessions, title, targetCourseIdList, meetingPlace } = data;
          await createEventsForTargetCourse({
            sessions,
            title,
            targetCourseIdList,
            meetingPlace,
            linkedPost: `/notice/post/${(successResData as { second: number })?.second}`,
          });
          alert({
            dimClick: false,
            text: '공지사항이 성공적으로 등록되었습니다!',
            subText: `${currNotice?.name} 일정이 교육과정 캘린더에 추가되었습니다!`,
            buttonList: [confirmBtn],
          });
        }
      },
    });

  const onError: SubmitErrorHandler<NoticeDto.PostNotice> = errors => {
    const firstErrorKey = Object?.keys(
      errors,
    )?.[0] as keyof NoticeDto.PostNotice;
    const firstErrorMsg = errors[firstErrorKey]?.message;
    if (firstErrorMsg) {
      showToast(firstErrorMsg);
    }
  };

  const { handleImagesInHtmlContent } = useHandleImage();

  const onSubmit = async (submittedValue: NoticeDto.PostNotice) => {
    const {
      noticeType,
      title,
      content,
      targetCourseIdList,
      sessions, //
    } = submittedValue;

    const contentWithHandledImage = await handleImagesInHtmlContent(content);

    const needExtraInfoNoticeType = findCurrNotice(noticeType)?.needExtraInfo;

    if (needExtraInfoNoticeType) {
      const sessionsWithNoId = (sessions as Session[])?.map(
        ({ id, ...rest }) => rest,
      );
      const extraFormValue = {
        ...submittedValue,
        sessions: sessionsWithNoId,
        content: contentWithHandledImage,
      };
      postNotice(extraFormValue);
    }

    if (!needExtraInfoNoticeType) {
      const formValue = {
        noticeType,
        title,
        content: contentWithHandledImage,
        targetCourseIdList,
      };
      postNotice(formValue);
    }
  };

  return {
    onError,
    onSubmit,
    isCreateEventsPending,
    isPostMyPostPending,
  };
};
