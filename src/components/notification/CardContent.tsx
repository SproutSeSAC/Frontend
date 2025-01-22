import { Notification } from '@/types/notification';
import { BsX } from 'react-icons/bs';

import UserImage from '@/components/user/UserImage';

interface CardContentProps {
  notification: Notification;
}

export default function CardContent({ notification }: CardContentProps) {
  const { content, isRead } = notification;

  return (
    <>
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* TODO type에 따른 알림 타이틀 구분 */}
          <div className="bg-darkGree h-3.5 w-3.5 rounded-full" />
          <div className="text-sm text-darkGray-active">공지사항</div>
        </div>
        <button
          onClick={() => {
            // TODO: 삭제로직 추가예정
          }}
        >
          <BsX
            className={`size-5 ${isRead ? 'text-mainGray' : 'text-lightGrey'}`}
          />
        </button>
      </div>
      <div className="mb-6 line-clamp-2 w-full overflow-hidden text-ellipsis">
        {content}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <UserImage className="size-6" imageNameSegment="" />
          <div className="text-black">박민석 매니저</div>
        </div>

        <div className="text-xs text-mainGray">
          {/* TODO 알림 발송 시간 추가 */}
        </div>
      </div>
    </>
  );
}
