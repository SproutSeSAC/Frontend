import { useCallback } from 'react';

import { useDialogContext } from '@/hooks';
import { MealPosts } from '@/types/store/storeMealPostDto';
import { formatDate } from '@/utils';

import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import UserImage from '@/components/user/UserImage';

export default function MealRecruitCard({
  slideItem,
}: {
  slideItem: MealPosts;
}) {
  const { showDialog } = useDialogContext();

  const getButtonState = useCallback(() => {
    if (slideItem.targetMemberCount === slideItem.currentMemberCount) {
      return { text: '모집완료', style: 'bg-vividGreen3' };
    }
    if (slideItem.isParticipant) {
      return { text: '참여중', style: 'bg-gray2' };
    }
    return { text: '자세히', style: 'bg-vividGreen1' };
  }, [slideItem]);

  const isDisabled = false;

  return (
    <div className="h-full w-full text-start">
      <div
        className={`rounded-lg px-5 py-4 shadow-card ${isDisabled ? 'bg-gray4' : 'bg-white'}`}
      >
        <header className={`mb-4 font-semibold ${isDisabled && 'text-gray1'}`}>
          {slideItem.title}
        </header>

        <div className="mb-8 flex flex-col gap-2 text-sm">
          <p>
            <span className={`${isDisabled ? 'text-gray2' : 'text-gray1'}`}>
              일정
            </span>
            <span className={`${isDisabled ? 'text-gray2' : 'text-gray1'}`}>
              {' '}
              |{' '}
            </span>
            <span className={`${isDisabled && 'text-gray1'}`}>
              {slideItem
                ? `${formatDate(slideItem.appointmentTime, 'yyyy.MM.dd a h시')}`
                : '-'}
            </span>
          </p>
          <p>
            <span className={`${isDisabled ? 'text-gray2' : 'text-gray1'}`}>
              식당
            </span>
            <span className={`${isDisabled ? 'text-gray2' : 'text-gray1'}`}>
              {' '}
              |{' '}
            </span>
            <span className={`${isDisabled && 'text-gray1'}`}>
              {slideItem.storeName}
            </span>
          </p>
          <p>
            <span className={`${isDisabled ? 'text-gray2' : 'text-gray1'}`}>
              위치
            </span>
            <span className={`${isDisabled ? 'text-gray2' : 'text-gray1'}`}>
              {' '}
              |{' '}
            </span>
            <span className={`${isDisabled && 'text-gray1'}`}>
              {slideItem.meetingPlace}
            </span>
          </p>
        </div>

        <footer className="flex items-center justify-between">
          <UserImage
            className="size-10"
            imageNameSegment={slideItem.ownerProfileImageUrl}
          />
          <div className="ml-2.5 flex-1">
            <p className={`${isDisabled && 'text-gray1'}`}>
              {slideItem.ownerNickname}
            </p>
            <p
              className={`text-sm ${isDisabled ? 'text-gray2' : 'text-gray1'}`}
            >
              {slideItem.currentMemberCount}/{slideItem.targetMemberCount}명
            </p>
          </div>
          <button
            className={`rounded-3xl px-5 py-2 text-sm text-white ${getButtonState().style}`}
            type="button"
            disabled={isDisabled}
            onClick={async () => {
              await showDialog({
                key: 'MEAL-RECRUIT-CARD-TYPE',
                element: (
                  <MealRecruitCardModal
                    id={slideItem.id}
                    isParticipant={slideItem.isParticipant}
                  />
                ),
              });
            }}
          >
            {getButtonState().text}
          </button>
        </footer>
      </div>
    </div>
  );
}
