import VerticalSlider from '@/components/common/VerticalSlider';
import MealRecruitCard from '@/components/meal-recruit/MealRecruitCard';

interface MealRecruitSliderProps {
  sideViewOpen: boolean;
}

export default function MealRecruitSlider({
  sideViewOpen,
}: MealRecruitSliderProps) {
  return (
    <VerticalSlider sideViewOpen={sideViewOpen}>
      {Array.from({ length: 10 }, (_, idx) => (
        <div key={idx} className="py-2">
          <MealRecruitCard />
        </div>
      ))}
    </VerticalSlider>
  );
}
