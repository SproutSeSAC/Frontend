import { useCallback, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import useGetStoreList from '@/hooks/useGetStoreList';
import useObserver from '@/hooks/useObserver';

import { useCollapsibleSideView, useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { BsMap } from 'react-icons/bs';
import { FaChevronLeft } from 'react-icons/fa';

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
          <StoreModal onClose={() => hideDialog()} storeId={storeId} />
        </div>
      ),
    });
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

            <div className="grid gap-9 text-base xl:grid-cols-2 2xl:grid-cols-3">
              {(storeList || []).map(storeData => {
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
              {isLoading && <LoopLoading />}
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
