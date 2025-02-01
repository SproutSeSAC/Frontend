import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { myPostDto } from '@/types/mypage/myPostDto';

export const useGetCommentByPostList = (postId: number) => {
  return useQuery({
    queryKey: ['useGetCommentByPostList', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<myPostDto.GetMyCommentList>(
        `/posts/${postId}/comments`,
      );
      return data;
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
