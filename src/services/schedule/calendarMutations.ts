import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosCalendarInstance, axiosInstance } from '@/services/axiosInstance';

import { ADMIN_EMAIL } from '@/constants';
import { GoogleCalendarApiDto, KeyOfRole, SproutCalendarDto } from '@/types';

type AuthorizedEmailsByRole = {
  EDU_MANAGER?: string;
  CAMPUS_MANAGER?: string;
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
    userRole: KeyOfRole,
    calendarId: string,
    authorizedEmails: AuthorizedEmailsByRole,
  ) => {
    try {
      if (userRole !== 'ADMIN') {
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

      if (authorizedEmails?.CAMPUS_MANAGER) {
        const campusManagerAclData = {
          role: 'owner',
          scope: {
            type: 'user',
            value: authorizedEmails.CAMPUS_MANAGER,
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

export const useCreateCalendarEvents = (
  calendarId: string,
  options?: UseMutationOptions<
    unknown,
    Error,
    GoogleCalendarApiDto.PostEvent[]
  >,
) => {
  const createMultipleEvents = async (
    events: GoogleCalendarApiDto.PostEvent[],
  ) => {
    try {
      const promises = events.map(event =>
        axiosCalendarInstance.post(`/calendars/${calendarId}/events`, event),
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error creating events:', error);
    }
  };

  return useMutation({
    mutationFn: createMultipleEvents,
    mutationKey: ['createEvents'],
    ...options,
  });
};
