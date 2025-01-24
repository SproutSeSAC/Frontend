import { useEffect } from 'react';

import { useNotification } from '@/hooks/notification/useNotification';

import { useGetNotifications } from '@/services/notification/notificationQueries';

import { notificationOpenAtom } from '@/atoms/notificationAtom';

import { useAtomValue } from 'jotai';
import { FaRegTrashAlt } from 'react-icons/fa';

import CardContent from '@/components/notification/CardContent';

export default function NotificationContent() {
  const isNotificationOpen = useAtomValue(notificationOpenAtom);
  const { data: notifications, refetch } = useGetNotifications();
  const { setNotificationAsRead, deleteAllNotification } = useNotification();

  useEffect(() => {
    if (isNotificationOpen) {
      refetch();
    }
  }, [isNotificationOpen, refetch]);

  return (
    <>
      <button
        onClick={deleteAllNotification}
        className="mb-6 flex items-center justify-end gap-1 text-end text-base text-[#6D6D6D]"
      >
        <FaRegTrashAlt />
        모두 삭제
      </button>

      <div className="flex h-full flex-col gap-6 overflow-y-auto">
        {notifications?.map(item => {
          return (
            <button
              onClick={() => setNotificationAsRead(item.id)}
              key={item.id}
              className={`border-lightGrey block w-full rounded-lg border border-solid p-4 text-sm text-darkGray-active ${item.isRead && 'bg-mainGray'} cursor-pointer`}
            >
              <CardContent notification={item} />
            </button>
          );
        })}
      </div>
    </>
  );
}
