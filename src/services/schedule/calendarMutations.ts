import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { ADMIN_EMAIL } from '@/constants';
import { KeyOfRole, SproutCalendarDto } from '@/types';

export const useCreateCalendar = (
  courseId: number,
  summary: string,
  emails: {
    EDU_MANAGER?: string;
    CAMPUS_MANAGER?: string;
    JOB_COORDINATOR?: string;
  },
  userRole: KeyOfRole,
  options?: UseMutationOptions,
) => {
  const createAndShareCalendar = async () => {
    try {
      const calendarData = {
        summary,
        timeZone: 'Asia/Seoul',
        description: '',
      };

      const calendarCreateResponse = await axiosCalendarInstance.post(
        '/calendars',
        calendarData,
      );

      const calendarId = calendarCreateResponse.data.id;

      await axiosInstance.post(`/user/calendar/${courseId}`, {
        calendarId,
      } as SproutCalendarDto.Post);

      const publicAclRule = {
        role: 'reader',
        scope: {
          type: 'default',
        },
      };
      await axiosCalendarInstance.post(
        `/calendars/${calendarId}/acl`,
        publicAclRule,
      );

      if (userRole !== 'ADMIN') {
        const adminAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: ADMIN_EMAIL,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          adminAclData,
        );
      }

      if (emails?.EDU_MANAGER) {
        const eduManagerAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: emails.EDU_MANAGER,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          eduManagerAclData,
        );
      }

      if (emails?.CAMPUS_MANAGER) {
        const campusManagerAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: emails.CAMPUS_MANAGER,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          campusManagerAclData,
        );
      }

      if (emails?.JOB_COORDINATOR) {
        const jobCoordinatorAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: emails.JOB_COORDINATOR,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          jobCoordinatorAclData,
        );
      }

      window.location.reload(); // NOTE: 아래는 테스트가 좀더 원활해지면 삭제 예정
    } catch (error) {
      console.error('캘린더 생성 또는 공개 설정 중 오류 발생', error);
    }
  };

  return useMutation({
    mutationFn: createAndShareCalendar,
    mutationKey: ['createCalendar', summary],
    ...options,
  });
};
