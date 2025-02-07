import { ReactNode, useRef } from 'react';

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
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="flex items-center justify-between">
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        cssMode={false}
        spaceBetween={16}
        modules={[Navigation, Scrollbar]}
        navigation
        scrollbar
        slidesPerView="auto"
        className="!ml-0 w-full rounded-2xl"
        wrapperClass="max-w-0 bg-blue-500"
      >
        {slideList.map((item: T) => (
          <SwiperSlide className="min-w-[275px]" key={JSON.stringify(item)}>
            {children(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="flex w-[8vw] items-center justify-center py-5"
      >
        <Icon
          name="ChevronRight"
          className={`"size-10 ${swiperRef.current?.isEnd ? 'fill-red-200' : 'fill-darkGray'}`}
        />
      </button>
    </div>
  );
}
