import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import MealRecruitSlider from '@/components/store/meal-recruit/MealRecruitSlider';

interface MealRecruitSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
}

export default function MealRecruitSideView({
  sideViewOpen,
  onClose,
}: MealRecruitSideViewProps) {
  const headerContent = (
    <span className="mb-10 text-[27px]">
      <span>오늘의 </span>
      <span className="text-vividGreen1">한끼팟!</span>
    </span>
  );

  const mainContent = <MealRecruitSlider sideViewOpen={sideViewOpen} />;

  return (
    <CollapsibleSideView
      sideViewOpen={sideViewOpen}
      onClose={onClose}
      headerContent={headerContent}
      className="sticky top-0 mr-5 max-w-[284px] py-11"
      mainContent={mainContent}
    />
  );
}
