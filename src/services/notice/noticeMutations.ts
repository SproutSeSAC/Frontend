import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { NoticeDto } from '@/types';
import { AxiosError } from 'axios';

export const usePostNotice = (
  options?: UseMutationOptions<unknown, Error, NoticeDto.PostNotice>,
) => {
  const postNotice = async (formData: NoticeDto.PostNotice) => {
    await axiosInstance.post('/notices', formData);
  };

  return useMutation<unknown, AxiosError, NoticeDto.PostNotice>({
    mutationFn: postNotice,
    mutationKey: ['notices'],
    ...options,
  });
};

export const usePutEditNotice = (
  options?: UseMutationOptions<
    unknown,
    Error,
    NoticeDto.PostNotice & { noticeId: number }
  >,
) => {
  const postEditedNotice = async (
    editedFormData: NoticeDto.PostNotice & { noticeId: number },
  ) => {
    const { noticeId, ...rest } = editedFormData;
    await axiosInstance.put(`/notices/${noticeId}`, rest);
  };

  return useMutation<
    unknown,
    AxiosError,
    NoticeDto.PostNotice & { noticeId: number }
  >({
    mutationFn: postEditedNotice,
    mutationKey: ['editedNotice'],
    ...options,
  });
};

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

export const useDeleteNotice = (
  options?: UseMutationOptions<unknown, Error, { noticeId: number }>,
) => {
  return useMutation<boolean, AxiosError, { noticeId: number }>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.delete(
        `/notices/${requestBody.noticeId}`,
      );
      return data;
    },
    ...options,
  });
};

export const usePostNoticeScrap = () => {
  return useMutation<boolean, AxiosError, { noticeId: number }>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(
        `/notices/${requestBody.noticeId}/scrap`,
      );

      return data.isScraped;
    },
  });
};
