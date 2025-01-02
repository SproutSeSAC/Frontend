export namespace SproutCalendarDto {
  export type Get = CalendarIdByCourse;
  export type Post = CalendarId;
}

type CalendarIdByCourse = {
  calendarId: string;
  registerId: number;
  courseId: number;
  id: number;
};

type CalendarId = {
  calendarId: string;
};
