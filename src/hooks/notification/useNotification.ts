import { useQueryClient } from '@tanstack/react-query';

import {
  useDeleteAllNotification,
  useDeleteNotification,
  useUpdateAllNotificationAsRead,
  useUpdateNotificationStatus,
} from '@/services/notification/notificationMutations';

export const useNotification = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateNotification } = useUpdateNotificationStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotifications'],
      });
    },
  });

  const { mutate: updateAllNotification } = useUpdateAllNotificationAsRead({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotifications'],
      });
    },
  });

  const { mutate: deleteNotification } = useDeleteNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotifications'],
      });
    },
  });

  const { mutate: deleteAllNotificationMutate } = useDeleteAllNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotifications'],
      });
    },
  });

  const setNotificationAsRead = (id: number) => {
    updateNotification(id);
  };

  // --알림 모두 읽기
  const setAllNotificationAsRead = () => {
    updateAllNotification();
  };

  const deleteAllNotification = () => {
    deleteAllNotificationMutate();
  };

  return {
    setNotificationAsRead,
    setAllNotificationAsRead,
    deleteNotification,
    deleteAllNotification,
  };
};
