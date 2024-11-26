import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { CALENDAR_TOKEN_KEY } from '@/constants';
import {
  GoogleCalendarApiDto,
  ManagerEmailListByCourseDto,
  SproutCalendarDto,
  UserProfileDto,
} from '@/types';
import { getCookie } from '@/utils';
import { AxiosResponse } from 'axios';

export const useGetCalendarList = (
  options?: UseQueryOptions<GoogleCalendarApiDto.GetCalendarList>,
) => {
  const getCalendarList = async () => {
    const res: AxiosResponse<GoogleCalendarApiDto.GetCalendarList> =
      await axiosCalendarInstance.get('/users/me/calendarList');
    return res.data;
  };

  return useQuery({
    queryKey: ['calendarList'],
    queryFn: getCalendarList,
    ...options,
    enabled: !!getCookie(CALENDAR_TOKEN_KEY),
  });
};

export const useGetCalendarEvents = (
  calendarId: string | undefined,
  options?: UseQueryOptions<GoogleCalendarApiDto.GetCalenderEvents>,
) => {
  const getCalendarEvents = async () => {
    const res: AxiosResponse<GoogleCalendarApiDto.GetCalenderEvents> =
      await axiosCalendarInstance.get(`/calendars/${calendarId}/events`);
    return res.data;
  };

  return useQuery({
    queryKey: ['calendarEvents', calendarId],
    queryFn: getCalendarEvents,
    enabled: !!calendarId,
    ...options,
  });
};

export const useGetEventsByCalendar = (
  calendarIds: string[],
  options?: UseQueryOptions<GoogleCalendarApiDto.GetCalenderEvents>,
) => {
  const getCalendarEvents = async (calendarId: string) => {
    const res: AxiosResponse<GoogleCalendarApiDto.GetCalenderEvents> =
      await axiosCalendarInstance.get(`/calendars/${calendarId}/events`);
    return res.data;
  };

  return useQueries({
    queries: calendarIds.map(calendarId => {
      return {
        queryKey: ['eventsByCalenderId', calendarId],
        queryFn: () => getCalendarEvents(calendarId),
        enabled: !!calendarId,
        ...options,
      };
    }),
  });
};

// 캘린더별 권한 데이터 가져오기
export const useGetAclListByCalendar = (
  calendarId?: string,
  options?: UseQueryOptions<GoogleCalendarApiDto.GetAclList>,
) => {
  const getAclList = async () => {
    const res = await axiosCalendarInstance.get(`/calendars/${calendarId}/acl`);
    return res.data.items;
  };

  return useQuery<GoogleCalendarApiDto.GetAclList>({
    queryKey: ['calendarAcl', calendarId],
    queryFn: getAclList,
    enabled: !!calendarId,
    ...options,
  });
};

// 생성된 교육과정 데이터 가져오기
export const useGetCreatedCourseCalendar = (
  courseId?: number,
  options?: UseQueryOptions<SproutCalendarDto.Get>,
) => {
  const getCalendarIdByCourse = async () => {
    const res: AxiosResponse<SproutCalendarDto.Get[]> = await axiosInstance.get(
      `/user/calendar/${courseId}`,
    );
    return res.data?.[0] || [];
  };

  return useQuery({
    queryKey: ['calendarIdByCourse', courseId],
    queryFn: getCalendarIdByCourse,
    enabled: !!courseId,
    ...options,
  });
};

export const useCourseCalendarList = (
  courseList: Pick<UserProfileDto.Get, 'courseList'>['courseList'],
  options?: UseQueryOptions<
    (SproutCalendarDto.Get & { isCreated: boolean; courseTitle: string })[]
  >,
) => {
  const getCourseCalendarInfoList = async () => {
    const requests = courseList.map(({ courseId, courseTitle }) =>
      axiosInstance.get(`/user/calendar/${courseId}`).then(res => {
        return res.data.length === 0
          ? [{ courseTitle, courseId, isCreated: false }]
          : res.data.map((item: SproutCalendarDto.Get) => ({
              ...item,
              id: item.calendarId,
              courseTitle,
              isCreated: true,
            }));
      }),
    );
    const responses = await Promise.all(requests);
    return responses.flat();
  };

  return useQuery<
    (SproutCalendarDto.Get & { isCreated: boolean; courseTitle: string })[]
  >({
    queryKey: ['courseCalenderList', courseList],
    queryFn: getCourseCalendarInfoList,
    enabled: courseList.length > 0,
    ...options,
  });
};

export const useGetAuthorizedEmailsByCourse = (
  courseId?: number,
  options?: UseQueryOptions<ManagerEmailListByCourseDto.Get>,
) => {
  const getAdminEmailByCourse = async () => {
    const res: AxiosResponse<ManagerEmailListByCourseDto.Get> =
      await axiosInstance.get(`/user/calendar/${courseId}/email`);
    return res.data;
  };

  return useQuery({
    queryKey: ['adminEmail', courseId],
    queryFn: getAdminEmailByCourse,
    enabled: !!courseId,
    ...options,
  });
};
