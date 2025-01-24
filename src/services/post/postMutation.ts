import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { LoungeDto } from '@/types/lounge/loungeDto';
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

export const usePutMyPost = () => {
  return useMutation<
    boolean,
    AxiosError,
    { postId: number; requestBody: LoungeDto.PostProjectParams }
  >({
    mutationFn: async ({ postId, requestBody }) => {
      const { data } = await axiosInstance.put(`/posts/${postId}`, requestBody);
      return data;
    },
  });
};

export const useDeleteMyPost = () => {
  return useMutation<boolean, AxiosError, { postId: number }>({
    mutationFn: async ({ postId }) => {
      const { data } = await axiosInstance.delete(`/posts/${postId}`);
      return data;
    },
  });
};
