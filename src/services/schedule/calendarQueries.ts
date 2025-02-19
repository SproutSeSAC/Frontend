import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { CALENDAR_TOKEN_KEY, SUPER_ADMIN_EMAIL } from '@/constants';
import {
  AccessRole,
  Acl,
  AclEmail,
  AdminEmail,
  AdminEmailListByCourseDto,
  Calendar,
  CourseCalendarAcl,
  CourseCalendarDto,
  GoogleCalendarApiDto,
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

export const useGetCalendarAclList = (
  calendarList: (Calendar & {
    courseTitle: string;
    courseId: number;
    calendarId?: string;
  })[],
  options?: UseQueryOptions<CourseCalendarAcl[]>,
) => {
  const getAdminListByCourse: (
    courseId: number,
  ) => Promise<AdminEmail[]> = async (courseId: number) => {
    const res: AxiosResponse<AdminEmailListByCourseDto.Get> =
      await axiosInstance.get(`/user/calendar/${courseId}/email`);
    return res.data;
  };

  const getAclList: (
    calendarId: string,
  ) => Promise<{ email: string; accessRole: AccessRole }[]> = async (
    calendarId: string,
  ) => {
    try {
      const aclRes: AxiosResponse<{ items: Acl[] }> =
        await axiosCalendarInstance.get(`/calendars/${calendarId}/acl`);

      const result = aclRes.data.items
        .filter(
          ({ scope: { value } }) =>
            !value.includes('@public') && !value.includes('@group'),
        )
        .map(({ role, scope }) => ({ email: scope.value, accessRole: role }));

      return result;
    } catch (error) {
      throw new Error(
        `ACL이 있는 이메일 데이터 가져오는 중 에러 발생: ${error}`,
      );
    }
  };

  const getCalendarAclList = async () => {
    const requests = calendarList.map(async calendar => {
      if (calendar?.accessRole !== 'owner' || !calendar?.calendarId) {
        return { ...calendar, isCreated: false };
      }

      try {
        const [aclList, adminList] = await Promise.all([
          getAclList(calendar.calendarId),
          getAdminListByCourse(calendar.courseId),
        ]);

        const hasAclAdminList = aclList.map(acl => {
          const adminData = adminList.find(({ email }) => email === acl.email);
          const isSuperAdmin = acl.email === SUPER_ADMIN_EMAIL;
          return {
            ...acl,
            nickname: isSuperAdmin ? '관리자' : adminData?.nickname,
            roleType: isSuperAdmin ? 'SUPER_ADMIN' : adminData?.roleType,
          };
        }) as AclEmail[];

        const hasNotAclAdminList = adminList.filter(
          ({ email }) =>
            !aclList.find(({ email: aclEmail }) => email === aclEmail),
        );

        const { accessRole, calendarId, courseId, courseTitle } = calendar;

        return {
          courseId,
          courseTitle,
          calendarId,
          isCreated: !!accessRole,
          hasAclAdminList,
          hasNotAclAdminList,
        };
      } catch (err) {
        throw new Error(`캘린더 id ${calendar.courseTitle}: ${err}`);
      }
    });

    return Promise.all(requests);
  };

  return useQuery<CourseCalendarAcl[]>({
    queryKey: ['useGetCalendarAclList'],
    queryFn: getCalendarAclList,
    enabled: calendarList.length > 0,
    retry: false,
    ...options,
  });
};

// DB 교육과정별 담당 매니저 이메일 리스트
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// DB 생성된 교육과정 캘린더 데이터 가져오기
export const useGetCourseCalendar = (
  courseId?: number,
  options?: UseQueryOptions<CourseCalendarDto.Get>,
) => {
  const getCalendarIdByCourse = async () => {
    const res: AxiosResponse<CourseCalendarDto.Get[]> = await axiosInstance.get(
      `/user/calendar/${courseId}`,
    );
    return res.data?.[0] || [];
  };

  return useQuery({
    queryKey: ['useGetCourseCalendar', courseId],
    queryFn: getCalendarIdByCourse,
    enabled: !!courseId,
    ...options,
  });
};

export const getCalendarAcl = async (calendarId?: string) => {
  try {
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
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 403) {
      return [];
    }
    throw error;
  }
};

// 구글 캘린더별 acl 데이터 가져오기
export const useGetCalendarAcl = (
  calendarId?: string,
  options?: UseQueryOptions<AclEmail[]>,
) => {
  return useQuery<AclEmail[]>({
    queryKey: ['useGetCalendarAcl', calendarId],
    queryFn: () => getCalendarAcl(calendarId),
    enabled: !!calendarId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// DB에 저장된 나의 모든 교육과정 캘린더들 ID 정보
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
    ...options,
  });
};
