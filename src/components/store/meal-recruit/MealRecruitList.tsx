import { useMemo, useRef } from 'react';

import { useGetInfiniteMealPostList } from '@/services/store/storeQueries';

import { useDialogContext, useObserver } from '@/hooks';
import { BsPlus } from 'react-icons/bs';

import LoopLoading from '@/components/common/LoopLoading';
import MealRecruitCard from '@/components/store/meal-recruit/MealRecruitCard';
import MealRecruitModal from '@/components/store/meal-recruit/MealRecruitModal';

interface MealRecruitListProps {
  sideViewOpen: boolean;
}

export default function MealRecruitList({
  sideViewOpen,
}: MealRecruitListProps) {
  const { showDialog } = useDialogContext();
  const mealPostObserveRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteMealPostList();

  const mealPosts = useMemo(() => {
    return data ? data.pages.flatMap(({ mealPostList }) => mealPostList) : [];
  }, [data]);

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({
    runFucAtIntersect,
    target: mealPostObserveRef,
    threshold: 0.1,
  });

  return (
    <section className="flex h-full flex-col gap-7">
      {sideViewOpen && (
        <button
          className="flex w-72 flex-col items-center justify-center gap-4 rounded-lg bg-gray5 px-5 py-8 shadow-card"
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

          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-base font-semibold">한끼팟 만들기</h3>
            {mealPosts.length !== 0 && (
              <p className="text-xs text-gray1">
                다른 사람들의 이야기가 궁금한가요?
                <br />
                함께 식사할 사람을 찾아봐요!
              </p>
            )}
          </div>
        </button>
      )}
      <div className="flex max-h-[520px] flex-col gap-8 overflow-scroll">
        {mealPosts.map(post => (
          <MealRecruitCard key={post.id} post={post} />
        ))}
        {isFetchingNextPage && (
          <div className="m-auto">
            <LoopLoading size={40} />
          </div>
        )}
        <div ref={mealPostObserveRef} />
      </div>
    </section>
  );
}
