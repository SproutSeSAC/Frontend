export namespace SproutCalendarDto {
  export type Get = CalendarIdByCourse;
  export type Post = CalendarId;
}

type CalendarIdByCourse = {
  id: number;
  calendarId: string;
  registerId: number;
  courseId: number;
};

type CalendarId = {
  calendarId: string;
};
