import { useState } from 'react';

import StoreMenuImage from './StoreMenuImage';

import imgUrl from '@/assets/images/food.jpg';
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
      <StoreMenuImageSlider slideList={[1, 2]}>
        <StoreMenuImage src={imgUrl} width={width} height={height} />
      </StoreMenuImageSlider>

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
          <section className="flex items-center gap-2.5">
            <BsFillGeoAltFill className="text-gray2" size={15} />
            <span className="text-gray1">도봉캠퍼스</span>
            <span className="text-gray1">도보</span>
            <span className="flex gap-1 text-gray1">
              <button
                className="text-skyBlue1"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                16
              </button>
              <span>분</span>
            </span>
          </section>

          <section className="flex items-center">
            <BsClockFill className="mr-[10px] text-gray2" size={15} />
            <span className="text-gray1">영업 중</span>
            <span className="mx-1 text-gray3">|</span>
            <p className="relative text-gray1">
              <button
                type="button"
                className="flex items-center gap-1.5"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenHoursModal(prev => !prev);
                }}
              >
                <span>15:00에 브레이크타임</span>

                {openHoursModal ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openHoursModal && (
                <ul className="absolute right-0 top-6 z-10 flex w-[175px] flex-col justify-center gap-2 rounded-lg bg-white px-2.5 py-3 text-sm shadow-card">
                  li
                  <li className="flex gap-4 pl-2">
                    <span>월요일</span>
                    <span>11:30 ~ 21:00</span>
                  </li>
                  <li className="flex gap-4 pl-2">
                    <span>화요일</span>
                    <span>11:30 ~ 21:00</span>
                  </li>
                  <li className="flex gap-4 pl-2">
                    <span>수요일</span>
                    <span>11:30 ~ 21:00</span>
                  </li>
                  <li className="flex gap-4 pl-2">
                    <span>목요일</span>
                    <span>11:30 ~ 21:00</span>
                  </li>
                  <li className="flex gap-4 pl-2">
                    <span>금요일</span>
                    <span>11:30 ~ 21:00</span>
                  </li>
                  <li className="flex gap-4 pl-2">
                    <span>토요일</span>
                    <span>11:30 ~ 21:00</span>
                  </li>
                  <li className="flex gap-4 pl-2">
                    <span>일요일</span>
                    <span>정기휴무</span>
                  </li>
                </ul>
              )}
            </p>
          </section>

          {phoneNumber && (
            <section className="flex items-center">
              <BsFillTelephoneFill className="mr-[10px] text-gray2" size={15} />
              <span className="text-gray1">{phoneNumber}</span>
            </section>
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
