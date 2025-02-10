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
  postId: number;
  linkedId: 2;
  clientId: number; // NOTE: 필요없음
  postType: 'PROJECT' | 'MEAL';
  title: string;
  createdAt: string;
  updatedAt: string;
  createdNickName: string; // NOTE: 필요없음
}

interface MyComment {
  id: number;
  postId: number;
  content: string;
  createAt: string;
  userNickname: string;
  imgUrl: string;
}
