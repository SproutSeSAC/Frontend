import { HasAdminRole } from '@/types/user';

export namespace AdminEmailListByCourseDto {
  export type Get = AdminEmailByCourse[];
}

type AdminEmailByCourse = {
  id: number;
  email: string;
  nickname: string;
  roleType: keyof HasAdminRole;
};
