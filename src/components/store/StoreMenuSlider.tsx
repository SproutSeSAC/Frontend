import Slider from 'react-slick';

import StoreMenuImage from '@/components/store/StoreMenuImage';
import StoreMenuSliderArrow from '@/components/store/StoreMenuSliderArrow';

export default function StoreMenuSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <StoreMenuSliderArrow direction="left" onClick={() => {}} />,
    nextArrow: <StoreMenuSliderArrow direction="right" onClick={() => {}} />,
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
