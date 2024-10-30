import { ForwardedRef, forwardRef } from 'react';

import { Store } from '@/types/store/storeDto';

import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import StoreListSlider from '@/components/store/detail/StoreListSlider';

interface StoreListSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
  storeList: Store[];
  isLoading: boolean;
}

export default forwardRef(function StoreListSideView(
  { sideViewOpen, onClose, storeList, isLoading }: StoreListSideViewProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  const headerContent = <span className="mb-10 text-[27px]">식당 리스트</span>;

  const mainContent = (
    <StoreListSlider
      sideViewOpen={sideViewOpen}
      storeList={storeList}
      isLoading={isLoading}
      ref={ref}
    />
  );

  return (
    <CollapsibleSideView
      sideViewOpen={sideViewOpen}
      onClose={onClose}
      className="sticky top-0 mr-5 max-w-[284px] py-11"
      headerContent={headerContent}
      mainContent={mainContent}
    />
  );
});
