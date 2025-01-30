import { useRef, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useDialogContext, useGetStoreList, useObserver } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { updateQueryParams } from '@/utils';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import SearchInput from '@/components/common/input/SearchInput';
import StoreCard from '@/components/store/StoreCard';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import MealRecruitList from '@/components/store/meal-recruit/MealRecruitList';
import StoreModal from '@/components/store/modal/StoreModal';

export default function Store() {
  const navigate = useNavigate();
  const { showDialog, hideDialog } = useDialogContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');

  const observeRef = useRef(null);

  const { storeList, fetchNextPage, hasNextPage, isLoading } =
    useGetStoreList();

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({
    runFucAtIntersect,
    target: observeRef,
    threshold: 0.1,
  });

  const onOpenModal = async (storeId: number) => {
    await showDialog({
      key: 'STORE_MODAL',
      element: (
        <div className="fixed left-1/4 top-1/2 z-10 h-full -translate-x-[45%] -translate-y-1/2 transform">
          <StoreModal onClose={hideDialog} storeId={storeId} />
        </div>
      ),
    });
  };

  return (
    <div className="h-[1024px] w-[1440px] overflow-x-hidden scrollbar-hide">
      <MainView>
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <div className="flex items-center gap-[30px]">
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
              onChange={e => setSearchKeyword(e.target.value)}
            />
          </div>
        </Header>
        <MealRecruitList />
        <div className="flex h-[727px] w-[1223px] rounded-[20px] bg-white p-5">
          <aside className="h-full w-[260px] flex-shrink-0">
            <StoreFilterForm onReset={() => setSearchKeyword('')} />
          </aside>
          <div className="relative">
            <div className="h-full flex-1 overflow-y-auto overflow-x-hidden px-8 scrollbar-hide">
              <div className="mb-[24px] mt-2 inline-flex h-6 w-[845px] items-center justify-between">
                <div className="text-xl font-semibold text-[#2a2a2a]">
                  맛집 리스트
                </div>
                <button
                  onClick={() => navigate('/stores/detail-location')}
                  className="text-sm font-normal text-[#828282]"
                >
                  지도 보기
                </button>
              </div>
              <div className="grid gap-9 text-base xl:grid-cols-3 2xl:grid-cols-3">
                {storeList &&
                  storeList.length > 0 &&
                  storeList.map(storeData => (
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
                  ))}

                <div ref={observeRef} />
                <div className="w-[1440px] pt-32">
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
            </div>
          </div>
        </div>
      </MainView>
    </div>
  );
}
