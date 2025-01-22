import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useUpdateNotificationStatus } from '@/services/notification/notificationMutations';

// import { useGetNotifications } from '@/services/notification/notificationQueries';
import { notificationsData } from './notifications';

import CardContent from '@/components/notification/CardContent';

export default function NotificationContent() {
  const navigate = useNavigate();
  const [data, setData] = useState(notificationsData); // mock data

  // const { data: notifications } = useGetNotifications();
  const { mutateAsync: updateNotificationStatus } = useUpdateNotificationStatus(
    {
      onSuccess: () => {
        navigate('/lounge/post/39'); // TODO 알림에 맞는 게시물로 이동
      },
    },
  );

  const setNotificationAsRead = (id: number) => () => {
    // mock data로 작업
    const updatedData = data.map(item =>
      item.id === id ? { ...item, isRead: true } : item,
    );
    setData(updatedData);

    updateNotificationStatus(id);
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      {data?.map(item => {
        return (
          <button
            onClick={setNotificationAsRead(item.id)}
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
