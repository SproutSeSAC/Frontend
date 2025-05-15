import { UserComment, UserPost, UserScrap } from '@/types/mypage/myPostDto';
import { PageableType } from '@/types/pageable';
import { RoleKey } from '@/types/user';

export namespace UserManagementDto {
  export type GetUserList = UserToManageList;
  export type GetMemo = UserMemo;
  export type GetScrapList = PageableType & { content: UserScrap[] };
  export type GetPostList = PageableType & { content: UserPost[] };
  export type GetCommentList = PageableType & { content: UserComment[] };
}

type UserToManageList = {
  content: UserToManage[];
  totalCount: number;
};

type UserMemo = {
  memoId: number;
  content: string;
};

type UserToManage = {
  userId: number;
  name: string;
  nickname: string;
  email: string;
  role?: RoleKey;
  phoneNumber: string;
  campus: { campusId: number; name: string }[];
  course: { courseId: number; name: string }[];
  memo: {
    memoId: number;
    content: string;
  };
};
