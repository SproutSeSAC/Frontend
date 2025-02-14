import { HasAdminRole, HasSuperAdminRole } from '@/types';

export const rolesObj = {
  SUPER_ADMIN: '최고 관리자',
  CAMPUS_LEADER: '캠퍼스 담당자',
  OPERATION_MANAGER: '운영 매니저',
  EDU_MANAGER: '교육 매니저',
  INSTRUCTOR: '강사',
  JOB_COORDINATOR: '잡코디',
  TRAINEE: '새싹 교육생',
} as const;

export const hasSuperAdminRolesObj: HasSuperAdminRole = {
  CAMPUS_LEADER: '캠퍼스 담당자',
  SUPER_ADMIN: '최고 관리자',
};

export const hasAdminRolesObj: HasAdminRole = {
  ...hasSuperAdminRolesObj,
  OPERATION_MANAGER: '운영 매니저',
  EDU_MANAGER: '교육 매니저',
  JOB_COORDINATOR: '잡코디',
  INSTRUCTOR: '강사',
};

export const hasSuperAdminRoleList: (keyof HasSuperAdminRole)[] = [
  'SUPER_ADMIN',
  'CAMPUS_LEADER',
];

export const hasAdminRoleList: (keyof HasAdminRole)[] = [
  ...hasSuperAdminRoleList,
  'OPERATION_MANAGER',
  'EDU_MANAGER',
  'INSTRUCTOR',
  'JOB_COORDINATOR',
];
