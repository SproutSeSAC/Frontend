import { useCallback, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useCollapsibleSideView, useGetStoreList, useObserver } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { updateQueryParams } from '@/utils';
import { FaChevronLeft } from 'react-icons/fa';

import SearchInput from '@/components/common/input/SearchInput';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import StoreListSideView from '@/components/store/detail/StoreListSideView';
import StoreMap from '@/components/store/detail/StoreMap';

export default function StoreDetail() {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();

  const observeRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');

  const { storeList, fetchNextPage, hasNextPage, isLoading } =
    useGetStoreList();

  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        if (hasNextPage) fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );

  useObserver({ onIntersect, target: observeRef, threshold: 0.5 });

  return (
    <>
      <MainView>
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <SearchInput
            name="keyword"
            placeholder="검색어를 입력해 주세요"
            width="w-[422px]"
            height="h-[45px]"
            onEnter={() => {
              updateQueryParams(
                searchParams,
                setSearchParams,
                'keyword',
                searchKeyword,
              );
            }}
            value={searchKeyword}
            onChange={e => {
              setSearchKeyword(e.target.value);
            }}
          />
        </Header>

        <section className="flex h-full w-full gap-8">
          <StoreFilterForm
            onReset={() => {
              setSearchKeyword('');
            }}
          />

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
