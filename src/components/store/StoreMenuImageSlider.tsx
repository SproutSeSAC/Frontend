import { ReactNode, useState } from 'react';

import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import SliderArrow from '@/components/common/slider/SliderArrow';

interface StoreMenuImageSliderProps {
  slideList: string[];
  children: (item: string) => ReactNode;
}

export default function StoreMenuImageSlider({
  slideList,
  children,
}: StoreMenuImageSliderProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <div className="slider-container">
      <Swiper
        pagination={{
          clickable: true,
        }}
        loop={slideList.length > 1}
        slidesPerView={1}
        style={{ height: 'inherit' }}
        onSwiper={setSwiperInstance}
      >
        {slideList.map((item, idx) => (
          <SwiperSlide key={`${item}-${idx + 1}`}>
            {slideList.length > 1 && (
              <SliderArrow
                direction="left"
                onClick={e => {
                  e.stopPropagation();
                  swiperInstance?.slidePrev();
                }}
              />
            )}
            {children(item)}
            {slideList.length > 1 && (
              <SliderArrow
                direction="right"
                onClick={e => {
                  e.stopPropagation();
                  swiperInstance?.slideNext();
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
