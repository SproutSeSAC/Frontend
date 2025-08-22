import { useEffect, useMemo } from 'react';

import { CampusListData } from '@/services/campusCourse/campusCourseQueries';

import { storeModalOpenAtom } from '@/atoms/storeDetailsAtom';

import { useStoreMap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { useAtom } from 'jotai';
import { BsList } from 'react-icons/bs';

import StoreModal from '@/components/store/modal/StoreModal';

interface StoreMapProp {
  currCampus: CampusListData['campusList'][number];
  storeList: Store[];
  toggleViewType: () => void;
}

export default function StoreMap({
  currCampus,
  storeList,
  toggleViewType,
}: StoreMapProp) {
  const [storeModalOpen, setStoreModalOpen] = useAtom(storeModalOpenAtom);

  const campusMapDetail = useMemo(() => {
    return {
      storeId: 'CAMPUS_MARKER' as const,
      lat: +currCampus.latitude,
      lng: +currCampus.longitude,
    };
  }, [currCampus.latitude, currCampus.longitude]);

  const {
    storeMapRef,
    storeMapInstanceRef,
    addMarker,
    isMapReady,
    markerListRef,
  } = useStoreMap({
    initialMapDetail: campusMapDetail,
  });

  useEffect(() => {
    if (isMapReady) {
      markerListRef.current.forEach(marker => marker.setMap(null));
      markerListRef.current = [];

      storeMapInstanceRef?.current?.setCenter(
        new naver.maps.LatLng(+currCampus.latitude, +currCampus.longitude),
      );

      storeList.forEach(({ latitude, longitude, id }) =>
        addMarker({ lat: +latitude, lng: +longitude, storeId: id }),
      );

      addMarker(campusMapDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currCampus, isMapReady, markerListRef, storeList]);

  const storeDetail = storeList.find(
    ({ postId }) => postId === storeModalOpen.storeId,
  );

  const closeModal = () =>
    setStoreModalOpen(prev => ({ ...prev, open: false }));

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

      {storeModalOpen.open && storeDetail && (
        <StoreModal store={storeDetail} onClose={closeModal} />
      )}
    </div>
  );
}
