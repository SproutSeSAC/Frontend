import { ReactNode, useEffect, useState } from 'react';

import { IoIosArrowDown } from 'react-icons/io';
import { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface VerticalSliderProps<T> {
  slideList: T[];
  children: (item: T) => ReactNode;
  spaceBetween: number;
  slideItemHeight: number;
  containerHeightOffset: number; // TODO : 개선필요
  paginationHeightOffset: number; // TODO : 개선필요
}

function SlideNextButton({ swiper }: { swiper: SwiperType | null }) {
  return (
    <button
      type="button"
      aria-label="더 보기"
      className="z-10 pb-5"
      onClick={() => swiper?.slideNext()}
    >
      <IoIosArrowDown size={40} opacity={0.4} />
    </button>
  );
}

export default function VerticalSlider<T>({
  slideList,
  children,
  spaceBetween,
  slideItemHeight,
  containerHeightOffset,
  paginationHeightOffset,
}: VerticalSliderProps<T>) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        style={{ height: `${windowHeight - containerHeightOffset}px` }}
      >
        <Swiper
          direction="vertical"
          pagination={{
            clickable: true,
          }}
          spaceBetween={spaceBetween}
          slidesPerView={
            (windowHeight - paginationHeightOffset) / slideItemHeight
          }
          modules={[Pagination]}
          cssMode
          style={{ height: 'inherit' }}
          onSwiper={setSwiperInstance}
        >
          {slideList.map(item => (
            <SwiperSlide key={JSON.stringify(item)}>
              {children(item)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-10 flex w-full justify-center">
        <SlideNextButton swiper={swiperInstance} />
      </div>
    </div>
  );
}
