import VerticalSlider from '@/components/common/slider/VerticalSlider';
import StoreListSliderCard from '@/components/store/detail/StoreListSliderCard';

interface StoreListSliderProps {
  sideViewOpen: boolean;
}

export default function StoreListSlider({
  sideViewOpen,
}: StoreListSliderProps) {
  return (
    <VerticalSlider
      slideList={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
      slideItemHeight={147}
      spaceBetween={40}
      containerHeightOffset={280}
      paginationHeightOffset={360}
      hideNextButton={!sideViewOpen}
    >
      {() => (
        <StoreListSliderCard
        // slideItem={item}
        />
      )}
    </VerticalSlider>
  );
}
