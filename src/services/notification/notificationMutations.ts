import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosError } from 'axios';

type UseMutationOptionsType<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;

export const useUpdateNotificationStatus = (
  mutationOptions?: UseMutationOptionsType,
) => {
  const updateNotificationStatus = async (notificationId: number) => {
    const { data } = await axiosInstance.patch<boolean>(
      `/noti/${notificationId}/read`,
    );
    return data;
  };

  return useMutation<unknown, AxiosError, number>({
    mutationFn: updateNotificationStatus,
    ...mutationOptions,
  });
};

export const useDeleteNotification = (
  mutationOptions?: UseMutationOptionsType,
) => {
  const deleteNotification = async (notificationId: number) => {
    await axiosInstance.delete(`/noti/${notificationId}`);
  };

  return useMutation<unknown, AxiosError, number>({
    mutationFn: deleteNotification,
    ...mutationOptions,
  });
};
