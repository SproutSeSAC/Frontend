import { Event } from '@/types/calendar/googleCalendar';

export namespace GoogleCalendarApiDto {
  export type GetCalendarList = CalendarList;
  export type GetCalenderEvents = CalenderEvents;
  export type GetAclList = Acl[];

  export type PostCalendar = {
    userRole: KeyOfRole;
    summary: string;
    courseId: number;
    authorizedEmails: AuthorizedEmailsByRole;
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
