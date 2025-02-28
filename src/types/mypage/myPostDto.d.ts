import { Ptype } from '@/types/lounge';

export namespace myPostDto {
  export type GetMyScrapedPostList = MyScrapedPost[];
  export type GetMyPostList = MyPost[];
  export type GetMyCommentList = MyComment[];
}

interface MyScrapedPost {
  postScrapId: number;
  userId: number;
  postId: number;
  createdAt: string;
}

interface MyPost {
  ptype: Ptype | 'MEAL';
  postId: number;
  linkedId: 2;
  clientId: number; // NOTE: 필요없음
  postType: 'PROJECT' | 'MEAL';
  title: string;
  createdAt: string;
  updatedAt: string;
  createdNickName: string; // NOTE: 필요없음
}

export type CommentDetail = {
  id: number;
  postId: number;
  content: string;
  createAt: string;
  userInfo: { nickname: string; profileImg: string };
  imgUrl: string;
};

type MyComment = {
  commentId: number;
  userNickname: string;
  postId: number;
  content: string;
  createdAt: string;
  postType: 'NOTICE' | 'PROJECT' | 'STUDY' | 'MEAL';
};
