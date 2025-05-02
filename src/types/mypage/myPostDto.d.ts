import { postTypeObj } from '@/constants';
import { Ptype } from '@/types/lounge';
import { RoleKey } from '@/types/user';

import { PostType } from '@/components/common/tag/Tag';

export namespace MyPostDto {
  export type GetScrapedPostList = ScrapedPostList;
  export type GetPostList = UserPost[];
  export type GetCommentList = UserComment[];
}

interface ScrapedPostList {
  content: UserScrap[];
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

type UserScrap = {
  id: number;
  writer: {
    name: string;
    nickname: string;
    profileImg: string;
  };
  postId: number;
  title: string;
  postType: keyof typeof postTypeObj;
  content: string;
  ptype: Ptype;
  createdAt: string;
};

type UserPost = {
  ptype: Ptype;
  postId: number;
  linkedId: number;
  clientId: number;
  postType: keyof PostType;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdNickName: string;
};

type UserComment = {
  commentId: number;
  userNickname: string;
  postId: number;
  content: string;
  createdAt: string;
  postType: keyof typeof postTypeObj;
  ptype: Ptype;
};

export type CommentDetail = {
  id: number;
  postId: number;
  content: string;
  createAt: string;
  userInfo: { nickname: string; profileImg: string; role: RoleKey };
  imgUrl: string;
};
