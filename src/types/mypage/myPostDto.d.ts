export namespace myPostDto {
  export type GetMyScrapedPostList = MyScrapedPost[];
  export type GetMyPostList = MyPost[];
  export type GetMyCommentList = MyComment[];

  interface MyScrapedPost {
    postScrapId: number;
    userId: number;
    postId: number;
    createdAt: string;
  }

  interface MyPost {
    postId: number;
    clientId: number;
    postType: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }

  interface MyComment {
    commentId: number;
    userId: number;
    postId: number;
    content: string;
  }
}
