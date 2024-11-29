import { ReactNode, useMemo, useState } from 'react';

import emptyImage from '@/assets/images/empty-image.png';
import { StoreImage } from '@/types/store/storeDto';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import SliderArrow from '@/components/common/slider/SliderArrow';

interface StoreMenuImageSliderProps {
  slideList: StoreImage[];
  children: (item: StoreImage) => ReactNode;
}

export default function StoreMenuImageSlider({
  slideList,
  children,
}: StoreMenuImageSliderProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const renderContent = useMemo(() => {
    if (slideList.length > 0) {
      return slideList.map((item, idx) => (
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
      ));
    }

    return (
      <SwiperSlide>{children({ path: emptyImage } as StoreImage)} </SwiperSlide>
    );
  }, [children, slideList, swiperInstance]);

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
        {renderContent}
      </Swiper>
    </div>
  );
}
