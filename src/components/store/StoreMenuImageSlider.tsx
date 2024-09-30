import imgUrl from '@/assets/images/food.jpg';
import Slider from 'react-slick';

import SliderArrow from '@/components/common/slider/SliderArrow';
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
        <StoreMenuImage src={imgUrl} width={width} height={height} />
        <StoreMenuImage src={imgUrl} width={width} height={height} />
      </Slider>
    </div>
  );
}
