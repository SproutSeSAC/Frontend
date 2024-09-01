import { useCollapsibleSideView } from '@/hooks/useCollapsibleSideView';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { BsChevronLeft, BsMap } from 'react-icons/bs';

import Input from '@/components/common/Input';
import Title from '@/components/common/Title';
import MealRecruitSideView from '@/components/meal-recruit/MealRecruitSideView';
import StoreCard from '@/components/store/StoreCard';
import StoreFilterForm from '@/components/store/StoreFilterForm';

export default function Store() {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();

  return (
    <>
      <MainView>
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹">
          <Input
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
            <div className="mb-6 flex items-center justify-between">
              <Title title="맛집 리스트" />
              <div className="flex size-[30px] items-center justify-center rounded-full bg-white">
                <BsMap className="text-gray2" />
              </div>
            </div>

            <div className="flex flex-wrap justify-around gap-9 text-xs">
              {Array.from({ length: 12 }, (_, idx) => (
                <StoreCard key={idx} />
              ))}
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
          className="mt-24 flex size-10 items-center justify-center rounded-lg bg-white text-gray2"
          onClick={openSideView}
        >
          <BsChevronLeft />
        </button>
      )}
    </>
  );
}
