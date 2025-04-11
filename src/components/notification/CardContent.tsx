import { MouseEvent } from 'react';

import { Link } from 'react-router-dom';

import { NOTIFICATION_ROUTE, NOTIFICATION_TYPE } from '@/constants';
import { useNotification } from '@/hooks';
import { Notification } from '@/types';
import { formatElapsedTime } from '@/utils';
import { BsX } from 'react-icons/bs';
import { RiCheckFill } from 'react-icons/ri';

interface CardContentProps {
  notification: Notification;
}

export default function CardContent({ notification }: CardContentProps) {
  const { id, content, isRead, createdAt, type, url, comment } = notification;
  const { deleteNotification, setNotificationAsRead } = useNotification();
  const { alertType, alertMessage, buttonText } = NOTIFICATION_TYPE[type];

  const handleDeleteNotification = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const getNotificationUrl = (notiType: number, urlId: string) => {
    const routeUrl = NOTIFICATION_ROUTE[notiType];
    return routeUrl?.replace('{id}', urlId);
  };

  return (
    <>
      <div className="flex flex-col gap-[14px]">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <span className="text-sm text-darkGray-active">{alertType}</span>
            <span className="text-sm font-normal text-darkGray">
              {formatElapsedTime(createdAt)}
            </span>
          </h3>
          {isRead ? (
            <button onClick={handleDeleteNotification}>
              <BsX className="size-6 text-darkGray-hover" />
            </button>
          ) : (
            <button onClick={() => setNotificationAsRead(id)}>
              <RiCheckFill className="size-6 p-0.5 text-darkGray-hover" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-[10px]">
          <p className="line-clamp-2 w-full overflow-hidden text-ellipsis text-start text-[#2b2b2b]">
            {`${content + alertMessage}`}
          </p>
          {comment && (
            <p className="line-clamp-2 w-full overflow-hidden text-ellipsis text-start text-sm text-darkGray">
              💬 {comment}
            </p>
          )}
        </div>
      </div>

      {buttonText && (
        <Link
          to={getNotificationUrl(type, url)}
          className="mt-[20px] flex items-center justify-self-end rounded-lg bg-mainGray-active px-[10px] py-2 text-[15px] text-white"
        >
          {buttonText}
        </Link>
      )}
    </>
  );
}
