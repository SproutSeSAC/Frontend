import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { LoungeDto } from '@/types/lounge/loungeDto';
import { AxiosError } from 'axios';

export const usePostLoungeProject = () => {
  return useMutation<boolean, AxiosError, LoungeDto.Request.PostLoungeProject>({
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
