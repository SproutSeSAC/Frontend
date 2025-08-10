import { ReactNode, useRef, useState } from 'react';

import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Icon from '@/components/common/Icon';

interface SwiperContainerProps<T> {
  slideList: T[];
  children: (item: T) => ReactNode;
  arrowClassName?: string;
  spaceBetween?: number;
  slideItemClassName?: string;
  slidesPerView?: 'auto' | number;
}

export default function SwiperContainer<T extends { id: number }>({
  children,
  slideList,
  arrowClassName = '',
  spaceBetween = 16,
  slideItemClassName = '',
  slidesPerView = 'auto',
}: SwiperContainerProps<T>) {
  const [slide, setSlide] = useState({ isBeginning: true, isEnd: false });

  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative flex items-center justify-between">
      <button
        onClick={e => {
          e.stopPropagation();
          swiperRef.current?.slidePrev();
          if (swiperRef.current) {
            const {
              current: { isEnd, isBeginning },
            } = swiperRef;
            setSlide({ isBeginning, isEnd });
          }
        }}
        className={`left-1 flex items-center justify-center text-darkGray disabled:text-mainGray ${arrowClassName}`}
        disabled={slide.isBeginning}
      >
        <Icon name="ChevronLeft" className="size-full" />
      </button>

      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        onSlideChange={swiper => {
          setSlide({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
        }}
        cssMode={false}
        spaceBetween={spaceBetween}
        modules={[Navigation, Scrollbar]}
        navigation
        scrollbar
        slidesPerView={slidesPerView}
        className="size-full rounded-xl"
        wrapperClass="max-w-0 size-full"
      >
        {slideList.map((item: T) => (
          <SwiperSlide
            key={item.id}
            className={`size-full ${slideItemClassName}`}
          >
            {children(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={e => {
          e.stopPropagation();
          swiperRef.current?.slideNext();
          if (swiperRef.current) {
            const {
              current: { isEnd, isBeginning },
            } = swiperRef;
            setSlide({ isBeginning, isEnd });
          }
        }}
        className={`right-1 flex items-center justify-center text-darkGray disabled:text-mainGray ${arrowClassName}`}
        disabled={slide.isEnd}
      >
        <Icon name="ChevronRight" className="size-full" />
      </button>
    </div>
  );
}
