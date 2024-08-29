import { BsFillGeoAltFill, BsFillTelephoneFill } from 'react-icons/bs';

import FavoriteButton from '@/components/common/FavoriteButton';
import StoreMenuSlider from '@/components/store/StoreMenuSlider';
import StoreTag from '@/components/store/StoreTag';

export default function StoreCard() {
  return (
    <article className="w-[300px] gap-[11px]">
      <StoreMenuSlider />

      <section className="mt-3 flex flex-col gap-6">
        <header className="flex items-center justify-between font-semibold">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-lg">식당 이름</h2>
            <span className="text-gray2">양식</span>
          </div>
          <FavoriteButton size={18} isFavorite={false} onClick={() => {}} />
        </header>

        <div className="flex flex-col gap-4">
          <p className="flex items-center">
            <BsFillGeoAltFill className="mr-[10px] text-gray2" size={15} />
            <span className="text-gray1">서울 용산구 이촌로64길 61</span>
          </p>
          <p className="flex items-center">
            <BsFillTelephoneFill className="mr-[10px] text-gray2" size={15} />
            <span className="text-gray1">영업 중</span>
            <span className="mx-1 text-gray3">|</span>
            <span className="text-gray1">15:00에 브레이크타임</span>
          </p>
        </div>

        <footer className="flex gap-2">
          <StoreTag text="제로페이" />
          <StoreTag text="만원이하" />
        </footer>
      </section>
    </article>
  );
}
