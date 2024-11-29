import { ForwardedRef, forwardRef } from 'react';

import { Store } from '@/types/store/storeDto';

import EmptyContent from '@/components/common/EmptyContent';
import VerticalSlider from '@/components/common/slider/VerticalSlider';
import StoreListSliderCard from '@/components/store/detail/StoreListSliderCard';

interface StoreListSliderProps {
  sideViewOpen: boolean;
  storeList: Store[];
  isLoading: boolean;
}

export default forwardRef(function StoreListSlider(
  { sideViewOpen, storeList, isLoading }: StoreListSliderProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div>
      {storeList && storeList.length > 0 && (
        <VerticalSlider<Store>
          slideList={storeList}
          slideItemHeight={147}
          spaceBetween={40}
          containerHeightOffset={280}
          paginationHeightOffset={360}
          hideNextButton={!sideViewOpen}
          isLoading={isLoading}
          ref={ref}
        >
          {item => <StoreListSliderCard slideItem={item} />}
        </VerticalSlider>
      )}

      {(!storeList || storeList.length === 0) && sideViewOpen && (
        <div className="flex h-[calc(100vh-188px)] flex-col items-center">
          <EmptyContent
            message="맛집 데이터가 없습니다."
            className="h-inherit"
          />
        </div>
      )}
    </div>
  );
});
