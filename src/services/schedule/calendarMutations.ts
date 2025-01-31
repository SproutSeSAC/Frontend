import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { ADMIN_EMAIL } from '@/constants';
import {
  FullCalendarEvent,
  GoogleCalendarApiDto,
  RoleKey,
  SproutCalendarDto,
  SuperAdminAndManagerRole,
} from '@/types';

type AuthorizedEmailsByRole = {
  EDU_MANAGER?: string;
  CAMPUS_LEADER?: string;
  JOB_COORDINATOR?: string;
};

export const useCreateCalendar = (
  options?: UseMutationOptions<
    unknown,
    Error,
    GoogleCalendarApiDto.PostCalendar
  >,
) => {
  const createCalendar = async (summary: string) => {
    const calendarData = {
      summary,
      timeZone: 'Asia/Seoul',
      description: '',
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
      } as SproutCalendarDto.Post);
    } catch (error) {
      console.error('캘린더 id 저장 중 오류 발생', error);
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
    userRole: RoleKey,
    calendarId: string,
    authorizedEmails: AuthorizedEmailsByRole,
  ) => {
    try {
      if (userRole !== 'SUPER_ADMIN') {
        const adminAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: ADMIN_EMAIL,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          adminAclData,
        );
      }

      if (authorizedEmails?.EDU_MANAGER) {
        const eduManagerAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: authorizedEmails.EDU_MANAGER,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          eduManagerAclData,
        );
      }

      if (authorizedEmails?.CAMPUS_LEADER) {
        const campusManagerAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: authorizedEmails.CAMPUS_LEADER,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          campusManagerAclData,
        );
      }

      if (authorizedEmails?.JOB_COORDINATOR) {
        const jobCoordinatorAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: authorizedEmails.JOB_COORDINATOR,
          },
        };
        await axiosCalendarInstance.post(
          `/calendars/${calendarId}/acl`,
          jobCoordinatorAclData,
        );
      }
    } catch (error) {
      console.error('캘린더 일정관리 권한 부여 중 에러 발생', error);
    }
  };

  const createAndShareAclPublicCalendar = async (
    params: GoogleCalendarApiDto.PostCalendar,
  ) => {
    const { summary, courseId, userRole, authorizedEmails } = params;
    try {
      const createdCalendar = await createCalendar(summary);
      const calendarId = createdCalendar.id;
      await saveCalendarIdInDB(calendarId, courseId);
      await makePublicCalendar(calendarId);
      await grantAclByRole(userRole, calendarId, authorizedEmails);
    } catch (error) {
      console.error('캘린더 생성 중 오류 발생', error);
    }
  };

  return useMutation({
    mutationFn: createAndShareAclPublicCalendar,
    mutationKey: ['createPublicCalendar'],
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
  hasNotAclEmailList: {
    email: string;
    roleType: keyof SuperAdminAndManagerRole;
  }[];
};

export const useGrantAcl = (
  options?: UseMutationOptions<unknown, Error, GrantAclParams>,
) => {
  const grantAclByRole = async (params: GrantAclParams) => {
    const { calendarId, hasNotAclEmailList } = params;

    try {
      await Promise.all(
        hasNotAclEmailList.map(async email => {
          const managerAclData = {
            role: 'owner',
            scope: {
              type: 'user',
              value: email,
            },
          };
          return axiosCalendarInstance.post(
            `/calendars/${calendarId}/acl`,
            managerAclData,
          );
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
