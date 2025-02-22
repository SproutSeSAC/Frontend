import { useEffect } from 'react';

import { useNotification } from '@/hooks/notification/useNotification';

import { useGetNotificationList } from '@/services/notification/notificationQueries';

import { notificationOpenAtom } from '@/atoms/notificationAtom';

import { useAtomValue } from 'jotai';
import { FaRegTrashAlt } from 'react-icons/fa';

import CardContent from '@/components/notification/CardContent';

export default function NotificationContent() {
  const isNotificationOpen = useAtomValue(notificationOpenAtom);
  const { data: notificationList, refetch } = useGetNotificationList();
  const { deleteAllNotification, setAllNotificationAsRead } = useNotification();

  useEffect(() => {
    if (isNotificationOpen) {
      refetch();
    }
  }, [isNotificationOpen, refetch]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between text-base text-darkGray-active">
        <button
          onClick={setAllNotificationAsRead}
          className="flex items-center justify-end gap-1 text-end font-normal"
          disabled={notificationList?.length === 0}
        >
          모두 읽음
        </button>
        <button
          onClick={deleteAllNotification}
          className="flex items-center justify-end gap-1 text-end font-medium"
          disabled={notificationList?.length === 0}
        >
          <FaRegTrashAlt />
          모두 삭제
        </button>
      </div>

      <div className="flex h-full flex-col gap-[22px] overflow-y-auto">
        {notificationList?.map(item => {
          return (
            <div
              key={item.id}
              className={`border-lightGrey block w-full rounded-lg border border-solid px-7 py-[22px] text-sm ${item.isRead && 'opacity-50'}`}
            >
              <CardContent notification={item} />
            </div>
          );
        })}
      </div>
    </>
  );
}
