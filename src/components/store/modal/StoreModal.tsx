import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetStoreDetail } from '@/services/store/storeQueries';

import { Store } from '@/types/store/storeDto';

import StoreCard from '@/components/store/StoreCard';
import StoreModalHeader from '@/components/store/modal/StoreModalHeader';
import StoreModalMenuList from '@/components/store/modal/StoreModalMenuList';
import StoreModalReview from '@/components/store/modal/StoreModalReview';
import StoreModalTabList from '@/components/store/modal/StoreModalTabList';

interface StoreModalProps {
  onClose: () => void;
  storeData: Store;
}

export default function StoreModal({ onClose, storeData }: StoreModalProps) {
  const el = document.getElementById('modal') as Element;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const [tab, setTab] = useState('menu');

  const { data: profile } = useGetUserProfile();
  const { data: storeDetail } = useGetStoreDetail(storeData.id);

  return createPortal(
    <>
      <div className="fixed left-[36%] top-[5%] z-20 m-[15px] h-[85vh] w-[420px] -translate-x-[40%] transform overflow-y-auto rounded-[20px] bg-white px-7 pb-16 pt-[15px] shadow-modal scrollbar-hide">
        {storeDetail && (
          <>
            <StoreModalHeader
              storeId={storeData.id}
              onClose={onClose}
              postId={storeDetail.postId}
              isScraped={storeDetail.isScraped}
            />
            <StoreCard
              isOpenStoreProposalEditModal
              showFavoriteButton={false}
              width="w-full"
              height="h-[269px]"
              storeData={{
                ...storeDetail,
                longitude: storeData.longitude,
                latitude: storeData.latitude,
                storeImageList: storeData.storeImageList,
              }}
            />
          </>
        )}

        <StoreModalTabList tab={tab} setTab={setTab} />

        {tab === 'menu' && (
          <StoreModalMenuList menuList={storeDetail?.storeMenuList || []} />
        )}

        {tab === 'review' && (
          <StoreModalReview
            reviewList={storeDetail?.storeReviewList || []}
            storeId={storeData.id}
            nickname={profile?.nickname || '-'}
          />
        )}
      </div>

      <div
        className="fixed inset-0 z-10"
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
