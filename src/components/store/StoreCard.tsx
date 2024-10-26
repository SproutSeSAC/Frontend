import { useCallback, useMemo, useState } from 'react';

import StoreMenuImage from './StoreMenuImage';

import emptyImage from '@/assets/images/empty-image.png';
import { FoodFilterType, foodFilterDisplay } from '@/constants';
import { Store } from '@/types/store/storeDto';
import {
  BsClockFill,
  BsFillGeoAltFill,
  BsFillTelephoneFill,
} from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreMenuImageSlider from '@/components/store/StoreMenuImageSlider';

interface StoreDataType
  extends Omit<
    Store,
    | 'id'
    | 'phoneNumber'
    | 'overFivePerson'
    | 'underPrice'
    | 'address'
    | 'foodType'
    | 'contact'
    | 'storeImage'
    | 'mapSchemaUrl'
  > {
  phoneNumber?: string;
  foodType?: FoodFilterType;
  storeImage?: string | string[];
}

interface StoreCardProps {
  width: string;
  height: string;
  storeData: StoreDataType;
  showFavoriteButton?: boolean;
}

const dayDisplay: { [key in number]: string } = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

export default function StoreCard({
  width,
  height,
  storeData,
  showFavoriteButton = true,
}: StoreCardProps) {
  const [openHoursModal, setOpenHoursModal] = useState(false);

  const parseBusinessHours = useCallback((input: string) => {
    const days = input.split(/(?=\p{Script=Hangul}요일)/u);

    return days
      .map((dayStr, idx) => {
        const [day, timeRange] = dayStr.split(' ');
        if (!timeRange) return null;
        const [open, close] = timeRange.split('~');

        return {
          day: day.replace(':', '').trim(),
          open: open.trim(),
          close: close.trim(),
          id: idx + 1,
        };
      })
      .filter(Boolean);
  }, []);

  const timeArray = useMemo(() => {
    return parseBusinessHours(storeData.workingDay || '');
  }, [parseBusinessHours, storeData.workingDay]);

  const isOpen = useCallback(() => {
    const today = new Date();

    const currentDay = `${dayDisplay[today.getDay()]}요일`;
    const currentTime = today.getHours() * 60 + today.getMinutes();

    return (timeArray || []).some(timeData => {
      if (currentDay === timeData?.day) {
        const [openHour, openMinute] = timeData.open.split(':').map(Number);
        const [closeHour, closeMinute] = timeData.close.split(':').map(Number);

        const openTime = openHour * 60 + openMinute;
        const closeTime = closeHour * 60 + closeMinute;

        return currentTime >= openTime && currentTime <= closeTime;
      }
      return false;
    });
  }, [timeArray]);

  return (
    <article className={`${width} gap-[11px]`}>
      <StoreMenuImageSlider
        slideList={
          typeof storeData.storeImage === 'object' && storeData.storeImage
            ? storeData.storeImage
            : [storeData.storeImage || '']
        }
      >
        {item => (
          <StoreMenuImage
            src={item || emptyImage}
            width={width}
            height={height}
          />
        )}
      </StoreMenuImageSlider>

      <section className="mt-3 flex flex-col gap-6">
        <header className="flex items-center justify-between font-semibold">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-lg">{storeData.name || ''}</h2>
            <span className="text-gray2">
              {storeData.foodType ? foodFilterDisplay[storeData.foodType] : '-'}
            </span>
          </div>
          {showFavoriteButton && (
            <FavoriteButton size={18} isFavorite={false} onClick={() => {}} />
          )}
        </header>

        <div className="flex flex-col gap-4">
          <section className="flex items-center gap-2.5">
            <BsFillGeoAltFill className="text-gray2" size={15} />
            <span className="text-gray1">
              {storeData ? `${storeData.campusName}캠퍼스` : '-'}
            </span>
            <span className="text-gray1">도보</span>
            <span className="flex gap-1 text-gray1">
              <span className="text-skyBlue1">{storeData.walkTime || 0}</span>
              <span>분</span>
            </span>
          </section>

          <section className="flex items-center">
            <BsClockFill className="mr-[10px] min-w-3.5 text-gray2" size={15} />
            <span className="min-w-[60px] text-gray1">
              {isOpen() ? '영업 중' : '영업 종료'}
            </span>
            <span className="mx-1 text-gray3">|</span>
            <div className="relative text-gray1">
              <button
                type="button"
                className="flex items-center gap-1.5"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenHoursModal(prev => !prev);
                }}
              >
                <div className="line-clamp-1 min-w-[166px] overflow-hidden overflow-ellipsis">
                  {storeData ? `${storeData.breakTime} 브레이크타임` : '-'}
                </div>

                {openHoursModal ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openHoursModal && (
                <ul className="absolute right-0 top-6 z-10 flex w-full min-w-[166px] flex-col justify-center gap-2 rounded-lg bg-white px-2.5 py-3 text-sm shadow-card">
                  {timeArray.map(timeData => {
                    return (
                      <li key={timeData?.id} className="flex gap-4 pl-2">
                        <span>{timeData?.day}</span>
                        <span>
                          {timeData?.open} ~ {timeData?.close}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {storeData.phoneNumber && (
            <section className="flex items-center">
              <BsFillTelephoneFill className="mr-[10px] text-gray2" size={15} />
              <span className="text-gray1">{storeData.phoneNumber}</span>
            </section>
          )}
        </div>

        <footer className="flex gap-2 overflow-x-scroll">
          {storeData.tagList.map(tag => {
            return <Tag key={tag} text={`# ${tag}`} />;
          })}
        </footer>
      </section>
    </article>
  );
}
