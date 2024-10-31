export * from '@/types/calendar/googleCalendarAPIDto';
export * from '@/types/calendar/googleCalendar';
export * from '@/types/calendar/sproutCalendarDto';
export * from '@/types/calendar/managerEmailListByCourseDto';

export type CalendarListCategory = '나의 캘린더' | '구독중인 캘린더';

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
};
