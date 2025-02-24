import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { myPostDto } from '@/types/mypage/myPostDto';

export const useGetCommentByPostList = (postId: number) => {
  return useQuery({
    queryKey: ['useGetCommentByPostList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<myPostDto.GetMyCommentList>(
        `/posts/${postId}/comments`,
      );
      return data.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
      );
    },
  });
};

export const useGetCommentDetail = (commentId: number) => {
  return useQuery({
    queryKey: ['useGetCommentDetail', commentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<myPostDto.GetMyCommentList>(
        `/posts/${commentId}/comments`,
      );
      return data;
    },
  });
};
