import { useQueryClient } from '@tanstack/react-query';

import { useDeleteNotification } from '@/services/notification/notificationMutations';

export const useHandleNotification = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteNotification } = useDeleteNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetNotifications'],
      });
    },
  });

  return {
    deleteNotification,
  };
};
