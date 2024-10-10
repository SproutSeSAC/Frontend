import { useCallback } from 'react';

import MealRecruitCardModal from './MealRecruitCardModal';

import { useDialogContext } from '@/hooks';

export default function MealRecruitCard({ slideItem }: { slideItem: number }) {
  const { showDialog } = useDialogContext();

  const getButtonState = useCallback(() => {
    if (slideItem === 2) return { text: '참여중', style: 'bg-gray2' };
    if (slideItem === 3) return { text: '모집완료', style: 'bg-vividGreen3' };
    return { text: '자세히', style: 'bg-vividGreen1' };
  }, [slideItem]);

  const isDisabled = slideItem === 3;

  return (
    <div className="h-full w-full text-start">
      <div
        className={`rounded-lg px-5 py-4 shadow-card ${isDisabled ? 'bg-gray4' : 'bg-white'}`}
      >
        <header className={`mb-4 font-semibold ${isDisabled && 'text-gray1'}`}>
          [성북 2기] 햄버거 드실 분 모집합니다!
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
              2024.07.06 오후 1시
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
            <span className={`${isDisabled && 'text-gray1'}`}>롯데리아</span>
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
              월곡역 1번 출구 앞
            </span>
          </p>
        </div>

        <footer className="flex items-center justify-between">
          <div className="size-10 rounded-full bg-gray3" />
          <div>
            <p className={`${isDisabled && 'text-gray1'}`}>모집자 닉네임</p>
            <p
              className={`text-sm ${isDisabled ? 'text-gray2' : 'text-gray1'}`}
            >
              2/4명
            </p>
          </div>
          <button
            className={`rounded-3xl px-5 py-2 text-sm text-white ${getButtonState().style}`}
            type="button"
            disabled={isDisabled}
            onClick={async () => {
              await showDialog({
                key: 'MEAL-RECRUIT-CARD-TYPE',
                element: <MealRecruitCardModal />,
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
