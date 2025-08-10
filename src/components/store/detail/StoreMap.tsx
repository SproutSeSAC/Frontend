import { useEffect } from 'react';

import { useGetCampusList } from '@/services/campusCourse/campusCourseQueries';

import { storeMapDetailsAtom } from '@/atoms/storeDetailsAtom';

import { useStoreMap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useAtomValue } from 'jotai';
import { BsList } from 'react-icons/bs';

import StoreModal from '@/components/store/modal/StoreModal';

interface StoreMapProp {
  currCampusId: number;
  storeList: Store[];
  toggleViewType: () => void;
}

export default function StoreMap({
  currCampusId,
  storeList,
  toggleViewType,
}: StoreMapProp) {
  const storeMapDetails = useAtomValue(storeMapDetailsAtom);

  const { data: campusList } = useGetCampusList();

  const currCampus = campusList?.find(campus => campus.id === currCampusId);

  const CAMPUS_LAT = +(currCampus?.latitude || 37.655604);
  const CAMPUS_LON = +(currCampus?.longitude || 127.0129929);

  const {
    modalOpen,
    setModalOpen,
    storeMapRef,
    addMarker,
    isMapReady,
    modalOpenInitValue,
  } = useStoreMap({
    lat:
      Number(storeMapDetails.latitude || storeList[0]?.latitude) || +CAMPUS_LAT,

    lng:
      Number(storeMapDetails.longitude || storeList[0]?.longitude) ||
      +CAMPUS_LON,

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
    <div className="relative size-full overflow-hidden rounded-2xl">
      <div ref={storeMapRef} className="size-full" />

      <button
        type="button"
        aria-label="리스트로 돌아가기"
        className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-lg bg-white shadow-xl"
        onClick={toggleViewType}
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
