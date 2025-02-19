import { HasAdminRole } from '@/types/user';

export namespace CourseCalendarDto {
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

export type AdminEmail = {
  email: string;
  nickname: string;
  roleType: keyof HasAdminRole;
};

export type AclEmail = {
  email: string;
  nickname: string;
  accessRole: AccessRole;
  roleType: keyof HasAdminRole;
};

export type CourseCalendarAcl = {
  isCreated: boolean;
  courseId: number;
  courseTitle: string;
  calendarId?: string;
  hasAclAdminList?: AclEmail[];
  hasNotAclAdminList?: AdminEmail[];
};
