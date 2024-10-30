import { useCallback, useRef } from 'react';

import useGetStoreList from '@/hooks/useGetStoreList';
import useObserver from '@/hooks/useObserver';

import { useCollapsibleSideView } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { FaChevronLeft } from 'react-icons/fa';

import SearchInput from '@/components/common/input/SearchInput';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import StoreListSideView from '@/components/store/detail/StoreListSideView';
import StoreMap from '@/components/store/detail/StoreMap';

export default function StoreDetail() {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();

  const observeRef = useRef(null);

  const { storeList, fetchNextPage, hasNextPage, isLoading } =
    useGetStoreList(); // TODO: 무한스크롤 테스트 후 hook 삭제하고 컴포넌트 내에서만 처리가능하도록 수정예정

  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        if (hasNextPage) fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );

  useObserver({ onIntersect, target: observeRef, threshold: 0.1 });

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

        <section className="flex h-full w-full gap-8">
          <StoreFilterForm />

          <StoreMap storeList={storeList} />
        </section>
      </MainView>

      <StoreListSideView
        sideViewOpen={sideViewOpen}
        onClose={closeSideView}
        storeList={storeList}
        isLoading={isLoading}
        ref={observeRef}
      />

      {!sideViewOpen && (
        <button
          type="button"
          aria-label="사이드뷰 펼치기"
          className="mt-12 flex size-10 items-center justify-center rounded-lg bg-white text-gray2"
          onClick={openSideView}
        >
          <FaChevronLeft />
        </button>
      )}
    </>
  );
}
