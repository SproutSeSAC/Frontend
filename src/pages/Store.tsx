import { useCallback, useRef, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import useGetStoreList from '@/hooks/useGetStoreList';
import useObserver from '@/hooks/useObserver';

import { useCollapsibleSideView, useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { updateQueryParams } from '@/utils';
import { BsMap } from 'react-icons/bs';
import { FaChevronLeft } from 'react-icons/fa';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import Title from '@/components/common/Title';
import SearchInput from '@/components/common/input/SearchInput';
import StoreCard from '@/components/store/StoreCard';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import MealRecruitSideView from '@/components/store/meal-recruit/MealRecruitSideView';
import StoreModal from '@/components/store/modal/StoreModal';

export default function Store() {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();
  const navigate = useNavigate();
  const { showDialog, hideDialog } = useDialogContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');

  const observeRef = useRef(null);

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

  useObserver({ onIntersect, target: observeRef, threshold: 0.1 });

  const onOpenModal = async (storeId: number) => {
    await showDialog({
      key: 'STORE_MODAL',
      element: (
        <div className="bg-red fixed left-1/4 top-1/2 z-10 h-full -translate-x-[45%] -translate-y-1/2 transform bg-red-300">
          <StoreModal onClose={hideDialog} storeId={storeId} />
        </div>
      ),
    });
  };

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

        <section className="flex gap-8">
          <StoreFilterForm
            onReset={() => {
              setSearchKeyword('');
            }}
          />

          <div className="relative flex-auto">
            <div className="mb-6 flex justify-between">
              <Title title="맛집 리스트" />
              <button
                type="button"
                className="flex size-[30px] items-center justify-center rounded-full bg-white"
                aria-label="식당 상세보기로 이동"
                onClick={() => navigate('/stores/detail-location')}
              >
                <BsMap className="text-gray2" />
              </button>
            </div>

            <div className="grid gap-9 text-base xl:grid-cols-2 2xl:grid-cols-3">
              {storeList &&
                storeList.length > 0 &&
                storeList.map(storeData => {
                  return (
                    <div
                      className="aspect-square"
                      onClick={() => onOpenModal(storeData.id)}
                      key={storeData.id}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          onOpenModal(storeData.id);
                        }
                      }}
                    >
                      <StoreCard
                        width="w-full"
                        height="h-full"
                        storeData={storeData}
                      />
                    </div>
                  );
                })}
              <div ref={observeRef} />

              {storeList.length === 0 && !isLoading && (
                <EmptyContent
                  message="맛집 데이터가 없습니다."
                  className="absolute left-1/2 top-1/2 mt-4 -translate-x-1/2 -translate-y-1/2 transform"
                />
              )}
              {isLoading && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <LoopLoading />
                </div>
              )}
            </div>
          </div>
        </section>
      </MainView>

      <MealRecruitSideView
        sideViewOpen={sideViewOpen}
        onClose={closeSideView}
      />

      {!sideViewOpen && (
        <button
          type="button"
          aria-label="사이드뷰 펼치기"
          className="fixed right-0 mt-12 flex size-10 items-center justify-center rounded-lg bg-white text-gray2"
          onClick={openSideView}
        >
          <FaChevronLeft />
        </button>
      )}
    </>
  );
}
