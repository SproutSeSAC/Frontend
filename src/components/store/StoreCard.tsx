import { useState } from 'react';

import {
  BsClockFill,
  BsFillGeoAltFill,
  BsFillTelephoneFill,
} from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreMenuImageSlider from '@/components/store/StoreMenuImageSlider';

// TODO: phoneNumber 부분은 API Response 구조 보고 빼셔도 됩니다.
interface StoreCardProps {
  width: string;
  height: string;
  phoneNumber?: string;
  showFavoriteButton?: boolean;
}

export default function StoreCard({
  width,
  height,
  phoneNumber,
  showFavoriteButton = true,
}: StoreCardProps) {
  const [openHoursModal, setOpenHoursModal] = useState(false);

  return (
    <article className={`${width} gap-[11px]`}>
      <StoreMenuImageSlider width={width} height={height} />

      <section className="mt-3 flex flex-col gap-6">
        <header className="flex items-center justify-between font-semibold">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-lg">식당 이름</h2>
            <span className="text-gray2">양식</span>
          </div>
          {showFavoriteButton && (
            <FavoriteButton size={18} isFavorite={false} onClick={() => {}} />
          )}
        </header>

        <div className="flex flex-col gap-4">
          <p className="flex items-center">
            <BsFillGeoAltFill className="mr-[10px] text-gray2" size={15} />
            <span className="text-gray1">서울 용산구 이촌로64길 61</span>
          </p>
          <p className="flex items-center">
            <BsClockFill className="mr-[10px] text-gray2" size={15} />
            <span className="text-gray1">영업 중</span>
            <span className="mx-1 text-gray3">|</span>
            <p className="relative flex items-center gap-1.5 text-gray1">
              <span>15:00에 브레이크타임</span>
              <button
                type="button"
                onClick={() => setOpenHoursModal(prev => !prev)}
              >
                {openHoursModal ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openHoursModal && (
                <div className="absolute right-0 top-6 z-10 flex w-[175px] flex-col justify-center gap-2 rounded-lg bg-white px-2.5 py-3 text-sm shadow-card">
                  <p className="flex gap-4 pl-2">
                    <span>월요일</span>
                    <span>11:30 ~ 21:00</span>
                  </p>
                  <p className="flex gap-4 pl-2">
                    <span>화요일</span>
                    <span>11:30 ~ 21:00</span>
                  </p>
                  <p className="flex gap-4 pl-2">
                    <span>수요일</span>
                    <span>11:30 ~ 21:00</span>
                  </p>
                  <p className="flex gap-4 pl-2">
                    <span>목요일</span>
                    <span>11:30 ~ 21:00</span>
                  </p>
                  <p className="flex gap-4 pl-2">
                    <span>금요일</span>
                    <span>11:30 ~ 21:00</span>
                  </p>
                  <p className="flex gap-4 pl-2">
                    <span>토요일</span>
                    <span>11:30 ~ 21:00</span>
                  </p>
                  <p className="flex gap-4 pl-2">
                    <span>일요일</span>
                    <span>정기휴무</span>
                  </p>
                </div>
              )}
            </p>
          </p>
          {phoneNumber && (
            <p className="flex items-center">
              <BsFillTelephoneFill className="mr-[10px] text-gray2" size={15} />
              <span className="text-gray1">{phoneNumber}</span>
            </p>
          )}
        </div>

        <footer className="flex gap-2">
          <Tag text="# 제로페이" />
          <Tag text="# 만원이하" />
        </footer>
      </section>
    </article>
  );
}
