import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import MealRecruitSlider from '@/components/meal-recruit/MealRecruitSlider';

interface MealRecruitSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
}

export default function MealRecruitSideView({
  sideViewOpen,
  onClose,
}: MealRecruitSideViewProps) {
  const headerContent = (
    <span className="text-[27px]">
      <span>오늘의 </span>
      <span className="text-vividGreen1">한끼팟!</span>
    </span>
  );

  const mainContent = <MealRecruitSlider />;

  return (
    <CollapsibleSideView
      sideViewOpen={sideViewOpen}
      onClose={onClose}
      headerContent={headerContent}
      mainContent={mainContent}
    />
  );
}
