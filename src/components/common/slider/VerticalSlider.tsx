import { ReactNode, useEffect, useState } from 'react';

import { IoIosArrowDown } from 'react-icons/io';
import { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface VerticalSliderProps {
  slideList: number[];
  children: ReactNode;
  spaceBetween: number;
  slideItemHeight: number;
}

function SlideNextButton({ swiper }: { swiper: SwiperType | null }) {
  return (
    <button
      type="button"
      aria-label="더 보기"
      className="fixed bottom-[-30px] left-0 right-0 z-10 flex justify-center pb-5"
      onClick={() => swiper?.slideNext()}
    >
      <IoIosArrowDown size={40} opacity={0.4} />
    </button>
  );
}

export default function VerticalSlider({
  slideList,
  children,
  spaceBetween,
  slideItemHeight,
}: VerticalSliderProps) {
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
        style={{ height: `${windowHeight - 240}px` }}
      >
        <Swiper
          direction="vertical"
          pagination={{
            clickable: true,
          }}
          spaceBetween={spaceBetween}
          slidesPerView={(windowHeight - 240) / slideItemHeight}
          modules={[Pagination]}
          cssMode
          style={{ height: 'inherit' }}
          onSwiper={setSwiperInstance}
        >
          {slideList.map(item => (
            <SwiperSlide key={item}>{children}</SwiperSlide>
          ))}
        </Swiper>
      </div>

      <SlideNextButton swiper={swiperInstance} />
    </div>
  );
}
