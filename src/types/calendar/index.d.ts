export * from '@/types/calendar/googleCalendarAPIDto';
export * from '@/types/calendar/googleCalendar';
export * from '@/types/calendar/sproutCalendarDto';
export * from '@/types/calendar/managerEmailListByCourseDto';

export type CalendarListCategory = 'Sprout 캘린더' | '나의 캘린더';

export type CalendarListByCategory = {
  category: CalendarListCategory;
  calendarList: Calendar[];
};

export type FullCalendarEvent = {
  allDay: boolean;
  backgroundColor: string;
  title: string;
  start: string;
  end: string;
  id: string;
  rrule?: RruleOptions;
  exdate?: string[];
};

export type RruleOptions = {
  freq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  count?: string;
  byweekday?: string[] | string;
  bymonthday?: number[];
  until?: string;
  bysetpos?: number[] | number;
  byearday?: number[];
  bymonth?: number[];
  byhour?: number[];
  byminute?: number[];
  bysecond?: number[];
  wkst?: 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
};
