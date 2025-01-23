import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  useDeleteAllNotification,
  useDeleteNotification,
  useUpdateNotificationStatus,
} from '@/services/notification/notificationMutations';

export const useNotification = () => {
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
    updateNotification(id);
  };

  const deleteAllNotification = () => {
    deleteAllNotificationMutate();
  };

  return {
    setNotificationAsRead,
    deleteNotification,
    deleteAllNotification,
  };
};
