import { Ptype } from '@/types/lounge';
import { RoleKey } from '@/types/user';

import { PostType } from '@/components/common/tag/Tag';

export namespace myPostDto {
  export type GetMyScrapedPostList = MyScrapedPostList;
  export type GetMyPostList = MyPost[];
  export type GetMyCommentList = MyComment[];
}

interface MyScrapedPostList {
  content: MyScrapedPost[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  empty: boolean;
}

type MyScrapedPost = {
  id: number;
  writer: {
    name: string;
    nickname: string;
    profileImg: string;
  };
  postId: number;
  title: string;
  postType: keyof PostType;
  content: string;
  ptype: Ptype;
  createdAt: string;
};

interface MyPost {
  ptype: Ptype;
  postId: number;
  linkedId: number;
  clientId: number;
  postType: keyof PostType;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdNickName: string;
}

export type CommentDetail = {
  id: number;
  postId: number;
  content: string;
  createAt: string;
  userInfo: { nickname: string; profileImg: string; role: RoleKey };
  imgUrl: string;
};

type MyComment = {
  commentId: number;
  userNickname: string;
  postId: number;
  content: string;
  createdAt: string;
  postType: keyof PostType;
  ptype: Ptype;
};
