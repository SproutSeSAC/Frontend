import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreMenuImage from '@/components/store/StoreMenuImage';

export default function StoreListSliderCard() {
  return (
    <article className="flex w-full gap-[11px]">
      <StoreMenuImage
        width="w-[147px]"
        height="h-[147px]"
        src="/src/assets/images/food.jpg"
      />

      <div className="flex w-full flex-col gap-4">
        <header className="font-semibold">
          <div className="flex w-full justify-between">
            <h2>식당이름</h2>
            <div className="flex items-center gap-1">
              <FavoriteButton size={14} isFavorite={false} onClick={() => {}} />
              <span className="text-gray2">99</span>
            </div>
          </div>
          <p className="text-xs text-gray1">양식</p>
        </header>

        <div>
          <h3 className="mb-1 text-xs font-semibold">대표 메뉴</h3>
          <ul className="text-[11px]">
            <li className="flex gap-2">
              <span>음식 이름</span>
              <span>14,000원</span>
            </li>
            <li className="flex gap-2">
              <span>음식 이름</span>
              <span>14,000원</span>
            </li>
            <li className="flex gap-2">
              <span>음식 이름</span>
              <span>14,000원</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
