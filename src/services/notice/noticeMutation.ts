import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { NoticeDto } from '@/types';
import { AxiosError } from 'axios';

export const usePostNotice = (
  options?: UseMutationOptions<unknown, Error, NoticeDto.Post>,
) => {
  const postNotice = async (formData: NoticeDto.Post) => {
    await axiosInstance.post('/notices', formData);
  };

  return useMutation<unknown, AxiosError, NoticeDto.Post>({
    mutationFn: postNotice,
    mutationKey: ['notices'],
    ...options,
  });
};
