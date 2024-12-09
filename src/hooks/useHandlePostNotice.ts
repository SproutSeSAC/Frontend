import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useCalendarData } from '@/hooks/useCalendarData';
import { useDialogContext } from '@/hooks/useDialogContext';

import { usePostNotice } from '@/services/notice/noticeMutations';
import { useCreateEventsForMultipleCalendars } from '@/services/schedule/calendarMutations';

import { noticeCategoryList } from '@/constants';
import {
  GoogleCalendarApiDto,
  NoticeCategoryDisplayKey,
  NoticeDto,
} from '@/types';
import { SubmitErrorHandler } from 'react-hook-form';

import { Session } from '@/components/notice/form/ControllerSessions';
import { SessionSchemaType } from '@/components/notice/form/NoticeFormSchema';

export const useHandlePostNotice = () => {
  const { showToast, alert, hideDialog } = useDialogContext();

  const findCurrNotice = useCallback((key: NoticeCategoryDisplayKey) => {
    return noticeCategoryList.find(option => key === option.key);
  }, []);

  const { courseCalendarList } = useCalendarData();

  const navigate = useNavigate();

  const { mutateAsync, isPending: isCreateEventsPending } =
    useCreateEventsForMultipleCalendars();

  const confirmBtn = {
    name: '확인',
    onClick: () => {
      hideDialog();
      navigate('/notice');
    },
  };

  const createEventsForTargetCourse = (data: {
    sessions: SessionSchemaType[];
    title: string;
    targetCourseIdList: number[];
    meetingPlace?: string;
  }) => {
    const { sessions, title, meetingPlace, targetCourseIdList } = data;

    const eventsFromSession: GoogleCalendarApiDto.PostEvent[] = sessions.map(
      (session, index) => ({
        summary: `${title} ${index + 1}회차`,
        start: { dateTime: session.sessionStartDateTime },
        end: { dateTime: session.sessionEndDateTime },
        location: meetingPlace,
      }),
    );

    const targetCalendar = courseCalendarList.filter(({ courseId }) =>
      targetCourseIdList.includes(courseId),
    );

    const events = targetCalendar.map(({ calendarId, courseTitle }) => ({
      calendarId,
      events: eventsFromSession.map(event => ({
        ...event,
        description: courseTitle,
      })),
    }));

    return mutateAsync(events);
  };

  // 2. TODO: 교육과정 캘린더가 생성되어있지만 일정관리 권한을 대기중인 경우 - 일단 공지사항 등록 후 등록된 공지사항에서 추가 버튼.
  // 3. TODO: 캘린더 권한 비교 표, 비교후 length가 다르면 ADMIN에게 alert

  const { mutate } = usePostNotice({
    onError: () => {
      alert({
        text: '공지사항 등록 중 오류가 발생했습니다.',
        subText: '다시 시도해주세요.',
        buttonList: [confirmBtn],
      });
    },
    onSuccess: async (_, data: NoticeDto.PostNotice) => {
      const currNotice = findCurrNotice(data.noticeType);

      if (currNotice?.needExtraInfo && data.sessions) {
        await createEventsForTargetCourse({
          sessions: data.sessions,
          title: data.title,
          targetCourseIdList: data.targetCourseIdList,
          meetingPlace: data.meetingPlace,
        });
        alert({
          dimClick: false,
          text: '공지사항이 성공적으로 등록되었습니다!',
          subText: `${currNotice?.name} 일정이 각 교육과정 캘린더에 추가되었습니다!`,
          buttonList: [confirmBtn],
        });
      } else {
        alert({
          dimClick: false,
          text: '공지사항이 성공적으로 등록되었습니다!',
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

  const onSubmit = async (submittedValue: NoticeDto.PostNotice) => {
    const {
      noticeType,
      title,
      content,
      targetCourseIdList,
      satisfactionSurvey,
      sessions,
    } = submittedValue;

    const sessionsWithNoId = (sessions as Session[])?.map(
      ({ id, ...rest }) => rest,
    );

    if (noticeType === 'SPECIAL_LECTURE' || noticeType === 'EVENT') {
      const formValue = {
        ...submittedValue,
        satisfactionSurvey: satisfactionSurvey || '',
        sessions: sessionsWithNoId,
      };
      mutate(formValue);
    } else {
      const formValue = { noticeType, title, content, targetCourseIdList };
      mutate(formValue);
    }
  };

  return {
    onError,
    findCurrNotice,
    onSubmit,
    isCreateEventsPending,
  };
};
