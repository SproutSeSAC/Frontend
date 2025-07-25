import { useEffect } from 'react';

import { storeMapDetailsAtom } from '@/atoms/storeDetailsAtom';

import { useStoreMap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useAtomValue } from 'jotai';
import { BsList } from 'react-icons/bs';

import StoreModal from '@/components/store/modal/StoreModal';

export default function StoreMap({
  storeList,
  toggleShowList,
}: {
  storeList: Store[];
  toggleShowList: () => void;
}) {
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

  useEffect(() => {
    if (isMapReady) {
      storeList.forEach(store =>
        addMarker(Number(store?.latitude), Number(store?.longitude), store.id),
      );
    }
  }, [addMarker, isMapReady, storeList]);

  return (
    <div className="relative ml-5 w-full overflow-hidden rounded-2xl">
      <div ref={storeMapRef} className="size-full" />

      <button
        type="button"
        aria-label="리스트로 돌아가기"
        className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-lg bg-white shadow-xl"
        onClick={toggleShowList}
      >
        <BsList size={18} />
      </button>

      {modalOpen.open && (
        <StoreModal
          onClose={() => setModalOpen(modalOpenInitValue)}
          postId={
            storeList.find(({ postId }) => postId === modalOpen.id)?.postId ||
            storeList[0].postId
          }
          store={
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
