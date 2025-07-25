import { ForwardedRef, forwardRef } from 'react';

import { Store } from '@/types/store/storeDto';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
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
    <div className="flex h-full flex-1 flex-col pr-5 pt-5">
      {isLoading && (
        <div className="flex h-1/2 w-full items-center justify-center">
          <LoopLoading size={130} />
        </div>
      )}

      {!isLoading && (
        <>
          {storeList.length > 0 && (
            <VerticalSlider<Store>
              slideList={storeList}
              slideItemHeight={147}
              spaceBetween={10}
              containerHeightOffset={160}
              paginationHeightOffset={240}
              hideNextButton={!sideViewOpen}
              isLoading={isLoading}
              ref={ref}
            >
              {item => <StoreListSliderCard slideItem={item} />}
            </VerticalSlider>
          )}

          {storeList.length === 0 && (
            <div className="flex flex-col items-center">
              <EmptyContent
                message="맛집 데이터가 없습니다."
                className="mt-20 h-inherit"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});
