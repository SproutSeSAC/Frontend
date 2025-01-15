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
    <h2 className="text-[27px]">
      <span>오늘의 </span>
      <span className="text-vividGreen1">한끼팟!</span>
    </h2>
  );

  const mainContent = <MealRecruitSlider sideViewOpen={sideViewOpen} />;

  return (
    <CollapsibleSideView
      sideViewOpen={sideViewOpen}
      onClose={onClose}
      headerContent={headerContent}
      className="mr-5 flex h-dvh max-w-72 flex-col gap-10 py-11"
      mainContent={mainContent}
    />
  );
}
