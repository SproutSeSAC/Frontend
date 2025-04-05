import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

/** Trainee API */
export const usePostApplySession = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { sessionId: number; phoneNumber: number }
  >,
) => {
  return useMutation<
    unknown,
    AxiosError,
    { sessionId: number; phoneNumber: number }
  >({
    mutationFn: async ({ sessionId, phoneNumber }) => {
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/application`,
        {
          phoneNumber,
        },
      );
      return data;
    },
    ...options,
  });
};

export const useDeleteAppliedSession = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { sessionId: number; participantId: number }
  >,
) => {
  return useMutation<
    unknown,
    AxiosError,
    { sessionId: number; participantId: number }
  >({
    mutationFn: async ({ sessionId, participantId }) => {
      const { data } = await axiosInstance.delete(
        `/notices/sessions/${sessionId}/cancel/${participantId}`,
      );
      return data;
    },
    ...options,
  });
};

/** Admin API */
export const usePostAcceptSession = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { sessionId: number; participantId: number }
  >,
) => {
  return useMutation<
    unknown,
    AxiosError,
    { sessionId: number; participantId: number }
  >({
    mutationFn: async ({ sessionId, participantId }) => {
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/accept/${participantId}`,
      );
      return data;
    },
    ...options,
  });
};

export const usePostRejectSession = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { sessionId: number; participantId: number }
  >,
) => {
  return useMutation<
    unknown,
    AxiosError,
    { sessionId: number; participantId: number }
  >({
    mutationFn: async ({ sessionId, participantId }) => {
      const { data } = await axiosInstance.post(
        `/notices/sessions/${sessionId}/reject/${participantId}`,
      );
      return data;
    },
    ...options,
  });
};
