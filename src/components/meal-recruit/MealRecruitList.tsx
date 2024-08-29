import { useRef } from 'react';

import { BsChevronDown } from 'react-icons/bs';
import Slider from 'react-slick';

import MealRecruitListItem from '@/components/meal-recruit/MealRecruitListItem';

export default function MealRecruitList() {
  const sliderRef = useRef<Slider | null>(null);
  const settings = {
    dots: false,
    infinite: true,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
  };

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="slider-container">
      <Slider
        ref={slider => {
          sliderRef.current = slider;
        }}
        {...settings}
      >
        {Array.from({ length: 10 }, (_, idx) => (
          <div key={idx} className="py-2">
            <MealRecruitListItem />
          </div>
        ))}
      </Slider>

      <button
        type="button"
        aria-label="더 보기"
        className="mt-10 flex w-full justify-center"
        onClick={next}
      >
        <BsChevronDown />
      </button>
    </div>
  );
}
