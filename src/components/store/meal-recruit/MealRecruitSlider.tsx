import { useCallback, useRef } from 'react';

import useGetMealPostList from '@/hooks/useGetMealPostList';
import useObserver from '@/hooks/useObserver';

import MealRecruitCard from './MealRecruitCard';
import MealRecruitModal from './MealRecruitModal';

import { useDialogContext } from '@/hooks';
import { Content } from '@/types/store/storeMealPostDto';
import { BsPlus } from 'react-icons/bs';

import VerticalSlider from '@/components/common/slider/VerticalSlider';

interface MealRecruitSliderProps {
  sideViewOpen: boolean;
}

export default function MealRecruitSlider({
  sideViewOpen,
}: MealRecruitSliderProps) {
  const { showDialog } = useDialogContext();
  const mealPostObserveRef = useRef(null);

  const { mealPostList, fetchNextPage, hasNextPage, isLoading } =
    useGetMealPostList();

  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        if (hasNextPage) fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );
  useObserver({ onIntersect, target: mealPostObserveRef, threshold: 0.1 });

  return (
    <>
      {sideViewOpen && (
        <button
          className={`mb-7 flex w-full min-w-56 flex-col items-center rounded-lg bg-gray5 px-5 shadow-card ${mealPostList.length > 0 ? 'h-[105px] py-6' : 'h-full py-8'}`}
          onClick={async () => {
            await showDialog({
              key: 'MEAL-RECRUIT-TYPE',
              element: <MealRecruitModal />,
            });
          }}
        >
          <div className="w-fit rounded-full bg-vividGreen1 text-white">
            <BsPlus size={30} />
          </div>

          <p
            className={`text-base font-semibold ${mealPostList.length > 0 ? 'mt-2' : 'mb-2 mt-4'}`}
          >
            한끼팟 만들기
          </p>
          {mealPostList.length === 0 && (
            <p className="text-xs">
              다른 사람들의 이야기가 궁금한가요?
              <br />
              함께 식사할 사람을 찾아봐요!
            </p>
          )}
        </button>
      )}
      <div className="mb-10">
        <VerticalSlider
          slideList={mealPostList}
          spaceBetween={24}
          slideItemHeight={224}
          isLoading={isLoading}
          ref={mealPostObserveRef}
          containerHeightOffset={360}
          paginationHeightOffset={380}
          hideNextButton={!sideViewOpen}
        >
          {item => <MealRecruitCard slideItem={item as Content} />}
        </VerticalSlider>
      </div>
    </>
  );
}
