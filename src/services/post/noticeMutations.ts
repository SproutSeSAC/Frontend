import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

export const usePostNoticeSessions = () => {
  return useMutation<
    boolean,
    AxiosError,
    { phoneNumber: string; sessionId: number }
  >({
    mutationFn: async requestBody => {
      const { phoneNumber, sessionId } = requestBody;
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/application`,
        { phoneNumber },
      );
      return data;
    },
  });
};

export const usePostSessionApply = () => {
  return useMutation<
    boolean,
    AxiosError,
    { sessionId: number; phoneNumber: string }
  >({
    mutationFn: async ({ sessionId, phoneNumber }) => {
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/application`,
        {
          body: { phoneNumber },
        },
      );
      return data;
    },
  });
};
