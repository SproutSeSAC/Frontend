import { HasAdminRole, Role } from '@/types';

/** Role 확인용 */
export const isSuperAdmin = (role: keyof Role) => {
  return role === 'SUPER_ADMIN';
};

export const isCampusLeader = (role: keyof Role) => {
  return role === 'CAMPUS_LEADER';
};

export const isOperationManager = (role: keyof Role) => {
  return role === 'OPERATION_MANAGER';
};

export const isEduManager = (role: keyof Role) => {
  return role === 'EDU_MANAGER';
};

export const isInstructor = (role: keyof Role) => {
  return role === 'INSTRUCTOR';
};

export const isJobCoordinator = (role: keyof Role) => {
  return role === 'JOB_COORDINATOR';
};

export const isTrainee = (role: keyof Role) => {
  return role === 'TRAINEE';
};

export const isPreTrainee = (role: keyof Role) => {
  return role === 'PRE_TRAINEE';
};

/** 권한 확인용 */
export const hasSuperAdmin = (role: keyof Role) => {
  return role === 'SUPER_ADMIN' || role === 'CAMPUS_LEADER';
};

export const hasAdmin = (role: keyof Role) => {
  const managers: (keyof HasAdminRole)[] = [
    'CAMPUS_LEADER',
    'OPERATION_MANAGER',
    'EDU_MANAGER',
    'JOB_COORDINATOR',
    'INSTRUCTOR',
  ];
  return !!managers.includes(role as keyof HasAdminRole);
};
