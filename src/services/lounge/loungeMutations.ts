import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { PostLoungeProject } from '@/types/lounge/loungeDto';
import { AxiosError } from 'axios';

export const usePostLoungeProject = () => {
  return useMutation<boolean, AxiosError, PostLoungeProject>({
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
