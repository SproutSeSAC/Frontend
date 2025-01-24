import { useMemo, useRef } from 'react';

import { useGetInfiniteMealPostList } from '@/services/store/storeQueries';

import { useDialogContext, useObserver } from '@/hooks';
import { BsPlus } from 'react-icons/bs';

import LoopLoading from '@/components/common/LoopLoading';
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

  const getButtonPositionClass = () => {
    if (mealPosts.length === 0) {
      return 'absolute left-[300px] z-20 items-center';
    } else if (mealPosts.length >= 3) {
      return 'absolute right-[60px] z-20 mt-5';
    } else {
      return 'absolute ml-10 z-20';
    }
  };
  
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
  <section className="relative z-0 flex w-full cursor-default flex-col gap-5">
    <div className="relative w-full z-10">
      <div className={getButtonPositionClass()}
        style={
          mealPosts.length > 0 && mealPosts.length < 3
            ? { left: `${mealPosts.length * 350}px`, top: '20px' }
            : {}
        }
      >
        <button
          className="flex flex-col h-[74px] items-center justify-center gap-4"
          onClick={handleShowDialog}
        >
          <div className="h-[30px] w-fit rounded-full bg-mainGray-active text-white">
            <BsPlus size={30} />
          </div>
        </button>
      </div>
    </div>
    <div className="relative flex max-w-[1050px] items-center min-h-[74px] gap-5 overflow-x-auto overflow-y-auto scrollbar-hide z-0">
    {mealPosts.length === 0 && (
      <div className='relative z-10 flex flex-col max-w-[360px] min-h-[74px] items-start rounded-xl border border-[#f2f2f7] bg-white px-6 py-4'>
        <div className="max-w-[137px] overflow-x-auto whitespace-nowrap text-base font-normal text-[#2b2b2b] scrollbar-hide">한끼팟 만들기</div>
        <div className="text-sm font-normal tracking-tight text-[#6d6d6d]">
          함께 식사할 사람을 찾아봐요!
        </div>
      </div>
    )}
      {mealPosts.map((post) => (
        <div
          key={post.id}
          className="relative max-w-[331px] w-[331px] flex-shrink-0 pr-5"
        >
          <MealRecruitCard post={post} />
        </div>
      ))}
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
