import { ServiceType } from '@/constants/serviceConstant';
import { HasAdminRole, Role } from '@/types';

export const getColorByRole = (
  role: keyof HasAdminRole | keyof HasAdminRole | keyof Role,
) => {
  switch (role) {
    case 'CAMPUS_LEADER':
      return 'pink';
    case 'EDU_MANAGER':
      return 'blue';
    case 'JOB_COORDINATOR':
      return 'yellow';
    case 'INSTRUCTOR':
      return 'green';

    default:
      return 'purple';
  }
};

export const getColorByPostType = (postType: keyof ServiceType) => {
  switch (postType) {
    case 'MEAL':
    case 'STORE':
      return 'pink';
    case 'NOTICE':
      return 'green';
    case 'PROJECT':
      return 'purple';
    case 'STUDY':
      return 'blue';

    default:
      return 'purple';
  }
};
