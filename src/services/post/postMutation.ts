import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostMyPost = <T>(
  options?: UseMutationOptions<unknown, Error, T>,
) => {
  return useMutation<boolean, AxiosError, T>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(`/posts`, requestBody);
      return data;
    },
    ...options,
  });
};

export const usePutMyPost = <T>() => {
  return useMutation<unknown, AxiosError, { postId: number; params: T }>({
    mutationFn: async ({ postId, params }) => {
      const { data } = await axiosInstance.put(`/posts/${postId}`, params);
      return data;
    },
  });
};

export const useDeleteMyPost = (
  options?: UseMutationOptions<unknown, Error, { postId: number }>,
) => {
  return useMutation<unknown, AxiosError, { postId: number }>({
    mutationFn: async ({ postId }) => {
      const { data } = await axiosInstance.delete(`/posts/${postId}`);
      return data;
    },
    ...options,
  });
};
