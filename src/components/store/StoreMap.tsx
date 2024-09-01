import { useEffect } from 'react';

import useStoreMap from '@/hooks/useStoreMap';

import StoreModal from '@/components/store/StoreModal';

export default function StoreMap() {
  const { isModalOpen, setIsModalOpen, storeMapRef, addMarker } = useStoreMap({
    lat: 37.5665,
    lng: 126.978,
    zoom: 13,
  });

  useEffect(() => {
    addMarker(37.5665, 126.978);
  }, [addMarker]);

  return (
    <div className="relative w-full">
      <div ref={storeMapRef} className="h-full w-full" />

      {isModalOpen && <StoreModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
