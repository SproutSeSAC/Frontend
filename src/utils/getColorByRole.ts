import { RoleValues } from '@/types';

export const getColorByRole = (role: RoleValues) => {
  switch (role) {
    case '잡코디':
      return 'yellow';
    case '캠퍼스 매니저':
      return 'pink';
    case '교육 매니저':
      return 'blue';
    default:
      return 'purple';
  }
};
