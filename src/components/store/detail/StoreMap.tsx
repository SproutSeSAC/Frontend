import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { storeMapDetailsAtom } from '@/atoms/storeDetailsAtom';

import { useStoreMap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useAtomValue } from 'jotai';
import { BsList } from 'react-icons/bs';

import StoreModal from '@/components/store/modal/StoreModal';

export default function StoreMap({ storeList }: { storeList: Store[] }) {
  const storeMapDetails = useAtomValue(storeMapDetailsAtom);

  const {
    modalOpen,
    setModalOpen,
    storeMapRef,
    addMarker,
    isMapReady,
    modalOpenInitValue,
  } = useStoreMap({
    lat: Number(storeMapDetails.latitude || storeList[0]?.latitude),
    lng: Number(storeMapDetails.longitude || storeList[0]?.longitude),
    zoom: storeMapDetails.zoom > 15 ? storeMapDetails.zoom : 15,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isMapReady) {
      storeList.forEach(store =>
        addMarker(Number(store?.latitude), Number(store?.longitude), store.id),
      );
    }
  }, [addMarker, isMapReady, storeList]);

  return (
    <div className="relative w-full pl-5">
      <div ref={storeMapRef} className="h-full w-full" />

      <button
        type="button"
        aria-label="리스트로 돌아가기"
        className="absolute right-3 top-3 rounded-lg bg-white p-2.5 shadow-card"
        onClick={() => navigate('/stores')}
      >
        <BsList size={18} />
      </button>

      {modalOpen.open && (
        <StoreModal
          onClose={() => setModalOpen(modalOpenInitValue)}
          storeData={
            storeList.find(store => store.id === modalOpen.id) || storeList[0]
          }
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
