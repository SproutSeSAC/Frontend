import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  resetStoreDetailsAtom,
  storeDetailsAtom,
} from '@/atoms/storeDetailsAtom';

import { usePageBlocker, useStoreMap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { BsList } from 'react-icons/bs';

import StoreModal from '@/components/store/modal/StoreModal';

export default function StoreMap({ storeList }: { storeList: Store[] }) {
  const [storeDetails] = useAtom(storeDetailsAtom);

  const resetStoreDetails = useResetAtom(resetStoreDetailsAtom);

  const {
    modalOpen,
    setModalOpen,
    storeMapRef,
    addMarker,
    isMapReady,
    modalOpenInitValue,
  } = useStoreMap({
    lat: Number(storeDetails.latitude || storeList[0]?.latitude) || 37.5665,
    lng: Number(storeDetails.longitude || storeList[0]?.longitude) || 126.978,
    zoom: storeDetails.zoom > 15 ? storeDetails.zoom : 15,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isMapReady) {
      storeList.forEach(store =>
        addMarker(Number(store?.latitude), Number(store?.longitude), store.id),
      );
    }
  }, [addMarker, isMapReady, storeList]);

  const { blocker } = usePageBlocker({
    isBlockRefresh: false,
    form: { isDirty: !!storeDetails.id },
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      resetStoreDetails();
      blocker.proceed();
    }
  }, [blocker, resetStoreDetails]);

  return (
    <div className="relative w-full">
      <div ref={storeMapRef} className="h-full w-full" />

      <button
        type="button"
        aria-label="리스트로 돌아가기"
        className="absolute right-3 top-0 rounded-lg bg-white p-2 text-mainGray"
        onClick={() => navigate('/stores')}
      >
        <BsList size={16} />
      </button>

      {modalOpen.open && (
        <StoreModal
          onClose={() => setModalOpen(modalOpenInitValue)}
          storeId={modalOpen.id}
        />
      )}

      {modalOpen.open && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setModalOpen(modalOpenInitValue)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setModalOpen(modalOpenInitValue);
            }
          }}
          tabIndex={-1}
          role="button"
          aria-label="모달 닫기"
        />
      )}
    </div>
  );
}
