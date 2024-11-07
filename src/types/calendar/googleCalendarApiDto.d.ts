import { Event } from '@/types/calendar/googleCalendar';

export namespace GoogleCalendarApiDto {
  export type GetCalendarList = CalendarList;
  export type GetCalenderEvents = CalenderEvents;
  export type GetAclList = Acl[];
}

type CalendarList = {
  etag: string;
  items: Calendar[];
  primary: boolean;
  kind: string;
  nextSyncToken: string;
};

type CalenderEvents = {
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
