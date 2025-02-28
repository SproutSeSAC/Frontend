import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { CommentDetail } from '@/types/mypage/myPostDto';

export const useGetCommentByPostList = (postId: number) => {
  return useQuery({
    queryKey: ['useGetCommentByPostList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CommentDetail[]>(
        `/posts/${postId}/comments`,
      );
      return data.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
      );
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCommentDetail = (commentId: number) => {
  return useQuery({
    queryKey: ['useGetCommentDetail', commentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CommentDetail[]>(
        `/posts/${commentId}/comments`,
      );
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
