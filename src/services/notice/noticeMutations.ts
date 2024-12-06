import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

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

export const usePostNoticeComment = (noticeId: number) => {
  return useMutation<boolean, AxiosError, { content: string }>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(
        `/notices/${noticeId}/comments`,
        requestBody,
      );
      return data;
    },
  });
};
