import { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

// import useObserver from '@/hooks/useObserver';
import { useCollapsibleSideView } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { BsMap } from 'react-icons/bs';
import { FaChevronLeft } from 'react-icons/fa';

import Title from '@/components/common/Title';
import SearchInput from '@/components/common/input/SearchInput';
import MealRecruitSideView from '@/components/meal-recruit/MealRecruitSideView';
import StoreCard from '@/components/store/StoreCard';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import StoreModal from '@/components/store/StoreModal';

export default function Store() {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const observeRef = useRef(null);

  // TODO : 무한스크롤 구현부
  // const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
  //   useGetInfiniteStoreCardList({});

  // const onIntersect = useCallback(
  //   (entry: IntersectionObserverEntry) => {
  //     if (entry.isIntersecting) {
  //       if (hasNextPage) fetchNextPage();
  //     }
  //   },
  //   [fetchNextPage, hasNextPage],
  // );

  // useObserver({ onIntersect, target: observeRef, threshold: 0.1 });

  const onOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <MainView>
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <SearchInput
            name="search"
            placeholder="검색어를 입력해 주세요"
            width="w-[422px]"
            height="h-[40px]"
            onChange={() => {}}
          />
        </Header>

        <section className="flex gap-8">
          <StoreFilterForm />

          <div className="flex-auto">
            <div className="mb-6 flex justify-between">
              <Title title="맛집 리스트" />
              <button
                type="button"
                className="flex size-[30px] items-center justify-center rounded-full bg-white"
                aria-label="식당 상세보기로 이동"
                // TODO: 후에 라우팅 수정
                onClick={() => navigate('/stores/1')}
              >
                <BsMap className="text-gray2" />
              </button>
            </div>

            <div className="flex flex-wrap justify-around gap-9 text-base">
              {Array.from({ length: 12 }, (_, idx) => (
                <button onClick={onOpenModal} key={idx} type="button">
                  <StoreCard width="w-[290px]" height="h-[290px]" />
                </button>
              ))}
              <div ref={observeRef} />
            </div>
          </div>
        </section>
      </MainView>

      {isModalOpen && (
        <div className="bg-red absolute left-[65%] top-1/2 z-20 h-full w-full -translate-x-[45%] -translate-y-1/2 transform">
          <StoreModal onClose={() => setIsModalOpen(false)} />
        </div>
      )}

      <MealRecruitSideView
        sideViewOpen={sideViewOpen}
        onClose={closeSideView}
      />

      {!sideViewOpen && (
        <button
          type="button"
          aria-label="사이드뷰 펼치기"
          className="fixed right-0 mt-24 flex size-10 items-center justify-center rounded-lg bg-white text-gray2"
          onClick={openSideView}
        >
          <FaChevronLeft />
        </button>
      )}
    </>
  );
}
