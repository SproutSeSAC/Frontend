import { HasAdminRole, Role } from '@/types';

export const getColorByRole = (
  role: keyof HasAdminRole | keyof HasAdminRole | keyof Role,
) => {
  // NOTE: 추가된 롤 색상 디자인 나오면 추가하기
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
