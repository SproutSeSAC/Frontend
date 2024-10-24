import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useStoreMap } from '@/hooks';
import { BsList } from 'react-icons/bs';

import StoreModal from '@/components/store/modal/StoreModal';

export default function StoreMap() {
  const { isModalOpen, setIsModalOpen, storeMapRef, addMarker, isMapReady } =
    useStoreMap({
      lat: 37.5665,
      lng: 126.978,
      zoom: 13,
    });
  const navigate = useNavigate();

  // NOTE - 마커 클릭 시 modal 띄우는 것을 보여주기 위해 임의로 찍어놓은 마커입니다. 추후에 삭제하셔도 됩니다.
  useEffect(() => {
    if (isMapReady) {
      addMarker(37.5665, 126.978);
    }
  }, [addMarker, isMapReady]);

  return (
    <div className="relative w-full">
      <div ref={storeMapRef} className="h-full w-full" />

      <button
        type="button"
        aria-label="리스트로 돌아가기"
        className="absolute right-3 top-0 rounded-lg bg-white p-2 text-gray2"
        onClick={() => navigate('/stores')}
      >
        <BsList size={16} />
      </button>

      {/* {isModalOpen && <StoreModal onClose={() => setIsModalOpen(false)} />} */}

      {isModalOpen && (
        <StoreModal onClose={() => setIsModalOpen(false)} storeId={1} />
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setIsModalOpen(false);
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