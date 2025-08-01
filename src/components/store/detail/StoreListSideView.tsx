import { ForwardedRef, forwardRef } from 'react';

import { useCollapsibleSideView } from '@/hooks';
import { Store } from '@/types/store/storeDto';

import ChevronButton from '@/components/common/button/ChevronButton';
import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import StoreListSlider from '@/components/store/detail/StoreListSlider';

interface StoreListSideViewProps {
  storeList: Store[];
  isLoading: boolean;
}

export default forwardRef(function StoreListSideView(
  { storeList, isLoading }: StoreListSideViewProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  const { sideViewOpen, openSideView, closeSideView } =
    useCollapsibleSideView();

  const headerContent = <span className="text-[22px]">식당 리스트</span>;

  const mainContent = (
    <StoreListSlider
      sideViewOpen={sideViewOpen}
      storeList={storeList}
      isLoading={isLoading}
      ref={ref}
    />
  );

  return (
    <>
      <CollapsibleSideView
        sideViewOpen={sideViewOpen}
        onClose={closeSideView}
        className="sticky right-0 top-0 h-screen max-w-[310px] pb-10 pt-[60px]"
        headerContent={headerContent}
        mainContent={mainContent}
      />

      {!sideViewOpen && (
        <ChevronButton
          direction="ChevronLeft"
          handleClose={openSideView}
          className="absolute right-0 top-[60px]"
        />
      )}
    </>
  );
});
