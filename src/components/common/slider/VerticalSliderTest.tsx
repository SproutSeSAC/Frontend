import { useEffect, useState } from 'react';

import { IoIosArrowDown } from 'react-icons/io';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import MealRecruitCard from '@/components/meal-recruit/MealRecruitCard';

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

export default function VerticalSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null); // Proper typing

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
          spaceBetween={32}
          navigation
          slidesPerView={3}
          modules={[Pagination, Navigation]}
          cssMode
          style={{ height: '800px' }}
          onSwiper={setSwiperInstance}
        >
          {Array.from({ length: 10 }, (_, idx) => (
            <SwiperSlide key={idx}>
              <MealRecruitCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <SlideNextButton swiper={swiperInstance} />
    </div>
  );
}
