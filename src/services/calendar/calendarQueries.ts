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
import { AxiosError, AxiosResponse } from 'axios';

const hasCalendarToken = !!sessionStorage.getItem(CALENDAR_TOKEN_KEY);

export const useGetCalendarList = (
  options?: UseQueryOptions<GoogleCalendarApiDto.GetCalendarList>,
) => {
  const getCalendarList = async () => {
    const res =
      await axiosCalendarInstance.get<GoogleCalendarApiDto.GetCalendarList>(
        '/users/me/calendarList',
      );
    return res.data;
  };

  return useQuery({
    queryKey: ['useGetCalendarList'],
    queryFn: getCalendarList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: hasCalendarToken,
    ...options,
  });
};

export const useGetCalendarEvents = (
  calendarId: string | undefined,
  options?: UseQueryOptions<GoogleCalendarApiDto.GetCalenderEvents>,
) => {
  const getCalendarEvents = async () => {
    const res =
      await axiosCalendarInstance.get<GoogleCalendarApiDto.GetCalenderEvents>(
        `/calendars/${calendarId}/events`,
      );
    return res.data;
  };

  return useQuery({
    queryKey: ['useGetCalendarEvents', calendarId],
    queryFn: getCalendarEvents,
    enabled: !!calendarId && hasCalendarToken,
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
    const res =
      await axiosCalendarInstance.get<GoogleCalendarApiDto.GetCalenderEvents>(
        `/calendars/${calendarId}/events`,
        {
          params: {
            singleEvents: true,
            orderBy: 'startTime',
            showDeleted: false,
          },
        },
      );

    return { ...res.data, calendarId };
  };

  return useQueries({
    queries: calendarIds.map(calendarId => {
      return {
        queryKey: ['useGetEventsByCalendar', calendarId],
        queryFn: () => getCalendarEvents(calendarId),
        enabled: !!calendarId && hasCalendarToken,
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
    const res = await axiosInstance.get<AdminEmailListByCourseDto.Get>(
      `/user/calendar/${courseId}/email`,
    );

    return res.data;
  };

  return useQuery({
    queryKey: ['useGetAdminEmailListByCourse', courseId],
    queryFn: getManagerEmailListByCourse,
    enabled: !!courseId && hasCalendarToken,
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
    const res = await axiosInstance.get<CourseCalendarDto.Get[]>(
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
  options?: UseQueryOptions<unknown, AxiosError, AclEmail[] | string>,
) => {
  const getCalendarAcl = async () => {
    const aclRes = await axiosCalendarInstance.get<{ items: Acl[] }>(
      `/calendars/${calendarId}/acl`,
    );

    if (aclRes.status === 200) {
      const result = aclRes.data.items
        .filter(
          ({ scope: { value: email } }) =>
            !email.includes('@public') && !email.includes('@group'),
        )
        .map(({ role, scope }) => ({
          email: scope.value,
          accessRole: role,
        })) as AclEmail[];

      return result;
    }

    return aclRes;
  };

  return useQuery<unknown, AxiosError, AclEmail[] | string>({
    queryKey: ['useGetCalendarAcl', courseId],
    queryFn: getCalendarAcl,
    enabled: !!calendarId && !!courseId && hasCalendarToken,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: false,
    ...options,
  });
};

const getCourseCalendarData = (courseId: number) => {
  return axiosInstance.get(`/user/calendar/${courseId}`);
};

type CourseWithCalendarId = UserCourse & { calendarId?: string };

export const useGetIsWaitingAcl = (
  courseWithCalendarIdList: CourseWithCalendarId[],
  enabled?: { enabled: boolean },
) => {
  const getAdminListByCourse: (
    courseId: number,
  ) => Promise<AdminEmail[]> = async (courseId: number) => {
    const res = await axiosInstance.get<AdminEmailListByCourseDto.Get>(
      `/user/calendar/${courseId}/email`,
    );
    return res.data;
  };

  const getAclList: (
    calendarId: string,
  ) => Promise<{ email: string }[]> = async (calendarId: string) => {
    try {
      const aclRes = await axiosCalendarInstance.get<{ items: Acl[] }>(
        `/calendars/${calendarId}/acl`,
      );

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
    const requests = courseWithCalendarIdList.map(
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
          return { isWaitingAcl: false };
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
    enabled: enabled?.enabled && hasCalendarToken,
  });
};

// 일단 캘린더 아이디까지 포함된 교육과정 데이터로 변환하기
export const useGetCourseWithCalendarList = (
  courseList: UserCourse[],
  options?: UseQueryOptions<CourseWithCalendarId[]>,
) => {
  const getCourseWithCalendarList = async () => {
    const requests = courseList.map(async course => {
      const courseCalendarIdList: AxiosResponse<CourseCalendarDto.Get[]> =
        await getCourseCalendarData(course.courseId);

      return courseCalendarIdList.data.length === 0
        ? [course]
        : courseCalendarIdList.data.map(({ calendarId }) => ({
            ...course,
            calendarId,
          }));
    });

    const responses = (await Promise.all(requests)) as CourseWithCalendarId[][];
    return responses
      .flat()
      .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
  };

  return useQuery({
    queryKey: ['useGetCourseWithCalendarList'],
    queryFn: getCourseWithCalendarList,
    enabled: courseList.length > 0,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
