import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  useDeleteAllNotification,
  useDeleteNotification,
  useUpdateNotificationStatus,
} from '@/services/notification/notificationMutations';

import { notificationsData } from '@/components/notification/notifications';

export const useNotification = () => {
  const [data, setData] = useState(notificationsData); // mock data

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: updateNotification } = useUpdateNotificationStatus({
    onSuccess: () => {
      navigate('/lounge/post/39'); // TODO 알림에 맞는 게시물로 이동
    },
  });

  const { mutateAsync: deleteNotification } = useDeleteNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotifications'],
      });
    },
  });

  const { mutateAsync: deleteAllNotificationMutate } = useDeleteAllNotification(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['useGetNotifications'],
        });
      },
    },
  );

  const setNotificationAsRead = (id: number) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, isRead: true } : item,
    );
    setData(updatedData);
    updateNotification(id);
  };

  const deleteAllNotification = () => {
    setData([]);
    deleteAllNotificationMutate();
  };

  return {
    data,
    setNotificationAsRead,
    deleteNotification,
    deleteAllNotification,
  };
};
