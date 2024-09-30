import VerticalSlider from '@/components/common/slider/VerticalSlider';
import MealRecruitCard from '@/components/meal-recruit/MealRecruitCard';

interface MealRecruitSliderProps {
  sideViewOpen: boolean;
}

export default function MealRecruitSlider({
  sideViewOpen,
}: MealRecruitSliderProps) {
  return (
    <VerticalSlider sideViewOpen={sideViewOpen} slidesToShow={3}>
      {Array.from({ length: 10 }, (_, idx) => (
        <div key={idx} className="py-4">
          <MealRecruitCard />
        </div>
      ))}
    </VerticalSlider>
  );
}
