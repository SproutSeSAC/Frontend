import VerticalSlider from '@/components/common/slider/VerticalSlider';
import StoreListSliderCard from '@/components/store/StoreListSliderCard';

export default function StoreListSlider() {
  return (
    <VerticalSlider
      slideList={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
      slideItemHeight={147}
      spaceBetween={40}
      containerHeightOffset={280}
      paginationHeightOffset={360}
    >
      {item => <StoreListSliderCard slideItem={item} />}
    </VerticalSlider>
  );
}
