import Slider from 'react-slick';

import SliderArrow from '@/components/common/SliderArrow';
import StoreMenuImage from '@/components/store/StoreMenuImage';

export default function StoreMenuImageSlider() {
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
        <StoreMenuImage src="src/assets/images/food.jpg" />
        <StoreMenuImage src="src/assets/images/food2.jpg" />
      </Slider>
    </div>
  );
}
