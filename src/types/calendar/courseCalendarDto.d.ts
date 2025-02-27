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
  name: string;
  nickname: string;
  roleType: keyof HasAdminRole;
};

export type AclEmail = AdminEmail & {
  accessRole: AccessRole;
};

export type CourseCalendarAcl = {
  isCreated: boolean;
  courseId: number;
  calendarId?: string;
  hasAclAdminList?: AclEmail[];
  hasNotAclAdminList?: AdminEmail[];
};
