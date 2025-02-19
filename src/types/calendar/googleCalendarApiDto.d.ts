import { AdminEmailListByCourseDto } from '@/types/calendar/adminEmailListByCourseDto';
import { Event } from '@/types/calendar/googleCalendar';
import { HasSuperAdminRole } from '@/types/user';

export namespace GoogleCalendarApiDto {
  export type GetCalendarList = CalendarList;
  export type GetCalenderEvents = CalenderEvents;
  export type GetAclList = Acl[];
  export type PostCalendar = {
    currentRoleAndEmail: { roleType: keyof HasSuperAdminRole; email: string };
    emailListToBeAuthorized: AdminEmailListByCourseDto.Get;
    summary: string;
    courseId: number;
    description?: string;
  };
  export type PostEvent = Partial<
    Pick<Event, 'summary' | 'description' | 'location'>
  > & {
    start: { date?: string; dateTime?: string };
    end: { date?: string; dateTime?: string };
  };
}

type CalendarList = {
  etag: string;
  items: Calendar[];
  primary: boolean;
  kind: string;
  nextSyncToken: string;
};

type CalenderEvents = {
  calendarId?: string;
  accessRole: AccessRole;
  defaultReminders: Reminder;
  description?: string;
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string;
  items: Event[];
  nextSyncToken?: string;
};

type Acl = {
  kind: string;
  etag: string;
  id: string;
  scope: {
    type: string;
    value: string;
  };
  role: AccessRole;
};
