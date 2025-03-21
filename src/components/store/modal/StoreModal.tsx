import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetStoreDetail } from '@/services/store/storeQueries';

import StoreCard from '@/components/store/StoreCard';
import StoreModalHeader from '@/components/store/modal/StoreModalHeader';
import StoreModalMenuList from '@/components/store/modal/StoreModalMenuList';
import StoreModalReview from '@/components/store/modal/StoreModalReview';
import StoreModalTabList from '@/components/store/modal/StoreModalTabList';

interface StoreModalProps {
  onClose: () => void;
  storeId: number;
}

export default function StoreModal({ onClose, storeId }: StoreModalProps) {
  const el = document.getElementById('modal') as Element;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const [tab, setTab] = useState('menu');

  const { data: profile } = useGetUserProfile();
  const { data: storeData } = useGetStoreDetail(storeId);

  return createPortal(
    <>
      <div className="fixed left-[36%] top-[5%] z-20 m-[15px] h-[85vh] w-[420px] -translate-x-[40%] transform overflow-y-auto rounded-[20px] bg-white px-7 pb-16 pt-[15px] shadow-modal scrollbar-hide">
        {storeData && (
          <StoreModalHeader
            storeId={storeId}
            onClose={onClose}
            postId={storeData?.postId}
            isScraped={storeData.isScraped}
          />
        )}

        <StoreCard
          isModal
          showFavoriteButton={false}
          width="w-full"
          height="h-[269px]"
          storeData={{
            id: storeData?.postId || 0,
            postId: storeData?.postId || 0,
            workingDay: storeData?.workingDay || '',
            storeImageList:
              storeData?.storeImageList.map(item => ({ path: item })) || [],
            name: storeData?.name || '',
            foodType: storeData?.foodType,
            campusName: storeData?.campusName || '',
            walkTime: storeData?.walkTime || 0,
            breakTime: storeData?.breakTime || '',
            isZeropay: storeData?.isZeropay ?? false,
            isOverPerson: storeData?.isOverPerson ?? false,
            isScraped: storeData?.isScraped ?? false,
            storeMenuList: storeData?.storeMenuList || [],
            isLessThan10000Menu: storeData?.isLessThan10000Menu ?? false,
          }}
        />

        <StoreModalTabList tab={tab} setTab={setTab} />

        {tab === 'menu' && (
          <StoreModalMenuList menuList={storeData?.storeMenuList || []} />
        )}

        {tab === 'review' && (
          <StoreModalReview
            reviewList={storeData?.storeReviewList || []}
            storeId={storeId}
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
