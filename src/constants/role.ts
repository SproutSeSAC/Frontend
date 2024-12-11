import { ManagerAdminRole, ManagerRole, Role } from '@/types';

export const managerRolesObj: ManagerRole = {
  CAMPUS_MANAGER: '캠퍼스 매니저',
  EDU_MANAGER: '교육 매니저',
  JOB_COORDINATOR: '잡코디',
};

export const managerAndAdminRolesObj: ManagerAdminRole = {
  ADMIN: '관리자',
  ...managerRolesObj,
};

export const RolesObj: Role = {
  TRAINEE: '새싹 교육생',
  PRE_TRAINEE: '예비 수강생',
  ...managerAndAdminRolesObj,
};
