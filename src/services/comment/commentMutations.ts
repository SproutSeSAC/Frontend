import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostComment = (
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

export const usePatchComment = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { commentId: number; postId: number; content: string; imgUrl: string }
  >,
) => {
  return useMutation({
    mutationFn: async ({ commentId, ...rest }) => {
      const { data } = await axiosInstance.patch(
        `/comments/${commentId}`,
        rest,
      );
      return data;
    },
    ...options,
  });
};

export const useDeleteComment = (
  options?: UseMutationOptions<unknown, Error, { commentId: number }>,
) => {
  return useMutation({
    mutationFn: async ({ commentId }) => {
      const { data } = await axiosInstance.delete(`/comments/${commentId}`);
      return data;
    },
    ...options,
  });
};
