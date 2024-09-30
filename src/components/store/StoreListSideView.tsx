import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import StoreListSlider from '@/components/store/StoreListSlider';

interface StoreListSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
}

export default function StoreListSideView({
  sideViewOpen,
  onClose,
}: StoreListSideViewProps) {
  const headerContent = <span className="text-[27px]">식당 리스트</span>;

  const mainContent = <StoreListSlider sideViewOpen={sideViewOpen} />;

  return (
    <CollapsibleSideView
      sideViewOpen={sideViewOpen}
      onClose={onClose}
      headerContent={headerContent}
      mainContent={mainContent}
    />
  );
}
