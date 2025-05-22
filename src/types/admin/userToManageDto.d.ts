import { UserComment, UserPost, UserScrap } from '@/types/mypage/myPostDto';
import { Pageable } from '@/types/pageable';
import { RoleKey } from '@/types/user';

export namespace UserManagementDto {
  export type GetUserList = UserToManageList;
  export type GetMemo = UserMemo;

  export type GetScrapList = Pageable & { content: UserScrap[] };
  export type GetPostList = Pageable & { content: UserPost[] };
  export type GetCommentList = Pageable & { content: UserComment[] };

  export type GetPostListParams = PaginationFilter &
    SortPostTypeFilter & { order?: 'latest' | 'oldest' };
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
