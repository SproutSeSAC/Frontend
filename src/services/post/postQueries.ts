import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

type PostType = 'notice' | 'project';

// 게시글 목록 조회 API
export const useGetPostList = (postType: PostType) => {
  return useQuery({
    queryKey: ['useGetMyPostList', postType],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/type/${postType}`);
      return data;
    },
  });
};

// 특정 게시글 상세 조회 API
export const useGetPostDetail = (postId: number) => {
  return useQuery({
    queryKey: ['useGetMyPostDetail', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}`);
      return data;
    },
  });
};

// 게시글별 댓글 리스트 조회 API
export const useGetPostComments = (postId: number) => {
  return useQuery({
    queryKey: ['useGetPostComments', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
      return data;
    },
  });
};

// 게시글 Linked ID 조회 API
export const useGetPostLinkedId = (postId: number) => {
  return useQuery({
    queryKey: ['useGetPostLinkedId', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}/link`);
      return data;
    },
  });
};
