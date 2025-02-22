import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostNoticeSessions = () => {
  return useMutation<boolean, AxiosError, { sessionId: number }>({
    mutationFn: async requestBody => {
      const { sessionId } = requestBody;
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/application`,
      );
      return data;
    },
  });
};

export const usePostSessionApply = () => {
  return useMutation<boolean, AxiosError, { sessionId: number }>({
    mutationFn: async ({ sessionId }) => {
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/application`,
      );
      return data;
    },
  });
};
