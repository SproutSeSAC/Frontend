import { useRef, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useCollapsibleSideView, useGetStoreList, useObserver } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { updateQueryParams } from '@/utils';

import Icon from '@/components/common/Icon';
import SearchInput from '@/components/common/input/SearchInput';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import StoreListSideView from '@/components/store/detail/StoreListSideView';
import StoreMap from '@/components/store/detail/StoreMap';

export default function StoreDetail() {
  const navigate = useNavigate();

  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();

  const observeRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');

  const { storeList, fetchNextPage, hasNextPage, isLoading } =
    useGetStoreList();

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({ runFucAtIntersect, target: observeRef, threshold: 0.5 });

  return (
    <>
      <MainView>
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <SearchInput
            name="keyword"
            placeholder="검색어를 입력해 주세요"
            className="w-[422px]"
            onEnter={() => {
              updateQueryParams(
                searchParams,
                setSearchParams,
                'keyword',
                searchKeyword,
              );
            }}
            value={searchKeyword}
            onChange={event => setSearchKeyword(event.target.value)}
            resetChange={() => {
              setSearchKeyword('');
              const params = new URLSearchParams(searchParams);
              params.delete('keyword');
              navigate(`/stores/detail-location`);
            }}
          />
        </Header>

        <section className="flex h-full w-full gap-0">
          <StoreFilterForm onReset={() => setSearchKeyword('')} />
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
          className="mt-12 flex size-10 items-center justify-center rounded-lg bg-white text-mainGray"
          onClick={openSideView}
        >
          <Icon name="ChevronLeft" />
        </button>
      )}
    </>
  );
}
