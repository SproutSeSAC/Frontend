import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

// 특정 게시글 상세 조회 API
export const useGetPostDetail = <T>(
  postId?: number,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) => {
  const getPost = async () => {
    const { data } = await axiosInstance.get<T>(`/posts/${postId}`);
    return data;
  };

  return useQuery({
    queryKey: ['useGetPostDetail', postId],
    queryFn: getPost,
    enabled: !!postId,
    retry: false,
    ...options,
  });
};

// 게시글 Linked ID 조회 API
export const useGetPostLinkedId = (postId?: number) => {
  return useQuery({
    queryKey: ['useGetPostLinkedId', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}/link`);
      return data;
    },
    enabled: !!postId,
  });
};

// 스크랩한 게시글
export const useGetScrapedPostList = () => {
  return useQuery({
    queryKey: ['useGetScrapedPostList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/scraps`);
      return data;
    },
  });
};
