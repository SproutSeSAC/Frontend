import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useEffect,
  useState,
} from 'react';

import { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Icon from '@/components/common/Icon';
import LoopLoading from '@/components/common/LoopLoading';

interface VerticalSliderProps<T> {
  slideList: T[];
  children: (item: T) => ReactNode;
  spaceBetween: number;
  slideItemHeight: number;
  containerHeightOffset: number;
  paginationHeightOffset: number;
  isLoading?: boolean;
  hideNextButton?: boolean;
}

function SlideNextButton({
  direction,
  swiper,
  className,
}: {
  direction: 'prev' | 'next';
  swiper: SwiperType | null;
  className?: string;
}) {
  const directionObj = {
    prev: {
      func: () => swiper?.slidePrev(),
      iconName: 'ChevronUp' as const,
    },
    next: {
      func: () => swiper?.slideNext(),
      iconName: 'ChevronDown' as const,
    },
  };

  return (
    <button
      type="button"
      aria-label="더보기"
      className={`z-10 p-2 ${className}`}
      onClick={directionObj[direction].func}
    >
      <Icon name={directionObj[direction].iconName} opacity={0.5} />
    </button>
  );
}

const VerticalSlider = forwardRef(function VerticalSlider<T>(
  {
    slideList,
    children,
    spaceBetween,
    slideItemHeight,
    containerHeightOffset,
    paginationHeightOffset,
    isLoading,
    hideNextButton = false,
  }: VerticalSliderProps<T>,
  observeRef?: ForwardedRef<HTMLDivElement>,
) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex h-full flex-col justify-between">
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
          cssMode={false}
          style={{ height: 'inherit' }}
          onSwiper={setSwiperInstance}
        >
          {slideList.map((item: T) => (
            <SwiperSlide key={JSON.stringify(item)}>
              {children(item)}
            </SwiperSlide>
          ))}
          {observeRef && (
            <SwiperSlide>
              <div ref={observeRef} />
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {isLoading && (
        <div className="flex w-full justify-center">
          <LoopLoading size={60} />
        </div>
      )}

      {!hideNextButton && slideList.length > 0 && (
        <div className="absolute bottom-[4vh] flex w-full items-center justify-center gap-x-5">
          <SlideNextButton
            direction="prev"
            swiper={swiperInstance}
            className="flex size-[50px] items-center justify-center rounded-full bg-mainGray bg-opacity-80 shadow-xl hover:bg-darkGray-active hover:bg-opacity-80 hover:text-white"
          />
          <SlideNextButton
            direction="next"
            swiper={swiperInstance}
            className="flex size-[50px] items-center justify-center rounded-full bg-mainGray bg-opacity-60 shadow-2xl hover:bg-darkGray-active hover:bg-opacity-80 hover:text-white"
          />
        </div>
      )}
    </div>
  );
}) as <T>(
  props: VerticalSliderProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;

export default VerticalSlider;
