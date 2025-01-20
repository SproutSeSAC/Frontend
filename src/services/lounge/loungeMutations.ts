import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { LoungeDto } from '@/types/lounge/loungeDto';
import { AxiosError } from 'axios';

export const useDeleteLoungeProject = (
  options?: UseMutationOptions<unknown, Error, { projectId: number }>,
) => {
  return useMutation<boolean, AxiosError, { projectId: number }>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.delete(
        `/project/${requestBody.projectId}`,
      );
      return data;
    },
    ...options,
  });
};

export const usePutLoungeProject = (
  options?: UseMutationOptions<unknown, Error, LoungeDto.PutProjectParams>,
) => {
  return useMutation<unknown, AxiosError, LoungeDto.PutProjectParams>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.put(
        `/project/${requestBody.projectId}`,
        requestBody.params,
      );
      return data;
    },
    ...options,
  });
};

export const usePostLoungeProject = () => {
  return useMutation<boolean, AxiosError, LoungeDto.PostProjectParams>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(`/project`, requestBody);
      return data;
    },
  });
};

export const usePostIncrementViewCount = () => {
  return useMutation<boolean, AxiosError, { projectId: number }>({
    mutationFn: async requestParams => {
      const { data } = await axiosInstance.post(
        `/project/${requestParams.projectId}/view`,
      );
      return data;
    },
  });
};

export const usePostScrapProject = () => {
  return useMutation<boolean, AxiosError, { projectId: number }>({
    mutationFn: async requestParams => {
      const { data } = await axiosInstance.post(
        `/project/${requestParams.projectId}/scrap`,
      );
      return data;
    },
  });
};

export const usePostProjectComment = (projectId: number) => {
  return useMutation<boolean, AxiosError, { content: string }>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(
        `/project/${projectId}/comment`,
        requestBody,
      );
      return data;
    },
  });
};
