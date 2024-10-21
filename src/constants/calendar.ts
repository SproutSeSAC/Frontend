export type AdminCalendarLabel =
  | '캠퍼스 매니저의 새싹 캘린더'
  | '교육 매니저의 새싹 캘린더';

export const adminCalendarListLabel: AdminCalendarLabel[] = [
  '캠퍼스 매니저의 새싹 캘린더',
  '교육 매니저의 새싹 캘린더',
];

export const CALENDAR_COOKIE_KEY = 'calendar_access_token';

export const CALENDAR_ADDRESS_ID =
  'addressbook#contacts@group.v.calendar.google.com';
