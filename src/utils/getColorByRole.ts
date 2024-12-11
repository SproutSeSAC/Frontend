import { ManagerAdminRole, ManagerRole, Role } from '@/types';

export const getColorByRole = (
  role: keyof ManagerAdminRole | keyof ManagerRole | keyof Role,
) => {
  switch (role) {
    case 'JOB_COORDINATOR':
      return 'yellow';
    case 'CAMPUS_MANAGER':
      return 'pink';
    case 'EDU_MANAGER':
      return 'blue';
    default:
      return 'purple';
  }
};
