import Slider from 'react-slick';

import SliderArrow from '@/components/common/SliderArrow';
import StoreMenuImage from '@/components/store/StoreMenuImage';

interface StoreMenuImageSliderProps {
  width: string;
  height: string;
}

export default function StoreMenuImageSlider({
  width,
  height,
}: StoreMenuImageSliderProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SliderArrow direction="left" onClick={() => {}} />,
    nextArrow: <SliderArrow direction="right" onClick={() => {}} />,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <StoreMenuImage
          src="/src/assets/images/food.jpg"
          width={width}
          height={height}
        />
        <StoreMenuImage
          src="/src/assets/images/food2.jpg"
          width={width}
          height={height}
        />
      </Slider>
    </div>
  );
}
