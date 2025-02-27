import { MouseEvent } from 'react';

import { Link } from 'react-router-dom';

import { useNotification } from '@/hooks/notification/useNotification';

import { formatElapsedTime } from '@/utils/formatElapsedTime';

import { NOTIFICATION_TYPE } from '@/constants/notification';
import { Notification } from '@/types';
import { BsX } from 'react-icons/bs';
import { RiCheckFill } from 'react-icons/ri';

interface CardContentProps {
  notification: Notification;
}

/**
 * TODO
 * 1. type에 따른 알림 카테고리, 라벨 색상 구분
 * 2. 링크로 이동하기
 * 3. SSE 연결
 */

export default function CardContent({ notification }: CardContentProps) {
  const { id, content, isRead, createdAt, type, url } = notification;
  const { deleteNotification, setNotificationAsRead } = useNotification();
  const { alertType, buttonText } = NOTIFICATION_TYPE[type];

  const handleDeleteNotification = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteNotification(notification.id);
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
        <p className="line-clamp-2 w-full overflow-hidden text-ellipsis text-start text-[#2b2b2b]">
          {content}
        </p>
      </div>

      {buttonText && (
        <Link
          to={`/post/${url}`}
          className="mt-[20px] flex items-center justify-self-end rounded-lg bg-mainGray-active px-[10px] py-2 text-white"
        >
          {buttonText}
        </Link>
      )}
    </>
  );
}
