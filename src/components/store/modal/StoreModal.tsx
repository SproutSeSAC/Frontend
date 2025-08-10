import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetPostDetail } from '@/services/post/postQueries';

import { useHandleScrap } from '@/hooks';
import { GetStoreDetailResponse, Store } from '@/types/store/storeDto';

import Icon from '@/components/common/Icon';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import StoreCard from '@/components/store/StoreCard';
import StoreMenuList from '@/components/store/modal/StoreMenuList';
import StoreModalTabList from '@/components/store/modal/StoreModalTabList';
import StoreReview from '@/components/store/modal/StoreReview';
import StoreReviewForm from '@/components/store/modal/StoreReviewForm';

interface StoreModalProps {
  onClose: () => void;
  postId: number;
  store?: Store;
}

export default function StoreModal({
  onClose,
  postId,
  store,
}: StoreModalProps) {
  const el = document.getElementById('modal') as Element;

  const [tab, setTab] = useState('menu');

  const { data: profile } = useGetUserProfile();

  const { data: storeDetail, isLoading: isStoreDetailLoading } =
    useGetPostDetail<GetStoreDetailResponse>(postId);

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped: !!storeDetail?.isScraped,
      invalidateQueryKeys: [
        { queryKey: ['useGetInfiniteStoreList'] },
        { queryKey: ['useGetPostDetail', postId] },
      ],
    });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return createPortal(
    <>
      <div className="fixed left-[36%] top-[5%] z-[101] m-[15px] h-[85vh] w-[420px] -translate-x-[40%] transform overflow-y-auto rounded-[20px] bg-white px-7 pb-16 pt-[15px] shadow-modal scrollbar-hide">
        {store && storeDetail && !isStoreDetailLoading && (
          <>
            <header className="mb-[10px] flex items-center justify-between">
              <button
                type="button"
                aria-label="모달 닫기"
                onClick={onClose}
                className="-ml-2 text-sm text-darkGray"
              >
                <Icon name="ChevronLeft" />
              </button>

              <FavoriteButton
                size={22}
                isFavorite={storeDetail?.isScraped}
                onClick={onScrapClick}
                disabled={isDeleteScrapPending || isPostScrapPending}
              />
            </header>

            <StoreCard
              isOpenStoreProposalEditModal
              showFavoriteButton={false}
              storeData={{
                ...store,
                longitude: store.longitude,
                latitude: store.latitude,
                storeImageList: store.storeImageList,
              }}
            />

            <StoreModalTabList tab={tab} setTab={setTab} />

            {tab === 'menu' && (
              <StoreMenuList menuList={store?.storeMenuList || []} />
            )}

            {tab === 'review' && (
              <section>
                <StoreReviewForm
                  storeId={store?.postId || postId}
                  nickname={profile?.nickname || '-'}
                />
                <ul className="mt-8 flex flex-col gap-8">
                  {storeDetail.storeReviewList?.map(review => (
                    <StoreReview key={review.createdAt} review={review} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>

      <div
        className="z-100 fixed inset-0"
        onClick={onClose}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            onClose();
          }
        }}
        tabIndex={-1}
        role="button"
        aria-label="모달 닫기"
      />
    </>,
    el,
  );
}
