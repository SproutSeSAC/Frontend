import { useMemo } from 'react';

import { useDialogContext } from '@/hooks';
import { MealPosts } from '@/types/store/storeMealPostDto';
import { formatDate } from '@/utils';

import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import UserImage from '@/components/user/UserImage';

interface MealRecruitCardProps {
  post: MealPosts;
}

const getButtonStyle = (
  target: number,
  current: number,
  isParticipant: boolean,
) => {
  if (target === current) {
    return { text: '모집완료', style: 'bg-vividGreen3' };
  }
  if (isParticipant) {
    return { text: '참여중', style: 'bg-gray2' };
  }
  return { text: '자세히', style: 'bg-vividGreen1' };
};

export default function MealRecruitCard({ post }: MealRecruitCardProps) {
  const { id, isParticipant, targetMemberCount, currentMemberCount } = post;
  const { title, appointmentTime, storeName, meetingPlace } = post;
  const { ownerProfileImageUrl, ownerNickname } = post;

  const { showDialog } = useDialogContext();

  const buttonState = useMemo(
    () => getButtonStyle(targetMemberCount, currentMemberCount, isParticipant),
    [targetMemberCount, currentMemberCount, isParticipant],
  );

  const handleShowDialog = async () => {
    await showDialog({
      key: 'MEAL-RECRUIT-CARD-TYPE',
      element: <MealRecruitCardModal id={id} isParticipant={isParticipant} />,
    });
  };

  return (
    <article className="flex flex-col justify-between gap-8 rounded-lg bg-white px-5 py-[15px] shadow-card">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">{title}</h3>

        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2">
            <span className="text-gray1">일정 | </span>
            <span>{formatDate(appointmentTime, 'yyyy.MM.dd a h시 mm분')}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-gray1">식당 | </span>
            <span>{storeName}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-gray1">위치 | </span>
            <span>{meetingPlace}</span>
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-[10px]">
          <UserImage
            className="h-10 w-10"
            imageNameSegment={ownerProfileImageUrl}
          />
          <div className="flex grow flex-col">
            <span className="whitespace-nowrap">{ownerNickname}</span>
            <span className="text-sm text-gray1">
              {currentMemberCount}/{targetMemberCount}명
            </span>
          </div>
        </div>

        <button
          className={`rounded-3xl px-5 py-2 text-sm text-white ${buttonState.style}`}
          type="button"
          onClick={handleShowDialog}
        >
          {buttonState.text}
        </button>
      </footer>
    </article>
  );
}
