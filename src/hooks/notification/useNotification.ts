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
        queryKey: ['useGetNotificationList'],
      });
    },
  });

  const { mutate: updateAllNotification } = useUpdateAllNotificationAsRead({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotificationList'],
      });
    },
  });

  const { mutate: deleteNotification } = useDeleteNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotificationList'],
      });
    },
  });

  const { mutate: deleteAllNotificationMutate } = useDeleteAllNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotificationList'],
      });
    },
  });

  // --개별 알림 읽기
  const setNotificationAsRead = (id: number) => {
    updateNotification(id);
  };

  // --알림 모두 읽기
  const setAllNotificationAsRead = () => {
    updateAllNotification();
  };

  // --알림 모두 삭제
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
