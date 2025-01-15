import { useMemo, useRef } from 'react';

import { useGetInfiniteMealPostList } from '@/services/store/storeQueries';

import { useDialogContext, useObserver } from '@/hooks';
import { BsPlus } from 'react-icons/bs';

import MealRecruitCard from '@/components/store/meal-recruit/MealRecruitCard';
import MealRecruitModal from '@/components/store/meal-recruit/MealRecruitModal';

interface MealRecruitSliderProps {
  sideViewOpen: boolean;
}

// TODO 변수명, 컴포넌트 이름 등 확인
export default function MealRecruitSlider({
  sideViewOpen,
}: MealRecruitSliderProps) {
  const { showDialog } = useDialogContext();
  const mealPostObserveRef = useRef(null);

  // TODO 로딩시 UI
  const { data, fetchNextPage, hasNextPage } = useGetInfiniteMealPostList();

  const mealPosts = useMemo(() => {
    return data ? data.pages.flatMap(({ mealPostList }) => mealPostList) : [];
  }, [data]);

  // console.log('mealPosts: ', mealPosts);

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({
    runFucAtIntersect,
    target: mealPostObserveRef,
    threshold: 0.1,
  });

  return (
    <section className="flex min-h-dvh flex-col gap-7">
      {sideViewOpen && (
        <button
          className={`mb-7 flex w-full min-w-56 flex-col items-center rounded-lg bg-gray5 px-5 shadow-card ${mealPosts.length > 0 ? 'h-[105px] py-6' : 'h-full py-8'}`}
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
            className={`text-base font-semibold ${mealPosts.length > 0 ? 'mt-2' : 'mb-2 mt-4'}`}
          >
            한끼팟 만들기
          </p>
          {mealPosts.length === 0 && (
            <p className="text-xs">
              다른 사람들의 이야기가 궁금한가요?
              <br />
              함께 식사할 사람을 찾아봐요!
            </p>
          )}
        </button>
      )}
      <div className="flex grow flex-col gap-8 overflow-scroll">
        {mealPosts.map(post => (
          <MealRecruitCard key={post.id} slideItem={post} />
        ))}
        <div ref={mealPostObserveRef} />
      </div>
    </section>
  );
}
