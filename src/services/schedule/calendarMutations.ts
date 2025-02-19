import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import {
  AdminEmailListByCourseDto,
  CourseCalendarDto,
  FullCalendarEvent,
  GoogleCalendarApiDto,
  HasAdminRole,
  HasSuperAdminRole,
} from '@/types';
import { hasAdmin, hasSuperAdmin } from '@/utils';

export const useCreateCalendar = (
  options?: UseMutationOptions<
    unknown,
    Error,
    GoogleCalendarApiDto.PostCalendar
  >,
) => {
  const createCalendar = async (summary: string, description?: string) => {
    const calendarData = {
      summary,
      timeZone: 'Asia/Seoul',
      description,
    };
    const calendarCreateResponse = await axiosCalendarInstance.post(
      '/calendars',
      calendarData,
    );
    return calendarCreateResponse.data;
  };

  const saveCalendarIdInDB = async (calendarId: string, courseId: number) => {
    try {
      await axiosInstance.post(`/user/calendar/${courseId}`, {
        calendarId,
      } as CourseCalendarDto.Post);
    } catch (error) {
      console.error('캘린더 id 교육과정 정보에 저장 중 오류 발생', error);
    }
  };

  const makePublicCalendar = async (calendarId: string) => {
    try {
      const publicAclRule = {
        role: 'reader',
        scope: {
          type: 'default',
        },
      };
      await axiosCalendarInstance.post(
        `/calendars/${calendarId}/acl`,
        publicAclRule,
      );
    } catch (error) {
      console.error('캘린더 공개 설정 중 오류 발생', error);
    }
  };

  const grantAclByRole = async (
    currentRoleAndEmail: { roleType: keyof HasSuperAdminRole; email: string },
    calendarId: string,
    emailListToBeAuthorized: AdminEmailListByCourseDto.Get,
  ) => {
    try {
      const aclUrl = `/calendars/${calendarId}/acl`;

      const { roleType: currRoleType, email: currEmail } = currentRoleAndEmail;

      if (currRoleType !== 'SUPER_ADMIN') {
        await axiosCalendarInstance.post(aclUrl, {
          role: 'owner',
          scope: {
            type: 'user',
            value: SUPER_ADMIN_EMAIL, // 최고 관리자
          },
        });
      }

      const exceptMyEmailList = emailListToBeAuthorized.filter(
        ({ email }) => email !== currEmail,
      );

      const hasOwnerAclList = exceptMyEmailList.filter(({ roleType }) =>
        hasSuperAdmin(roleType),
      );

      hasOwnerAclList.map(async ({ email }) => {
        const ownerAcl = {
          role: 'owner',
          scope: { type: 'user', value: email },
        };
        await axiosCalendarInstance.post(aclUrl, ownerAcl);
      });

      const hasWriterAclList = emailListToBeAuthorized.filter(
        ({ roleType }) => hasAdmin(roleType) && !hasSuperAdmin(roleType),
      );

      hasWriterAclList.map(async ({ email }) => {
        const writerAcl = {
          role: 'writer',
          scope: { type: 'user', value: email },
        };
        await axiosCalendarInstance.post(aclUrl, writerAcl);
      });
    } catch (error) {
      console.error('캘린더 일정관리 권한 부여 중 에러 발생', error);
    }
  };

  const createAndShareAclPublicCalendar = async (
    params: GoogleCalendarApiDto.PostCalendar,
    // eslint-disable-next-line consistent-return
  ) => {
    const { summary, courseId, currentRoleAndEmail, emailListToBeAuthorized } =
      params;
    try {
      const createdCalendar = await createCalendar(summary);
      const calendarId = createdCalendar.id;
      await saveCalendarIdInDB(calendarId, courseId);
      await makePublicCalendar(calendarId);
      await grantAclByRole(
        currentRoleAndEmail,
        calendarId,
        emailListToBeAuthorized,
      );
      return createdCalendar;
    } catch (error) {
      console.error('캘린더 생성 중 오류 발생', error);
    }
  };

  return useMutation({
    mutationFn: createAndShareAclPublicCalendar,
    mutationKey: ['useCreateCalendar'],
    ...options,
  });
};

export const useCreateEventsForMultipleCalendars = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { calendarId: string; events: GoogleCalendarApiDto.PostEvent[] }[]
  >,
) => {
  const createEventsForMultipleCalendars = async (
    data: { calendarId: string; events: GoogleCalendarApiDto.PostEvent[] }[],
  ) => {
    try {
      const promises = data.flatMap(({ calendarId, events }) =>
        events.map(event =>
          axiosCalendarInstance.post(`/calendars/${calendarId}/events`, event),
        ),
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('구글 캘린더에 일정 생성 중 에러 발생:', error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: createEventsForMultipleCalendars,
    mutationKey: ['createEventsForMultipleCalendars'],
    ...options,
  });
};

type GrantAclParams = {
  calendarId: string;
  hasNotAclAdminList: {
    email: string;
    roleType: keyof HasAdminRole;
  }[];
};

export const useGrantAcl = (
  options?: UseMutationOptions<unknown, Error, GrantAclParams>,
) => {
  const grantAclByRole = async (params: GrantAclParams) => {
    const { calendarId, hasNotAclAdminList } = params;

    try {
      await Promise.all(
        hasNotAclAdminList.map(async ({ email, roleType }) => {
          const acl = {
            role: hasSuperAdmin(roleType) ? 'owner' : 'writer',
            scope: { type: 'user', value: email },
          };
          await axiosCalendarInstance.post(`/calendars/${calendarId}/acl`, acl);
        }),
      );
    } catch (error) {
      console.error('일정관리 권한 부여 중 에러 발생', error);
    }
  };

  return useMutation({
    mutationFn: grantAclByRole,
    mutationKey: ['useGrantAcl'],
    ...options,
  });
};

export const useUpdateEvent = (
  options?: UseMutationOptions<unknown, Error, FullCalendarEvent[]>,
) => {
  const updateEvent = async (updatedEventList: FullCalendarEvent[]) => {
    try {
      await Promise.all(
        updatedEventList.map(async ({ id, calendarId, ...rest }) => {
          return axiosCalendarInstance.put(
            `/calendars/${calendarId}/events/${id}`,
            rest,
          );
        }),
      );
    } catch (error) {
      console.error('공지사항 일정 수정 중 에러 발생', error);
    }
  };

  return useMutation({
    mutationFn: updateEvent,
    mutationKey: ['useUpdateEvent'],
    ...options,
  });
};

export const useDeleteEvent = (
  options?: UseMutationOptions<unknown, Error, FullCalendarEvent[]>,
) => {
  const deleteEvent = async (eventList: FullCalendarEvent[]) => {
    try {
      await Promise.all(
        eventList.map(async ({ id, calendarId }) => {
          return axiosCalendarInstance.delete(
            `/calendars/${calendarId}/events/${id}`,
          );
        }),
      );
    } catch (error) {
      console.error('공지사항 일정 삭제 중 에러 발생', error);
    }
  };

  return useMutation({
    mutationFn: deleteEvent,
    mutationKey: ['useDeleteEvent'],
    ...options,
  });
};
