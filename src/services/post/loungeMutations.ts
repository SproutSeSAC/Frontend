import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

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
