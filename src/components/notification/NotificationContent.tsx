import { Link } from 'react-router-dom';

import { useGetNotifications } from '@/services/notification/notificationQueries';

import CardContent from '@/components/notification/CardContent';

export default function NotificationContent() {
  const { data: notifications } = useGetNotifications();

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      {notifications?.map(item => {
        return (
          <div key={item.id} className="w-full">
            <Link
              // TODO 알림에 맞는 게시물로 이동
              to="/lounge/post/1"
              className={`border-lightGrey block rounded-lg border border-solid p-4 text-sm text-darkGray-active ${item.isRead && 'bg-mainGray'}`}
            >
              <CardContent notification={item} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
