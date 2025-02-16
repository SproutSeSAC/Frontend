import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { Notification } from '@/types';

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['useGetNotifications'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Notification[]>('/noti');
      return data;
    },
  });
};

export const useGetUnReadNotifications = () => {
  return useQuery({
    queryKey: ['useGetUnReadNotifications'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Notification[]>('/noti/unread');
      return data;
    },
  });
};
