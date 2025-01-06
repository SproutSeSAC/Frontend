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

  // TODO - 공통 유틸함수로 분리 (서버에서 받은 UTC 시간 문자열을 로컬 시간으로 변환하는 로직)
  // UTC 시간 문자열
  const utcTimeString = slideItem.appointmentTime;

  // UTC 시간을 구성하는 연, 월, 일, 시, 분, 초 값을 분리
  const [year, month, day, hour, minute, second] = utcTimeString
    .split(/[-T:]/)
    .map(Number);

  // Date.UTC를 사용하여 UTC 시간을 밀리초(Timestamp)로 변환
  const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second);

  // 변환된 Timestamp 값으로 Date 객체 생성 (로컬 시간으로 변환됨)
  const localDate = new Date(utcTimestamp);

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
                ? `${formatDate(localDate, 'yyyy.MM.dd a h시 mm분')}`
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
            // imgUrl={slideItem.ownerProfileImageUrl} // TODO: img url 수정되면 노출
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
