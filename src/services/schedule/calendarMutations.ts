import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance } from '@/services/axiosInstance';

import { ADMIN_EMAIL } from '@/constants';

export const useCreateCalendar = (
  summary: string,
  emails: { CAMPUS_MANAGER: string; JOB_COORDINATOR: string },
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

      if (emails.CAMPUS_MANAGER) {
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

      if (emails.JOB_COORDINATOR) {
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
    } catch (error) {
      console.error('캘린더 생성 또는 공개 설정 중 오류 발생', error);
    }
  };

  return useMutation({
    mutationFn: createAndShareCalendar,
    mutationKey: ['createCalendar'],
    ...options,
  });
};
