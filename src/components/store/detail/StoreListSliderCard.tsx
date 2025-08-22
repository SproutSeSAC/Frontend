import {
  storeMapDetailsAtom,
  storeModalOpenAtom,
} from '@/atoms/storeDetailsAtom';

import { foodFilterDisplay } from '@/constants';
import { useHandleScrap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useSetAtom } from 'jotai';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreMenuImage from '@/components/store/StoreMenuImage';

interface StoreListSliderCardProps {
  slideItem: Store;
}

export default function StoreListSliderCard({
  slideItem,
}: StoreListSliderCardProps) {
  const setStoreMapDetails = useSetAtom(storeMapDetailsAtom);

  const setStoreModalOpen = useSetAtom(storeModalOpenAtom);

  const { onScrapClick, isDeleteScrapPending, isPostScrapPending } =
    useHandleScrap({
      postId: slideItem.postId,
      isScraped: slideItem.isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetInfiniteStoreList'] }],
    });

  const {
    latitude,
    longitude,
    id: storeId,
    storeImageList,
    isScraped,
    scrapCount,
    name,
    foodType,
    storeMenuList,
  } = slideItem;

  const mapDetails = {
    storeId,
    lat: +latitude,
    lng: +longitude,
  };

  const onCardClick = () => {
    setStoreModalOpen({ storeId, open: true });
    setStoreMapDetails(mapDetails);
  };

  return (
    <div
      key={storeId}
      className="flex h-fit w-full flex-col gap-[8px] overflow-hidden"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') onCardClick();
      }}
    >
      <StoreMenuImage
        src={storeImageList[0]?.path}
        className="aspect-square h-[150px] min-h-[138px] w-full min-w-[138px]"
      />

      <div className="flex w-full flex-col py-0.5">
        <header className="flex items-start justify-between">
          <h2 className="line-clamp-2 font-semibold leading-[22px]">
            <span className="pr-1">{name}</span>
            {foodType && (
              <span className="mt-0.5 inline-block min-w-fit text-sm text-darkGray">
                {foodFilterDisplay[foodType]}
              </span>
            )}
          </h2>

          <div className="ml-2 mt-0.5 flex items-center gap-1">
            <FavoriteButton
              size={18}
              isFavorite={isScraped}
              onClick={onScrapClick}
              disabled={isDeleteScrapPending || isPostScrapPending}
            />
            <span className="text-sm text-darkGray">{scrapCount || 0}</span>
          </div>
        </header>

        <div className="mt-2">
          <h3 className="mb-1 text-sm font-semibold">대표 메뉴</h3>
          {storeMenuList.length > 0 ? (
            <ul className="flex flex-col gap-y-0.5 text-sm">
              {storeMenuList.slice(0, 2).map(menu => {
                return (
                  <li key={menu.id} className="flex gap-2">
                    <span className="line-clamp-1 flex-1">{menu.name}</span>
                    <span>{menu.price.toLocaleString()}원</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="text-xs text-mainGray-active">
              메뉴 데이터가 없습니다.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
