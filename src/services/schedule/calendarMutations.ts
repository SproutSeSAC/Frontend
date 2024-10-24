import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance } from '@/services/axiosInstance';

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

      const campusManagerAclData = {
        role: 'owner',
        scope: {
          type: 'user',
          value: emails.CAMPUS_MANAGER,
        },
      };

      const jobCoordinatorAclData = {
        role: 'owner',
        scope: {
          type: 'user',
          value: emails.JOB_COORDINATOR,
        },
      };

      await axiosCalendarInstance.post(
        `/calendars/${calendarId}/acl`,
        publicAclRule,
      );
      console.log('캘린더 공개 설정 완료');

      await axiosCalendarInstance.post(
        `/calendars/${calendarId}/acl`,
        campusManagerAclData,
      );
      console.log('캠퍼스 매니저 소유권 부여 완료');

      await axiosCalendarInstance.post(
        `/calendars/${calendarId}/acl`,
        jobCoordinatorAclData,
      );
      console.log('잡코디 소유권 부여 완료');
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
