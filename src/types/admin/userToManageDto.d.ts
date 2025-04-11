import { Option } from '@/types/filter';
import { RoleKey } from '@/types/user';

export namespace UserManagementDto {
  export type GetUserList = UserToManageList;
}

type UserToManageList = {
  content: UserToManage[];
  totalCount: number;
};

type UserToManage = {
  userId: number;
  name: string;
  nickname: string;
  email: string;
  role?: RoleKey;
  phoneNumber: string;
  campus: Option[];
  course: Option[];
  memo: {
    memoId: number;
    content: string;
  };
};
