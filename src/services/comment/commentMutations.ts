import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostComment = (
  postId?: number,
  options?: UseMutationOptions<
    unknown,
    Error,
    { imgUrl: string; content: string; rate: number }
  >,
) => {
  return useMutation<
    unknown,
    AxiosError,
    { imgUrl: string; content: string; rate: number }
  >({
    mutationFn: async ({ content, imgUrl, rate }) => {
      const { data } = await axiosInstance.post(`/comments`, {
        postId,
        content,
        imgUrl,
        rate,
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
    {
      commentId: number;
      postId: number;
      content: string;
      imgUrl: string;
      rate: number;
    }
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
