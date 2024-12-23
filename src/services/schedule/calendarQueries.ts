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
import { AxiosError, AxiosResponse } from 'axios';

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
    try {
      const res = await axiosCalendarInstance.get(
        `/calendars/${calendarId}/acl`,
      );
      return res.data.items;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        return [];
      }
      throw error;
    }
  };

  return useQuery<GoogleCalendarApiDto.GetAclList>({
    queryKey: ['calendarAcl', calendarId],
    queryFn: getAclList,
    enabled: !!calendarId,
    retry: false,
    ...options,
  });
};

export type UserCalendarInfo = {
  courseTitle: string;
  courseId: number;
  calendarId?: string;
  isCreated: boolean;
};

export type AllCalendarAclEmail = UserCalendarInfo & {
  aclEmailList: string[];
  managerEmailList: string[];
  hasNotAclEmailList: string[];
};

// 다중 캘린더별 acl 이메일 리스트 가져오기
export const useGetAllCalendarAclEmailList = (
  userCalendarInfos: UserCalendarInfo[],
  options?: UseQueryOptions<AllCalendarAclEmail[]>,
) => {
  const getManagerEmailListByCourse = async (courseId: number) => {
    const res: AxiosResponse<ManagerEmailListByCourseDto.Get> =
      await axiosInstance.get(`/user/calendar/${courseId}/email`);
    return res.data;
  };

  const getAclEmailList = async (calendarId?: string) => {
    if (!calendarId) return [];

    try {
      const aclResponse = await axiosCalendarInstance.get(
        `/calendars/${calendarId}/acl`,
      );
      return aclResponse.data.items
        .map((item: { scope: { value: string } }) => item.scope.value)
        .filter(
          (email: string) =>
            !email.includes('@public') && !email.includes('@group'),
        );
    } catch (error) {
      throw new Error(
        `ACL이 있는 이메일 데이터 가져오는 중 에러 발생: ${error}`,
      );
    }
  };

  const getManagerEmailList = async (courseId: number) => {
    const res = await getManagerEmailListByCourse(courseId);
    return res.map(manager => manager.email);
  };

  const getCourseCalendarEmailList = async () => {
    const requests = userCalendarInfos.map(async calendarInfo => {
      if (!calendarInfo.isCreated) {
        return {
          ...calendarInfo,
          aclEmailList: [],
          managerEmailList: [],
          hasNotAclEmailList: [],
        };
      }

      try {
        const [aclEmailList, managerEmailList] = await Promise.all([
          getAclEmailList(calendarInfo.calendarId),
          getManagerEmailList(calendarInfo.courseId),
        ]);

        const aclEmailSet = new Set(aclEmailList);
        const hasNotAclEmailList = managerEmailList.filter(
          email => !aclEmailSet.has(email),
        );

        return {
          ...calendarInfo,
          aclEmailList,
          managerEmailList,
          hasNotAclEmailList,
        };
      } catch (err) {
        throw new Error(`캘린더 id ${calendarInfo.courseTitle}: ${err}`);
      }
    });

    return Promise.all(requests);
  };

  return useQuery<AllCalendarAclEmail[]>({
    queryKey: ['useGetAllCalendarAclEmailList'],
    queryFn: getCourseCalendarEmailList,
    enabled: userCalendarInfos.length > 0,
    retry: false,
    ...options,
  });
};

// 다중 캘린더별 권한 데이터 가져오기
export const useGetAllUserCalendarAclList = (
  userCalendarInfos: UserCalendarInfo[],
  options?: UseQueryOptions<(UserCalendarInfo & { hasAcl: boolean })[]>,
) => {
  const getCourseCalendarInfoList = async () => {
    const requests = userCalendarInfos.map(calendarInfo => {
      if (!calendarInfo.isCreated) {
        return Promise.resolve({ ...calendarInfo, hasAcl: false });
      }
      return axiosCalendarInstance
        .get(`/calendars/${calendarInfo.calendarId}/acl`)
        .then(res => ({ ...calendarInfo, hasAcl: !!res?.data.items.length }))
        .catch(() => ({ ...calendarInfo, hasAcl: false }));
    });
    return Promise.all(requests);
  };

  return useQuery<(UserCalendarInfo & { hasAcl: boolean })[]>({
    queryKey: ['userAclList'],
    queryFn: getCourseCalendarInfoList,
    enabled: userCalendarInfos.length > 0,
    retry: false,
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

// 교육과정별 담당 매니저 이메일 리스트
export const useGetManagerEmailListByCourse = (
  courseId?: number,
  options?: UseQueryOptions<ManagerEmailListByCourseDto.Get>,
) => {
  const getManagerEmailListByCourse = async () => {
    const res: AxiosResponse<ManagerEmailListByCourseDto.Get> =
      await axiosInstance.get(`/user/calendar/${courseId}/email`);
    return res.data;
  };

  return useQuery({
    queryKey: ['useGetManagerEmailListByCourse', courseId],
    queryFn: getManagerEmailListByCourse,
    enabled: !!courseId,
    ...options,
  });
};
