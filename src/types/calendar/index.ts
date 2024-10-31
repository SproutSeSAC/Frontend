import { Calendar } from '@/types';

export type CalendarListLabel = '나의 캘린더' | '구독중인 캘린더';

export type CalendarListByLabel = {
  label: CalendarListLabel;
  calendarList: Calendar[];
};

export type FullCalendarEvent = {
  allDay: boolean;
  backgroundColor: string;
  title: string;
  start: string;
  end: string;
  id: string;
};
