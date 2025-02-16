import { MouseEvent } from 'react';

import { useNotification } from '@/hooks/notification/useNotification';

import { Notification } from '@/types';
import { BsX } from 'react-icons/bs';
import { RiCheckFill } from 'react-icons/ri';

interface CardContentProps {
  notification: Notification;
}

/**
 * TODO
 * 1. 알림 발송 시간  ~시간 전
 * 2. type에 따른 알림 카테고리, 라벨 색상 구분
 * 3. [x] 확인 체크 표시
 * 4. [x] 확인 한 공지는 엑스 표시
 * 5. [x] info 문구
 * 6. 빨간 점
 * 7. 링크로 이동하기
 */

export default function CardContent({ notification }: CardContentProps) {
  const { id, content, isRead } = notification;
  const { deleteNotification, setNotificationAsRead } = useNotification();

  const handleDeleteNotification = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <div className="size-[14px] rounded-full border bg-mainGreen" />
          <span className="text-darkGray-active">공지사항</span>
          <span className="font-normal text-darkGray">2024. 10. 04</span>
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
      <p className="line-clamp-2 w-full overflow-hidden text-ellipsis text-start text-darkGray">
        {content}
      </p>
    </div>
  );
}
