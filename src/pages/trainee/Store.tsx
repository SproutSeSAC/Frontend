import { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  useDialogContext,
  useFilterData,
  useGetStoreList,
  useObserver,
} from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { Store as StoreType } from '@/types/store/storeDto';
import { updateQueryParams } from '@/utils';
import { BsMap } from 'react-icons/bs';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import SearchInput from '@/components/common/input/SearchInput';
import StoreCard from '@/components/store/StoreCard';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import StoreListSideView from '@/components/store/detail/StoreListSideView';
import StoreMap from '@/components/store/detail/StoreMap';
import MealRecruitList from '@/components/store/meal-recruit/MealRecruitList';
import StoreModal from '@/components/store/modal/StoreModal';

export default function Store() {
  const [isMap, setIsMap] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    currFilter,
    handleChangeKeyword,
    handleResetKeyword,
    debouncedFilter,
  } = useFilterData({ initialFilter: { keyword: '' } });

  const { showDialog, hideDialog } = useDialogContext();

  const {
    storeList,
    fetchNextPage,
    hasNextPage,
    isLoading,
    currCampus, //
  } = useGetStoreList();

  const observeRef = useRef(null);

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({ runFucAtIntersect, target: observeRef, threshold: 0.1 });

  const onOpenStoreModal = async (store: StoreType) => {
    await showDialog({
      key: 'STORE_MODAL',
      element: <StoreModal store={store} onClose={hideDialog} />,
    });
  };

  const toggleViewType = () => setIsMap(prev => !prev);

  const handleSearchParams = (keyword?: string) => {
    if (!keyword) {
      const params = new URLSearchParams(searchParams);
      params.delete('keyword');
      setSearchParams(params);
    } else {
      updateQueryParams(searchParams, setSearchParams, 'keyword', keyword);
    }
  };

  useEffect(() => {
    handleSearchParams(debouncedFilter.keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter.keyword]);

  if (!currCampus) return null;

  return (
    <>
      <MainView className="!pb-12">
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <SearchInput
            name="keyword"
            value={currFilter.keyword}
            placeholder="찾으시는 맛집을 검색해보세요"
            className="ml-32 max-w-[422px] flex-1"
            onChange={handleChangeKeyword}
            resetChange={handleResetKeyword}
          />
        </Header>

        <MealRecruitList />

        <section className="flex !h-[75vh] min-h-[700px] w-full gap-x-8 rounded-[20px] bg-white p-5">
          <StoreFilterForm
            currCampusId={currCampus.id}
            onReset={handleResetKeyword}
          />

          {!isMap && (
            <div className="relative flex size-full flex-col">
              <header className="mb-[24px] mt-2 inline-flex h-6 w-full items-center justify-between">
                <h3 className="text-xl font-semibold text-black">
                  맛집 리스트
                </h3>
                <button
                  onClick={toggleViewType}
                  className="flex size-10 items-center justify-center rounded-lg bg-lightGray-active p-2.5 shadow-xl"
                >
                  <BsMap size={18} />
                </button>
              </header>

              {!isLoading && storeList && (
                <>
                  {storeList.length > 0 && (
                    <div className="size-full overflow-y-scroll scrollbar-hide">
                      <ul className="grid grid-cols-3 gap-7 pb-12 text-base">
                        {storeList.map(storeData => (
                          <div
                            key={storeData.id}
                            className="aspect-square"
                            onClick={() => onOpenStoreModal(storeData)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                onOpenStoreModal(storeData);
                              }
                            }}
                          >
                            <StoreCard storeData={storeData} />
                          </div>
                        ))}
                      </ul>

                      <div ref={observeRef} />
                    </div>
                  )}

                  {storeList.length === 0 && (
                    <EmptyContent
                      message="맛집 데이터가 없습니다."
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                    />
                  )}
                </>
              )}

              {isLoading && (
                <div className="flex h-full flex-1 items-center justify-center">
                  <LoopLoading />
                </div>
              )}
            </div>
          )}

          {isMap && (
            <StoreMap
              currCampus={currCampus}
              storeList={storeList}
              toggleViewType={toggleViewType}
            />
          )}
        </section>
      </MainView>

      {isMap && (
        <StoreListSideView
          storeList={storeList}
          isLoading={isLoading}
          ref={observeRef}
        />
      )}
    </>
  );
}
