import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

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

export const usePatchNoticeStatus = (
  options?: UseMutationOptions<unknown, Error, { noticeId: number }>,
) => {
  return useMutation<boolean, AxiosError, { noticeId: number }>({
    mutationFn: async ({ noticeId }) => {
      const { data } = await axiosInstance.patch(`/notices/${noticeId}/status`);
      return data;
    },
    ...options,
  });
};
