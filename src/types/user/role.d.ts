import { rolesObj } from '@/constants';

export type Role = typeof rolesObj;
export type RoleKey = keyof Role;

export type HasSuperAdminRole = Pick<Role, 'SUPER_ADMIN' | 'CAMPUS_LEADER'>;

export type HasAdminRole = Pick<
  Role,
  | 'SUPER_ADMIN'
  | 'CAMPUS_LEADER'
  | 'OPERATION_MANAGER'
  | 'EDU_MANAGER'
  | 'INSTRUCTOR'
  | 'JOB_COORDINATOR'
>;
