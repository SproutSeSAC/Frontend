import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostMyComment = (
  postId?: number,
  options?: UseMutationOptions<
    unknown,
    Error,
    { imgUrl: string; content: string }
  >,
) => {
  return useMutation<unknown, AxiosError, { imgUrl: string; content: string }>({
    mutationFn: async ({ content, imgUrl }) => {
      const { data } = await axiosInstance.post(`/comments`, {
        postId,
        content,
        imgUrl,
      });
      return data;
    },
    ...options,
  });
};

export const usePutMyComment = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { content: string; commentId: number; postId: number }
  >,
) => {
  return useMutation<
    unknown,
    AxiosError,
    { content: string; commentId: number; postId: number }
  >({
    mutationFn: async ({ content, commentId, postId }) => {
      const { data } = await axiosInstance.put(`/comments/${commentId}`, {
        postId,
        content,
      });
      return data;
    },
    ...options,
  });
};

export const useDeleteMyComment = (
  options?: UseMutationOptions<unknown, Error, { commentId: number }>,
) => {
  return useMutation<unknown, AxiosError, { commentId: number }>({
    mutationFn: async ({ commentId }) => {
      const { data } = await axiosInstance.delete(`/comments/${commentId}`);
      return data;
    },
    ...options,
  });
};
