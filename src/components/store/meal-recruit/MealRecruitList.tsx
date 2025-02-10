import { useMemo, useRef } from 'react';

import { useGetInfiniteMealPostList } from '@/services/store/storeQueries';

import { useDialogContext, useObserver } from '@/hooks';
import { BsPlus } from 'react-icons/bs';

import LoopLoading from '@/components/common/LoopLoading';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import MealRecruitCard from '@/components/store/meal-recruit/MealRecruitCard';
import MealRecruitModal from '@/components/store/meal-recruit/MealRecruitModal';

export default function MealRecruitList() {
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

  const handleShowDialog = async () => {
    await showDialog({
      key: 'MEAL-RECRUIT-CARD-TYPE',
      element: <MealRecruitModal />,
    });
  };

  return (
    <section className="relative z-10 flex cursor-default flex-col gap-5">
      <div className="relative max-w-[75vw]">
        {mealPosts.length > 2 && (
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-[74px] w-[215px] bg-gradient-to-r from-[#f5f5f700] to-bg" />
        )}
        <ScrollContainer gap={7}>
          {mealPosts.length === 0 && (
            <div className="relative flex min-h-[74px] max-w-[360px] flex-col items-start rounded-xl border border-lightGray-active bg-white px-6 py-4">
              <div className="w-[240px] max-w-[240px] overflow-x-auto whitespace-nowrap text-base font-normal text-black scrollbar-hide">
                한끼팟 만들기
              </div>
              <div className="text-sm font-normal tracking-tight text-darkGray-active">
                함께 식사할 사람을 찾아봐요!
              </div>
            </div>
          )}
          {mealPosts.map(post => (
            <div
              key={post.id}
              className="relative z-10 w-[331px] max-w-[331px] flex-shrink-0 pr-5"
            >
              <MealRecruitCard post={post} />
            </div>
          ))}
          <button
            className={`${
              mealPosts.length > 2
                ? 'absolute -right-20 top-1/2 -translate-y-1/2 transform'
                : 'relative ml-3'
            } z-10 flex h-[74px] flex-col items-center justify-center gap-4`}
            onClick={handleShowDialog}
          >
            <div className="h-[30px] w-fit rounded-full bg-mainGray-active text-white">
              <BsPlus size={30} />
            </div>
          </button>
        </ScrollContainer>
      </div>
      {isFetchingNextPage && (
        <div className="m-auto">
          <LoopLoading size={40} />
        </div>
      )}
      <div ref={mealPostObserveRef} />
    </section>
  );
}
