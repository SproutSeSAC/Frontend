import { ManagerAdminRole, ManagerRole, Role } from '@/types';

export const isManagerAndAdmin = (role: keyof Role) => {
  const managerAndAdmins: (keyof ManagerAdminRole)[] = [
    'CAMPUS_MANAGER',
    'ADMIN',
    'EDU_MANAGER',
    'JOB_COORDINATOR',
  ];
  return !!managerAndAdmins.includes(role as keyof ManagerAdminRole);
};

export const isManager = (role: keyof Role) => {
  const managers: (keyof ManagerRole)[] = [
    'CAMPUS_MANAGER',
    'EDU_MANAGER',
    'JOB_COORDINATOR',
  ];
  return !!managers.includes(role as keyof ManagerRole);
};

export const isTrainee = (role: keyof Role) => {
  return role === 'TRAINEE';
};

export const isPreTrainee = (role: keyof Role) => {
  return role === 'PRE_TRAINEE';
};

export const isEduManager = (role: keyof Role) => {
  return role === 'EDU_MANAGER';
};

export const isCampusManager = (role: keyof Role) => {
  return role === 'CAMPUS_MANAGER';
};

export const isJobCoordinator = (role: keyof Role) => {
  return role === 'JOB_COORDINATOR';
};

export const isAdmin = (role: keyof Role) => {
  return role === 'ADMIN';
};
