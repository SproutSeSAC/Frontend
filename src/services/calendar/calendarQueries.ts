import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { CALENDAR_TOKEN_KEY } from '@/constants';
import {
  Acl,
  AclEmail,
  AdminEmail,
  AdminEmailListByCourseDto,
  CourseCalendarDto,
  GoogleCalendarApiDto,
  UserCourse,
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
    queryKey: ['useGetCalendarList'],
    queryFn: getCalendarList,
    enabled: !!getCookie(CALENDAR_TOKEN_KEY),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

    return { ...res.data, calendarId };
  };

  return useQueries({
    queries: calendarIds.map(calendarId => {
      return {
        queryKey: ['eventsByCalenderId', calendarId],
        queryFn: () => getCalendarEvents(calendarId),
        enabled: !!calendarId,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...options,
      };
    }),
  });
};

export const useGetAdminEmailListByCourse = (
  courseId?: number,
  options?: UseQueryOptions<AdminEmailListByCourseDto.Get>,
) => {
  const getManagerEmailListByCourse = async () => {
    const res: AxiosResponse<AdminEmailListByCourseDto.Get> =
      await axiosInstance.get(`/user/calendar/${courseId}/email`);

    return res.data;
  };

  return useQuery({
    queryKey: ['useGetAdminEmailListByCourse', courseId],
    queryFn: getManagerEmailListByCourse,
    enabled: !!courseId,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetCourseCalendarStatus = (
  courseId?: number,
  options?: UseQueryOptions<CourseCalendarDto.Get>,
) => {
  const getCalendarIdByCourse = async () => {
    const res: AxiosResponse<CourseCalendarDto.Get[]> = await axiosInstance.get(
      `/user/calendar/${courseId}`,
    );
    return res.data?.[0] || {};
  };

  return useQuery({
    queryKey: ['useGetCourseCalendarStatus', courseId],
    queryFn: getCalendarIdByCourse,
    enabled: !!courseId,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetCalendarAcl = (
  courseId: number,
  calendarId?: string,
  options?: UseQueryOptions<unknown, AxiosError, AclEmail[]>,
) => {
  const getCalendarAcl = async () => {
    const aclRes: AxiosResponse<{ items: Acl[] }> =
      await axiosCalendarInstance.get(`/calendars/${calendarId}/acl`);

    const result = aclRes.data.items
      .filter(
        ({ scope: { value } }) =>
          !value.includes('@public') && !value.includes('@group'),
      )
      .map(({ role, scope }) => ({
        email: scope.value,
        accessRole: role,
      })) as AclEmail[];

    return result;
  };

  return useQuery<unknown, AxiosError, AclEmail[]>({
    queryKey: ['useGetCalendarAcl', courseId],
    queryFn: getCalendarAcl,
    enabled: !!calendarId && !!courseId,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: false,
    ...options,
  });
};

export const useGetIsWaitingAcl = (
  courseList: UserCourse[],
  options?: UseQueryOptions<boolean>,
) => {
  const getCourseCalendarIdList = async () => {
    const requests = courseList.map(({ courseId }) =>
      axiosInstance.get(`/user/calendar/${courseId}`).then(res => {
        return res.data.length !== 0
          ? res.data.map(({ calendarId }: CourseCalendarDto.Get) => {
              return { calendarId, courseId };
            })
          : [];
      }),
    );
    const responses = await Promise.all(requests);
    return responses.flat() as { calendarId: string; courseId: number }[];
  };

  const getAdminListByCourse: (
    courseId: number,
  ) => Promise<AdminEmail[]> = async (courseId: number) => {
    const res: AxiosResponse<AdminEmailListByCourseDto.Get> =
      await axiosInstance.get(`/user/calendar/${courseId}/email`);
    return res.data;
  };

  const getAclList: (
    calendarId: string,
  ) => Promise<{ email: string }[]> = async (calendarId: string) => {
    try {
      const aclRes: AxiosResponse<{ items: Acl[] }> =
        await axiosCalendarInstance.get(`/calendars/${calendarId}/acl`);

      const result = aclRes.data.items
        .filter(
          ({ scope: { value } }) =>
            !value.includes('@public') && !value.includes('@group'),
        )
        .map(({ scope }) => ({ email: scope.value }));

      return result;
    } catch (error) {
      throw new Error(
        `ACL이 있는 이메일 데이터 가져오는 중 에러 발생: ${error}`,
      );
    }
  };

  const getHasNotAclList = async () => {
    const courseCalendarList = await getCourseCalendarIdList();

    const requests = courseCalendarList.map(
      async ({ calendarId, courseId }) => {
        if (!calendarId || !courseId) return { isWaitingAcl: false };

        try {
          const [aclList, adminList] = await Promise.all([
            getAclList(calendarId),
            getAdminListByCourse(courseId),
          ]);

          const hasNotAclAdminList = adminList.filter(
            ({ email }) =>
              !aclList.find(({ email: aclEmail }) => email === aclEmail),
          );

          return { isWaitingAcl: !!hasNotAclAdminList.length };
        } catch (err) {
          throw new Error(`캘린더 id ${calendarId}: ${err}`);
        }
      },
    );

    return Promise.all(requests);
  };

  const getIsWaitingAcl = async () => {
    const calendarAclList = await getHasNotAclList();
    const isWaitingAclList = calendarAclList?.filter(
      ({ isWaitingAcl }) => isWaitingAcl,
    );
    return !!isWaitingAclList.length;
  };

  return useQuery<boolean>({
    queryKey: ['useGetIsWaitingAcl'],
    queryFn: getIsWaitingAcl,
    enabled: courseList.length > 0,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetCourseCalendarStatusList = (
  courseList: {
    courseId: number;
    courseTitle: string;
  }[],
  options?: UseQueryOptions<
    (CourseCalendarDto.Get & { courseTitle: string })[]
  >,
) => {
  const getCourseCalendarStatusList = async () => {
    const requests = courseList.map(({ courseId, courseTitle }) =>
      axiosInstance.get(`/user/calendar/${courseId}`).then(res => {
        const baseDetail = { courseId, courseTitle };

        return res.data.length === 0
          ? [baseDetail]
          : res.data.map(({ calendarId }: CourseCalendarDto.Get) => {
              return { ...baseDetail, calendarId };
            });
      }),
    );
    const responses = await Promise.all(requests);
    return responses
      .flat()
      .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
  };

  return useQuery<(CourseCalendarDto.Get & { courseTitle: string })[]>({
    queryKey: ['useGetCourseCalendarStatusList'],
    queryFn: getCourseCalendarStatusList,
    enabled: courseList.length > 0,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
