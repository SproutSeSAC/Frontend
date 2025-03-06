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
}

export default function SwiperContainer<T extends { id: number }>({
  children,
  slideList,
}: SwiperContainerProps<T>) {
  const [slide, setSlide] = useState({ isBeginning: true, isEnd: false });

  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="flex h-[265px] items-center justify-between">
      <button
        onClick={() => {
          swiperRef.current?.slidePrev();
          if (swiperRef.current) {
            const {
              current: { isEnd, isBeginning },
            } = swiperRef;
            setSlide({ isBeginning, isEnd });
          }
        }}
        className="flex w-[4vw] items-center justify-center py-5 text-darkGray disabled:text-[#e7e7e7]"
        disabled={slide.isBeginning}
      >
        <Icon name="ChevronLeft" className="size-14" />
      </button>

      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        onSlideChange={swiper => {
          setSlide({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
        }}
        cssMode={false}
        spaceBetween={16}
        modules={[Navigation, Scrollbar]}
        navigation
        scrollbar
        slidesPerView="auto"
        className="!ml-0 h-full w-full"
        wrapperClass="max-w-0 h-full "
      >
        {slideList.map((item: T) => (
          <SwiperSlide className="h-full min-w-[275px]" key={item.id}>
            {children(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => {
          swiperRef.current?.slideNext();
          if (swiperRef.current) {
            const {
              current: { isEnd, isBeginning },
            } = swiperRef;
            setSlide({ isBeginning, isEnd });
          }
        }}
        className="flex w-[4vw] items-center justify-center py-5 text-darkGray disabled:text-mainGray"
        disabled={slide.isEnd}
      >
        <Icon name="ChevronRight" className="size-14" />
      </button>
    </div>
  );
}
