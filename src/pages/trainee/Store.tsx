import { useRef, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useDialogContext, useGetStoreList, useObserver } from '@/hooks';
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
  const navigate = useNavigate();

  const [isMap, setIsMap] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const { showDialog, hideDialog } = useDialogContext();

  const {
    storeList,
    fetchNextPage,
    hasNextPage,
    isLoading,
    currCampusId, //
  } = useGetStoreList();

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  const observeRef = useRef(null);

  useObserver({ runFucAtIntersect, target: observeRef, threshold: 0.1 });

  const onOpenModal = async (store: StoreType) => {
    await showDialog({
      key: 'STORE_MODAL',
      element: (
        <StoreModal postId={store.postId} onClose={hideDialog} store={store} />
      ),
    });
  };

  const toggleViewType = () => setIsMap(prev => !prev);

  return (
    <>
      <MainView className="!pb-12">
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <SearchInput
            name="keyword"
            placeholder="검색어를 입력해 주세요"
            className="ml-32 max-w-[422px] flex-1"
            onChange={e => setSearchKeyword(e.target.value)}
            onEnter={() => {
              updateQueryParams(
                searchParams,
                setSearchParams,
                'keyword',
                searchKeyword,
              );
            }}
            value={searchKeyword}
            resetChange={() => {
              setSearchKeyword('');
              const params = new URLSearchParams(searchParams);
              params.delete('keyword');
              navigate(`/stores`);
            }}
          />
        </Header>

        <MealRecruitList />

        <section className="flex !h-[75vh] min-h-[700px] w-full gap-x-8 rounded-[20px] bg-white p-5">
          <StoreFilterForm
            currCampusId={currCampusId}
            onReset={() => setSearchKeyword('')}
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
                            onClick={() => onOpenModal(storeData)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                onOpenModal(storeData);
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

          {isMap && currCampusId && (
            <StoreMap
              currCampusId={currCampusId}
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
