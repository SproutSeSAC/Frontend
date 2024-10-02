import VerticalSlider from '../common/slider/VerticalSlider';
import MealRecruitCard from './MealRecruitCard';

export default function MealRecruitSlider() {
  return (
    <VerticalSlider
      slideList={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
      spaceBetween={60}
      slideItemHeight={224}
    >
      <MealRecruitCard />
    </VerticalSlider>
  );
}
