import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetStoreDetail } from '@/services/store/storeQueries';

import StoreModalReview from './StoreModalReview';

import StoreCard from '@/components/store/StoreCard';
import StoreModalHeader from '@/components/store/modal/StoreModalHeader';
import StoreModalMenuList from '@/components/store/modal/StoreModalMenuList';
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
      <div className="fixed left-[36%] top-0 z-20 m-[15px] h-[calc(100%-30px)] w-[420px] -translate-x-[36%] transform overflow-y-auto rounded bg-white px-5 pt-[15px] shadow-modal scrollbar-hide">
        <StoreModalHeader onClose={onClose} storeId={storeId} />

        <StoreCard
          isModal
          showFavoriteButton={false}
          width="w-full"
          height="h-[269px]"
          storeData={{
            id: storeId || 0,
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
            isScrap: storeData?.isScrap ?? false,
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
            nickName={profile?.nickname || '-'}
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
