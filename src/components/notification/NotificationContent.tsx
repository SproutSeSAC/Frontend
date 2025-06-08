import { useEffect } from 'react';

import { useGetNotificationList } from '@/services/notification/notificationQueries';

import { notificationOpenAtom } from '@/atoms/notificationAtom';

import DoubleCheck from '@/assets/icons/double-check.svg?react';
import { NOTIFICATION_TYPE } from '@/constants';
import { useNotification } from '@/hooks';
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
          <DoubleCheck />
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
              className={`relative flex flex-col rounded-lg border border-mainGray bg-white pb-6 pl-[22px] pr-4 pt-8 ${
                item.isRead && 'opacity-50'
              }`}
            >
              <div
                className="absolute left-0 top-0 h-full w-[7px] rounded-l-lg"
                style={{
                  backgroundColor: NOTIFICATION_TYPE[item.type].borderColor,
                }}
              />
              <CardContent notification={item} />
            </div>
          );
        })}
      </div>
    </>
  );
}
