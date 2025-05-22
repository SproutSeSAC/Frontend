import { Ptype } from '@/types/lounge';
import {
  Pageable,
  PaginationFilter,
  SortPostTypeFilter,
} from '@/types/pageable';
import { PostTypeKey } from '@/types/serviceType';
import { RoleKey } from '@/types/user';

export namespace MyPostDto {
  export type GetScrapedPostList = Pageable & { content: UserScrap[] };
  export type GetPostList = Pageable & { content: UserPost[] };
  export type GetCommentList = Pageable & { content: UserComment[] };

  export type GetPostListParams = PaginationFilter &
    SortPostTypeFilter & { order?: 'latest' | 'oldest' };
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
  postType: PostTypeKey;
  content: string;
  ptype: Ptype;
  createdAt: string;
};

type UserPost = {
  ptype: Ptype;
  postId: number;
  linkedId: number;
  clientId: number;
  postType: PostTypeKey;
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
  postType: PostTypeKey;
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
