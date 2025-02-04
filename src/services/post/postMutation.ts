import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostMyPost = <T>(
  options?: UseMutationOptions<unknown, Error, T>,
) => {
  return useMutation<unknown, AxiosError, T>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(`/posts`, requestBody);
      return data;
    },
    ...options,
  });
};

export const usePutMyPost = <T>(
  options?: UseMutationOptions<unknown, Error, { postId: number; params: T }>,
) => {
  return useMutation<unknown, AxiosError, { postId: number; params: T }>({
    mutationFn: async ({ postId, params }) => {
      const { data } = await axiosInstance.put(`/posts/${postId}`, params);
      return data;
    },
    ...options,
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

/** 포스트 스크랩 API */
export const usePostScrap = (
  options?: UseMutationOptions<unknown, Error, { postId: number }>,
) => {
  return useMutation<boolean, AxiosError, { postId: number }>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(
        `/scraps/${requestBody.postId}`,
        requestBody,
      );
      return data;
    },
    ...options,
  });
};

export const useDeleteScrap = (
  options?: UseMutationOptions<unknown, Error, { postId: number }>,
) => {
  return useMutation<unknown, AxiosError, { postId: number }>({
    mutationFn: async ({ postId }) => {
      const { data } = await axiosInstance.delete(`/scraps/${postId}`);
      return data;
    },
    ...options,
  });
};

export const useDeleteAllScrap = (
  options?: UseMutationOptions<unknown, Error>,
) => {
  return useMutation<unknown, AxiosError>({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/scraps`);
      return data;
    },
    ...options,
  });
};
