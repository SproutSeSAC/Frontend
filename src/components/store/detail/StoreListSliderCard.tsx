import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostStoreScrap } from '@/services/store/storeMutations';

import {
  storeDetailsAtom,
  zoomBehaviorFlagAtom,
} from '@/atoms/storeDetailsAtom';

import { foodFilterDisplay } from '@/constants';
import { useDialogContext } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useAtom } from 'jotai';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreMenuImage from '@/components/store/StoreMenuImage';

export default function StoreListSliderCard({
  slideItem,
}: {
  slideItem: Store;
}) {
  const { showToast } = useDialogContext();
  const queryClient = useQueryClient();

  const [, setStoreDetails] = useAtom(storeDetailsAtom);
  const [, setIsZoomBehaviorFlag] = useAtom(zoomBehaviorFlagAtom);

  const { mutateAsync: postStoreScrap } = usePostStoreScrap();

  const onStoreScrap = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const result = await postStoreScrap({ storeId: slideItem.id });

        if (result) {
          showToast('맛집을 찜했어요!', 1000);
        } else {
          showToast('맛집 찜하기를 취소 했어요!', 1000);
        }

        queryClient.invalidateQueries({
          queryKey: ['useGetInfiniteStoreList', {}],
        });
      } catch (err) {
        console.error(err);
        showToast('맛집 찜하기를 실패했어요');
      }
    },
    [postStoreScrap, queryClient, showToast, slideItem.id],
  );

  return (
    <article>
      <div
        className="flex w-full gap-[11px]"
        onClick={() => {
          setStoreDetails({
            latitude: slideItem.latitude,
            longitude: slideItem.longitude,
            id: slideItem.id,
            zoom: 20,
          });
          setIsZoomBehaviorFlag(true);
        }}
        key={slideItem.id}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setStoreDetails({
              latitude: slideItem.latitude,
              longitude: slideItem.longitude,
              id: slideItem.id,
              zoom: 20,
            });
          }
        }}
      >
        <StoreMenuImage
          width="w-[147px]"
          height="h-[147px]"
          src={slideItem.storeImageList[0]?.path}
        />

        <div className="flex w-full flex-col gap-4">
          <header className="font-semibold">
            <div className="flex w-full items-start justify-between gap-0.5">
              <h2>{slideItem.name || ''}</h2>
              <div className="flex items-center gap-1">
                <FavoriteButton
                  size={18}
                  isFavorite={slideItem.isScrap}
                  onClick={onStoreScrap}
                />
                <span className="text-sm text-mainGray">
                  {slideItem.scrapCount || 0}
                </span>
              </div>
            </div>
            <p className="text-xs text-darkGray-active">
              {slideItem.foodType ? foodFilterDisplay[slideItem.foodType] : '-'}
            </p>
          </header>

          {slideItem.storeMenuList.length > 0 && (
            <div>
              <h3 className="mb-1 text-xs font-semibold">대표 메뉴</h3>
              <ul className="flex flex-col gap-1 text-[11px]">
                {slideItem.storeMenuList.map(item => {
                  return (
                    <li key={item.id} className="flex gap-2">
                      <span>{item.name}</span>
                      <span>{item.price.toLocaleString()}원</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
