import imgUrl from '@/assets/images/food.jpg';
import { foodFilterDisplay } from '@/constants';
import { Store } from '@/types/store/storeDto';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreMenuImage from '@/components/store/StoreMenuImage';

export default function StoreListSliderCard({
  slideItem,
}: {
  slideItem: Store;
}) {
  return (
    <article className="flex w-full gap-[11px]">
      <StoreMenuImage width="w-[147px]" height="h-[147px]" src={imgUrl} />

      <div className="flex w-full flex-col gap-4">
        <header className="font-semibold">
          <div className="flex w-full justify-between">
            <h2>{slideItem.name || ''}</h2>
            <div className="flex items-center gap-1">
              <FavoriteButton size={14} isFavorite={false} onClick={() => {}} />
              <span className="text-gray2">99</span>
            </div>
          </div>
          <p className="text-xs text-gray1">
            {slideItem.foodType ? foodFilterDisplay[slideItem.foodType] : '-'}
          </p>
        </header>

        <div>
          <h3 className="mb-1 text-xs font-semibold">대표 메뉴</h3>
          <ul className="text-[11px]">
            {[].map(item => {
              return (
                <li key={item} className="flex gap-2">
                  <span>음식 이름</span>
                  <span>14,000원</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}
