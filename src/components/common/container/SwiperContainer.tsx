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

export default function SwiperContainer<T>({
  children,
  slideList,
}: SwiperContainerProps<T>) {
  const [isFirstSlide, setIsFirsrSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => {
          swiperRef.current?.slidePrev();
          setIsFirsrSlide(!!swiperRef.current?.isBeginning);
          setIsLastSlide(!!swiperRef.current?.isEnd);
        }}
        className="flex w-[4vw] items-center justify-center py-5 text-darkGray disabled:text-mainGray"
        disabled={isFirstSlide}
      >
        <Icon name="ChevronLeft" className="size-14" />
      </button>

      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        // onSlideChange={handleSlideChange}
        cssMode={false}
        spaceBetween={16}
        modules={[Navigation, Scrollbar]}
        navigation
        scrollbar
        slidesPerView="auto"
        className="!ml-0 w-full"
        wrapperClass="max-w-0 bg-blue-500"
      >
        {slideList.map((item: T) => (
          <SwiperSlide className="min-w-[275px]" key={JSON.stringify(item)}>
            {children(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => {
          swiperRef.current?.slideNext();
          const {
            current: { isEnd, isBeginning },
          } = swiperRef as React.MutableRefObject<SwiperType>;
          setIsFirsrSlide(isBeginning);
          setIsLastSlide(isEnd);
        }}
        className="flex w-[4vw] items-center justify-center py-5 text-darkGray disabled:text-mainGray"
        disabled={isLastSlide}
      >
        <Icon name="ChevronRight" className="size-14" />
      </button>
    </div>
  );
}
