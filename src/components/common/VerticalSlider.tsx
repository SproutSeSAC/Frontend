import { useRef } from 'react';

import { BsChevronDown } from 'react-icons/bs';
import Slider from 'react-slick';

interface VerticalSliderProps {
  sideViewOpen: boolean;
  children: React.ReactNode;
}

export default function VerticalSlider({
  sideViewOpen,
  children,
}: VerticalSliderProps) {
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
    <div className={`slider-container ${!sideViewOpen && 'hidden'}`}>
      <Slider
        ref={slider => {
          sliderRef.current = slider;
        }}
        {...settings}
      >
        {children}
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
