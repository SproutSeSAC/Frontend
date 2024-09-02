import VerticalSlider from '@/components/common/VerticalSlider';
import StoreListSliderCard from '@/components/store/StoreListSliderCard';

interface StoreListSliderProps {
  sideViewOpen: boolean;
}

export default function StoreListSlider({
  sideViewOpen,
}: StoreListSliderProps) {
  return (
    <VerticalSlider sideViewOpen={sideViewOpen} slidesToShow={4}>
      {Array.from({ length: 10 }, (_, idx) => (
        <div key={idx} className="py-2">
          <StoreListSliderCard />
        </div>
      ))}
    </VerticalSlider>
  );
}
