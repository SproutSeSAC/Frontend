export type Role = {
  ADMIN: '관리자';
  TRAINEE: '새싹 교육생';
  EDU_MANAGER: '교육 매니저';
  CAMPUS_MANAGER: '캠퍼스 매니저';
  JOB_COORDINATOR: '잡코디';
  PRE_TRAINEE: '예비 수강생';
};

export type KeyOfRole = keyof Role;

export type RoleValues = Role[keyof Role];

export type ManagerAdminRole = Pick<
  Role,
  'EDU_MANAGER' | 'CAMPUS_MANAGER' | 'JOB_COORDINATOR' | 'ADMIN'
>;

export type ManagerRole = Pick<
  Role,
  'EDU_MANAGER' | 'CAMPUS_MANAGER' | 'JOB_COORDINATOR'
>;
