import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { ADMIN_EMAIL, CALENDAR_TOKEN_KEY } from '@/constants';
import {
  GoogleCalendarApiDto,
  ManagerAdminRole,
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

export type CalendarDetail = {
  courseTitle: string;
  courseId: number;
  calendarId?: string;
  isCreated: boolean;
};

export type AllCalendarAclEmail = CalendarDetail & {
  hasAcl: boolean;
  aclEmailList: { email: string; roleType?: keyof ManagerAdminRole }[];
  managerEmailList: {
    email: string;
    roleType: keyof ManagerAdminRole;
  }[];
  hasNotAclEmailList: {
    email: string;
    roleType: keyof ManagerAdminRole;
  }[];
};

// 다중 캘린더별 acl 이메일 리스트 가져오기
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
    // managerEmailList를 Map으로 변환하여 빠른 조회 가능하도록 구성
    const managerEmailMap = new Map(
      managerEmailList.map(({ email, roleType }) => [email, { roleType }]),
    );

    // aclEmailList의 각 객체에 managerEmailList의 데이터를 추가
    return aclEmailList.map(acl => {
      const managerData = managerEmailMap.get(acl.email);
      const adminData =
        acl.email === ADMIN_EMAIL ? { ...acl, roleType: 'ADMIN' } : acl;
      return managerData
        ? { ...acl, ...managerData } // managerData가 있으면 병합
        : adminData; // 없으면 원래 데이터 유지
    });
  };

  const getCourseCalendarEmailList = async () => {
    const requests = calendarList.map(async calendar => {
      if (!calendar.isCreated) {
        return {
          ...calendar,
          hasAcl: false,
          aclEmailList: [],
          managerEmailList: [],
          hasNotAclEmailList: [],
        };
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
