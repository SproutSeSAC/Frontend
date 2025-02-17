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

export const useUpdateAllNotificationAsRead = (
  mutationOptions?: UseMutationOptionsType,
) => {
  const updateAllNotificationAsRead = async () => {
    await axiosInstance.patch('/noti/all');
  };

  return useMutation<unknown, AxiosError>({
    mutationFn: updateAllNotificationAsRead,
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

export const useDeleteAllNotification = (
  mutationOptions?: UseMutationOptionsType,
) => {
  const deleteNotifications = async () => {
    await axiosInstance.delete('/noti/all');
  };

  return useMutation<unknown, AxiosError>({
    mutationFn: deleteNotifications,
    ...mutationOptions,
  });
};
