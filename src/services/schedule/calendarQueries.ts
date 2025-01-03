import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { ADMIN_EMAIL, CALENDAR_TOKEN_KEY } from '@/constants';
import {
  AccessRole,
  GoogleCalendarApiDto,
  ManagerAdminRole,
  ManagerEmailListByCourseDto,
  SproutCalendarDto,
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

    return { ...res.data, calendarId };
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

export type CalendarDetail = {
  courseTitle: string;
  courseId: number;
  calendarId?: string;
  accessRole?: AccessRole;
};

export type AllCalendarAclEmail = CalendarDetail & {
  isCreated: boolean;
  hasAcl: boolean;
  aclEmailList?: { email: string; roleType?: keyof ManagerAdminRole }[];
  managerEmailList?: {
    email: string;
    roleType: keyof ManagerAdminRole;
  }[];
  hasNotAclEmailList?: {
    email: string;
    roleType: keyof ManagerAdminRole;
  }[];
};

// 모든 캘린더별 acl 이메일 리스트 가져오기
export const useGetAllCalendarAclEmailList = (
  calendarList: CalendarDetail[],
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
        .map((item: { scope: { value: string } }) => {
          return { email: item.scope.value };
        })
        .filter(
          ({ email }: { email: string }) =>
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
    return res.map(({ email, roleType }) => ({
      email,
      roleType,
    }));
  };

  const mergeAclAndManagerEmails = (
    aclEmailList: { email: string }[],
    managerEmailList: { email: string; roleType: string }[],
  ) => {
    const managerEmailMap = new Map(
      managerEmailList.map(({ email, roleType }) => [email, { roleType }]),
    );

    return aclEmailList.map(acl => {
      const managerData = managerEmailMap.get(acl.email);
      const adminData =
        acl.email === ADMIN_EMAIL ? { ...acl, roleType: 'ADMIN' } : acl;
      return managerData ? { ...acl, ...managerData } : adminData;
    });
  };

  const getCourseCalendarEmailList = async () => {
    const requests = calendarList.map(async calendar => {
      const isCreated = calendar?.accessRole === 'owner';

      if (!isCreated) {
        return { ...calendar, isCreated, hasAcl: false };
      }

      try {
        const [aclEmailList, managerEmailList] = await Promise.all([
          getAclEmailList(calendar.calendarId),
          getManagerEmailList(calendar.courseId),
        ]);

        const aclEmailSet = new Set(
          aclEmailList.map(({ email }: { email: string }) => email),
        );
        const hasNotAclEmailList = managerEmailList.filter(
          ({ email }) => !aclEmailSet.has(email),
        );

        const updatedAclEmailList = mergeAclAndManagerEmails(
          aclEmailList,
          managerEmailList,
        );

        return {
          ...calendar,
          isCreated,
          hasAcl: !!aclEmailList.length,
          aclEmailList: updatedAclEmailList,
          managerEmailList,
          hasNotAclEmailList,
        };
      } catch (err) {
        throw new Error(`캘린더 id ${calendar.courseTitle}: ${err}`);
      }
    });

    return Promise.all(requests);
  };

  return useQuery<AllCalendarAclEmail[]>({
    queryKey: ['useGetAllCalendarAclEmailList'],
    queryFn: getCourseCalendarEmailList,
    enabled: calendarList.length > 0,
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
  courseList: {
    courseId: number;
    courseTitle: string;
  }[],
  options?: UseQueryOptions<
    (SproutCalendarDto.Get & { courseTitle: string })[]
  >,
) => {
  const getCourseCalendarInfoList = async () => {
    const requests = courseList.map(({ courseId, courseTitle }) =>
      axiosInstance.get(`/user/calendar/${courseId}`).then(res => {
        const baseDetail = { courseId, courseTitle };

        return res.data.length === 0
          ? [baseDetail]
          : res.data
              .slice(0, 1)
              .map(({ calendarId }: SproutCalendarDto.Get) => {
                return { ...baseDetail, calendarId };
              });
      }),
    );
    const responses = await Promise.all(requests);
    return responses.flat();
  };

  return useQuery<(SproutCalendarDto.Get & { courseTitle: string })[]>({
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
