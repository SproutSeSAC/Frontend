import { Fragment, useRef } from 'react';

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, //
  } = useGetInfiniteMealPostList();

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
    <section className="relative z-10 mb-5 w-full">
      <div className="relative w-fit max-w-[calc(100vw-192px)] pr-14">
        {data?.pages.length === 0 ? (
          <div className="relative flex min-h-[74px] w-[360px] flex-col items-start rounded-xl border border-lightGray-active bg-white px-6 py-4">
            <span className="w-[240px] max-w-[240px] overflow-x-auto whitespace-nowrap text-base font-normal text-black scrollbar-hide">
              한끼팟 만들기
            </span>
            <span className="text-sm font-normal tracking-tight text-darkGray-active">
              함께 식사할 사람을 찾아봐요!
            </span>
          </div>
        ) : (
          <ScrollContainer gap={0}>
            {data?.pages.map(page => (
              <Fragment key={page.currentPage}>
                {page.mealPostList.map(post => (
                  <li key={post.id} className="mr-5">
                    <MealRecruitCard post={post} />
                  </li>
                ))}

                {/* 옵저버 */}
                {hasNextPage && page.mealPostList.length % 5 === 0 && (
                  <div ref={mealPostObserveRef} />
                )}
              </Fragment>
            ))}
          </ScrollContainer>
        )}

        <button
          onClick={handleShowDialog}
          className="absolute right-0 top-6 z-40 h-[30px] w-fit rounded-full bg-mainGray-active text-white"
        >
          <BsPlus size={30} />
        </button>
      </div>

      {isFetchingNextPage && (
        <div className="m-auto">
          <LoopLoading size={40} />
        </div>
      )}
    </section>
  );
}
