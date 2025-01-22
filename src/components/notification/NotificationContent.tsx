import { useNotification } from '@/hooks/notification/useNotification';

import { useGetNotifications } from '@/services/notification/notificationQueries';

import { FaRegTrashAlt } from 'react-icons/fa';

import CardContent from '@/components/notification/CardContent';

export default function NotificationContent() {
  const { data: notifications } = useGetNotifications();
  const { data, setNotificationAsRead, deleteAllNotification } =
    useNotification();

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      <button
        onClick={() => deleteAllNotification()}
        className="flex items-center justify-end gap-1 text-end text-base text-[#6D6D6D]"
      >
        <FaRegTrashAlt />
        모두 삭제
      </button>

      {notifications && notifications.length !== 0
        ? notifications.map(item => {
            return (
              <button
                onClick={() => setNotificationAsRead(item.id)}
                key={item.id}
                className={`border-lightGrey block w-full rounded-lg border border-solid p-4 text-sm text-darkGray-active ${item.isRead && 'bg-mainGray'} cursor-pointer`}
              >
                <CardContent notification={item} />
              </button>
            );
          })
        : data?.map(item => {
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
  );
}
