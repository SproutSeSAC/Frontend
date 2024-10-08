import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosCalendarInstance } from '@/services/axiosInstance';

import { CalendarList, CalenderEvents } from '@/types/calendarDto';
import { AxiosResponse } from 'axios';

export const useGetCalendarList = (options?: UseQueryOptions<CalendarList>) => {
  const getCalendarList = async () => {
    const res: AxiosResponse<CalendarList> = await axiosCalendarInstance.get(
      '/users/me/calendarList',
    );
    return res.data;
  };

  return useQuery({
    queryKey: ['calendarList'],
    queryFn: getCalendarList,
    ...options,
  });
};

export const useGetCalendarEvents = (
  calendarId: string | undefined,
  options?: UseQueryOptions<CalenderEvents>,
) => {
  const getCalendarEvents = async () => {
    const res: AxiosResponse<CalenderEvents> = await axiosCalendarInstance.get(
      `/calendars/${calendarId}/events`,
    );
    return res.data;
  };

  return useQuery({
    queryKey: ['calendarEvents', calendarId],
    queryFn: getCalendarEvents,
    enabled: !!calendarId,
    ...options,
  });
};
