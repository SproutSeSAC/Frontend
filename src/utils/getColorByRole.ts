import { ManagerRole, Role, SuperAdminAndManagerRole } from '@/types';

export const getColorByRole = (
  role: keyof SuperAdminAndManagerRole | keyof ManagerRole | keyof Role,
) => {
  switch (role) {
    case 'JOB_COORDINATOR':
      return 'yellow';
    case 'CAMPUS_LEADER':
      return 'pink';
    case 'EDU_MANAGER':
      return 'blue';
    default:
      return 'purple';
  }
};
