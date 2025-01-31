import { rolesObj } from '@/constants';

export type Role = typeof rolesObj;
export type RoleKey = keyof Role;
export type RoleValue = Role[keyof Role];

export type SuperAdminAndManagerRole = Pick<
  Role,
  | 'SUPER_ADMIN'
  | 'CAMPUS_LEADER'
  | 'OPERATION_MANAGER'
  | 'EDU_MANAGER'
  | 'INSTRUCTOR'
  | 'JOB_COORDINATOR'
>;

export type ManagerRole = Pick<
  Role,
  | 'CAMPUS_LEADER'
  | 'OPERATION_MANAGER'
  | 'EDU_MANAGER'
  | 'INSTRUCTOR'
  | 'JOB_COORDINATOR'
>;
