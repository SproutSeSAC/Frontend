import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const { id, isParticipant, targetMemberCount, currentMemberCount } = post;
  const { title, appointmentTime, storeName, meetingPlace } = post;
  const { ownerProfileImageUrl } = post;

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

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipStyle({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      });
    }
    setIsHovered(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsHovered(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  type ButtonStateText = '모집완료' | '참여중' | '자세히';

  const buttonStyleByState: Record<ButtonStateText, string> = {
    모집완료: 'bg-lightGray-active text-darkGray-active', // 모집 완료 시 색상
    참여중: 'bg-lightGreen-hover text-darkGray-active', // 참여 중 시 색상
    자세히: 'bg-lightGreen text-darkGray-active', // 기본 상태
  };

  const buttonStyle = buttonStyleByState[buttonState.text as ButtonStateText];

  return (
    <div
      ref={cardRef}
      className="relative z-10 flex h-[74px] w-[346px] items-center justify-between rounded-xl border border-[#f2f2f7] bg-white px-5 py-[15px] shadow-[2px_4px_12px_0px_rgba(0,0,0,0.0)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2.5">
        <UserImage
          className="h-10 w-10"
          imageNameSegment={ownerProfileImageUrl}
        />
        <div className="flex flex-col items-start justify-start">
          <div className="max-w-[137px] overflow-x-auto whitespace-nowrap text-base font-normal text-[#2b2b2b] scrollbar-hide">
            {title}
          </div>
          <div className="text-sm font-normal tracking-tight text-[#6d6d6d]">
            {currentMemberCount}/{targetMemberCount}명
          </div>
        </div>
      </div>
      <button
        className={`inline-flex h-[35px] w-[92px] cursor-pointer flex-col items-center justify-center rounded-lg ${buttonStyle}`}
        onClick={handleShowDialog}
      >
        <div className="text-sm font-medium">{buttonState.text}</div>
      </button>
      {isHovered && (
        <div
          className="fixed z-20 w-[346px] rounded-2xl border border-[#f2f2f7] bg-white px-4 py-6 shadow-md"
          style={tooltipStyle}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-gray1">일정 | </span>
                <span>
                  {formatDate(appointmentTime, 'yyyy.MM.dd a h시 mm분')}
                </span>
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
        </div>
      )}
    </div>
  );
}
