import { useCollapsibleSideView } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { BsChevronLeft } from 'react-icons/bs';

import SearchInput from '@/components/common/input/SearchInput';
import StoreFilterForm from '@/components/store/StoreFilterForm';
import StoreListSideView from '@/components/store/StoreListSideView';
import StoreMap from '@/components/store/StoreMap';

export default function StoreDetail() {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();

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

          <StoreMap />
        </section>
      </MainView>

      <StoreListSideView sideViewOpen={sideViewOpen} onClose={closeSideView} />

      {!sideViewOpen && (
        <button
          type="button"
          aria-label="사이드뷰 펼치기"
          className="mt-24 flex size-10 items-center justify-center rounded-lg bg-white text-gray2"
          onClick={openSideView}
        >
          <BsChevronLeft />
        </button>
      )}
    </>
  );
}
