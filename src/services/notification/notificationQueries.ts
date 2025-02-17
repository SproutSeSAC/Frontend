import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { Notification } from '@/types';

export const useGetNotificationList = () => {
  return useQuery({
    queryKey: ['useGetNotificationList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Notification[]>('/noti');
      return data;
    },
  });
};

export const useGetUnReadNotificationList = () => {
  return useQuery({
    queryKey: ['useGetUnReadNotificationList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Notification[]>('/noti/unread');
      return data;
    },
  });
};
