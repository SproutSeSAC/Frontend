import { ReactNode, useState } from 'react';

import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import SliderArrow from '@/components/common/slider/SliderArrow';

interface StoreMenuImageSliderProps {
  slideList: number[];
  children: ReactNode;
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
        loop
        slidesPerView={1}
        style={{ height: 'inherit' }}
        onSwiper={setSwiperInstance}
      >
        {slideList.map(item => (
          <SwiperSlide key={item}>
            <SliderArrow
              direction="left"
              onClick={e => {
                e.stopPropagation();
                swiperInstance?.slidePrev();
              }}
            />
            {children}
            <SliderArrow
              direction="right"
              onClick={e => {
                e.stopPropagation();
                swiperInstance?.slideNext();
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
