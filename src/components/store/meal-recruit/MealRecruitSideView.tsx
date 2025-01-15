import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import MealRecruitList from '@/components/store/meal-recruit/MealRecruitList';

interface MealRecruitSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
}

export default function MealRecruitSideView({
  sideViewOpen,
  onClose,
}: MealRecruitSideViewProps) {
  const headerContent = (
    <h2 className="text-[27px]">
      <span>오늘의 </span>
      <span className="text-vividGreen1">한끼팟!</span>
    </h2>
  );

  const mainContent = <MealRecruitList sideViewOpen={sideViewOpen} />;

  return (
    <CollapsibleSideView
      sideViewOpen={sideViewOpen}
      onClose={onClose}
      headerContent={headerContent}
      className="mr-5 flex h-[calc(100vh-1px)] max-w-72 flex-col gap-10 pb-5 pt-11"
      mainContent={mainContent}
    />
  );
}
