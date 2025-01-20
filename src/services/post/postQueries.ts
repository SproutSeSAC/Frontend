import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

export const useGetMyPostDetail = (postId: number) => {
  return useQuery({
    queryKey: ['useGetMyPostDetail', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}`);
      return data;
    },
  });
};

export const useGetMyPostList = (postType: 'notice' | 'project') => {
  return useQuery({
    queryKey: ['useGetMyPostList', postType],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/type/${postType}`);
      return data;
    },
  });
};

export const useGetPostComments = (postId: number) => {
  return useQuery({
    queryKey: ['useGetPostComments', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
      return data;
    },
  });
};
