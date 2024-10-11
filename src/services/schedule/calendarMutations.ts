import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance } from '@/services/axiosInstance';

export const useCreateCalendar = (options?: UseMutationOptions) => {
  const createAndShareCalendar = async () => {
    try {
      const calendarData = {
        summary: '새싹 캘린더',
        timeZone: 'Asia/Seoul',
        description: '',
      };

      const calendarCreateResponse = await axiosCalendarInstance.post(
        '/calendars',
        calendarData,
      );
      const calendarId = calendarCreateResponse.data.id;

      const aclRule = {
        role: 'reader',
        scope: {
          type: 'default',
        },
      };
      await axiosCalendarInstance.post(`/calendars/${calendarId}/acl`, aclRule);
      window.location.reload();
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
