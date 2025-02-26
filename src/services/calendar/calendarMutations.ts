import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import {
  CourseCalendarDto,
  FullCalendarEvent,
  GoogleCalendarApiDto,
  HasAdminRole,
} from '@/types';
import { hasSuperAdmin, isSuperAdmin } from '@/utils';

export const useInsertCalendar = (
  options?: UseMutationOptions<unknown, Error, string>,
) => {
  const insertCalendar = async (id: string) => {
    const response = await axiosCalendarInstance.post(
      '/users/me/calendarList',
      { id },
    );
    return response.data;
  };

  return useMutation({
    mutationFn: insertCalendar,
    mutationKey: ['useInsertCalendar'],
    ...options,
  });
};

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

    const calendarCreateRes = await axiosCalendarInstance.post(
      '/calendars',
      calendarData,
    );

    return calendarCreateRes.data;
  };

  const saveCalendarIdInDB = async (calendarId: string, courseId: number) => {
    await axiosInstance.post(`/user/calendar/${courseId}`, {
      calendarId,
    } as CourseCalendarDto.Post);
  };

  const makePublicCalendar = async (calendarId: string) => {
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
  };

  const grantAclToSuperAdmin = async (calendarId: string) => {
    await axiosCalendarInstance.post(`/calendars/${calendarId}/acl`, {
      role: 'owner',
      scope: {
        type: 'user',
        value: SUPER_ADMIN_EMAIL,
      },
    });
  };

  const createAndShareAclPublicCalendar = async (
    params: GoogleCalendarApiDto.PostCalendar,
  ) => {
    const { summary, courseId, currentRole } = params;
    const createdCalendar = await createCalendar(summary);
    const calendarId = createdCalendar.id;
    await saveCalendarIdInDB(calendarId, courseId);
    await makePublicCalendar(calendarId);
    if (!isSuperAdmin(currentRole)) {
      await grantAclToSuperAdmin(calendarId);
    }
    return createdCalendar;
  };

  return useMutation({
    mutationFn: createAndShareAclPublicCalendar,
    mutationKey: ['useCreateCalendar'],
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
    await Promise.all(
      hasNotAclAdminList.map(async ({ email, roleType }) => {
        const acl = {
          role: hasSuperAdmin(roleType) ? 'owner' : 'writer',
          scope: { type: 'user', value: email },
        };
        await axiosCalendarInstance.post(`/calendars/${calendarId}/acl`, acl);
      }),
    );
  };

  return useMutation({
    mutationFn: grantAclByRole,
    mutationKey: ['useGrantAcl'],
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
    const promises = data.flatMap(({ calendarId, events }) =>
      events.map(event =>
        axiosCalendarInstance.post(`/calendars/${calendarId}/events`, event),
      ),
    );
    await Promise.all(promises);
  };

  return useMutation({
    mutationFn: createEventsForMultipleCalendars,
    mutationKey: ['createEventsForMultipleCalendars'],
    ...options,
  });
};

export const useUpdateEvent = (
  options?: UseMutationOptions<unknown, Error, FullCalendarEvent[]>,
) => {
  const updateEvent = async (updatedEventList: FullCalendarEvent[]) => {
    await Promise.all(
      updatedEventList.map(async ({ id, calendarId, ...rest }) => {
        return axiosCalendarInstance.put(
          `/calendars/${calendarId}/events/${id}`,
          rest,
        );
      }),
    );
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
    await Promise.all(
      eventList.map(async ({ id, calendarId }) => {
        return axiosCalendarInstance.delete(
          `/calendars/${calendarId}/events/${id}`,
        );
      }),
    );
  };

  return useMutation({
    mutationFn: deleteEvent,
    mutationKey: ['useDeleteEvent'],
    ...options,
  });
};
