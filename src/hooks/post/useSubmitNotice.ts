import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  useEditNotice,
  usePostNotice,
} from '@/services/notice/noticeMutations';
import { useCreateEventsForMultipleCalendars } from '@/services/schedule/calendarMutations';

import { noticeCategoryList } from '@/constants';
import { useCalendarData, useDialogContext } from '@/hooks';
import {
  GoogleCalendarApiDto,
  NoticeCategoryDisplayKey,
  NoticeDto,
} from '@/types';
import { SubmitErrorHandler } from 'react-hook-form';

import { Session } from '@/components/notice/form/ControllerSessions';
import { SessionSchemaType } from '@/components/notice/form/NoticeFormSchema';

interface UseSubmitNotice {
  isEditing: boolean;
  noticeId: number;
}

export const useSubmitNotice = (props?: UseSubmitNotice) => {
  const { showToast, alert, hideDialog } = useDialogContext();

  const queryClient = useQueryClient();

  const findCurrNotice = useCallback((key: NoticeCategoryDisplayKey) => {
    return noticeCategoryList.find(option => key === option.key);
  }, []);

  const { courseCalendarList } = useCalendarData();

  const navigate = useNavigate();

  const { mutateAsync: mutateCreateEvent, isPending: isCreateEventsPending } =
    useCreateEventsForMultipleCalendars();

  const confirmBtn = {
    name: '확인',
    onClick: async () => {
      hideDialog();
      if (props?.isEditing) {
        await queryClient.invalidateQueries({
          queryKey: ['useGetInfiniteNoticeList'],
          exact: false,
        });
        await queryClient.invalidateQueries({
          queryKey: ['useGetThisWeekNoticeList'],
          exact: false,
        });
        navigate('/notice');
      } else {
        navigate(`/notice/${props?.noticeId}`);
      }
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

    return mutateCreateEvent(events);
  };

  const { mutateAsync: mutateEditedNotice } = useEditNotice({
    onError: () => {
      alert({
        text: '공지사항 수정 중 오류가 발생했습니다.',
        subText: '다시 시도해주세요.',
        buttonList: [confirmBtn],
      });
    },
    onSuccess: async (_, data: NoticeDto.PostNotice) => {
      // NOTE: 교육과정 캘린더 일정도 수정해야함.
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
          text: props?.isEditing
            ? '공지사항을 수정했습니다!'
            : '공지사항이 성공적으로 등록되었습니다!',
          buttonList: [confirmBtn],
        });
      }
    },
  });

  const { mutateAsync: mutatePostNotice } = usePostNotice({
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
          text: props?.isEditing
            ? '공지사항을 수정했습니다!'
            : '공지사항이 성공적으로 등록되었습니다!',
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
      if (props && props.isEditing) {
        const { noticeId } = props;
        mutateEditedNotice({ ...formValue, noticeId });
      } else {
        mutatePostNotice(formValue);
      }
    } else {
      const formValue = { noticeType, title, content, targetCourseIdList };
      if (props?.isEditing) {
        mutateEditedNotice({ ...formValue, noticeId: props.noticeId });
      } else {
        mutatePostNotice(formValue);
      }
    }
  };

  return {
    onError,
    findCurrNotice,
    onSubmit,
    isCreateEventsPending,
  };
};
