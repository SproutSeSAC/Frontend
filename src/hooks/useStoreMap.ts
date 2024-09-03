import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStoreMapOption {
  lat: number;
  lng: number;
  zoom: number;
}

export const useStoreMap = (mapOption: UseStoreMapOption) => {
  /**
   * storeMapRef: 단순 DOM 요소 참조용. Map이 렌더링될 위치만 제어합니다.
   * storeMapInstanceRef: Map에 행해지는 모든 action은 이 instance로만 제어합니다.
   */
  const storeMapRef = useRef(null); // Map이 렌더링될 DOM 요소를 참조합니다.
  const storeMapInstanceRef = useRef<naver.maps.Map | null>(null); // 생성된 실제 Map 객체를 저장합니다.
  const markerListRef = useRef<naver.maps.Marker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map 초기화하는 hook 입니다.
  useEffect(() => {
    const DEFAULT_OPTIONS = {
      center: new naver.maps.LatLng(mapOption.lat, mapOption.lng),
      zoom: mapOption.zoom,
      minZoom: 7,
      zoomControl: false,
      disableKineticPan: false,
    };

    if (!storeMapRef.current) {
      return;
    }

    storeMapInstanceRef.current = new naver.maps.Map(
      storeMapRef.current,
      DEFAULT_OPTIONS,
    );

    // eslint-disable-next-line consistent-return
    return () => {
      if (storeMapInstanceRef.current) {
        storeMapInstanceRef.current.destroy();
      }
    };
  }, [mapOption.lat, mapOption.lng, mapOption.zoom]);

  /**
   * 지도의 중심을 설정하는 함수입니다.
   */
  const setCenter = useCallback((lat: number, lng: number) => {
    if (storeMapInstanceRef.current) {
      storeMapInstanceRef.current.setCenter(new naver.maps.LatLng(lat, lng));
    }
  }, []);

  /**
   * 지도에 마커를 추가하는 함수입니다.
   */
  const addMarker = useCallback((lat: number, lng: number) => {
    if (!storeMapInstanceRef.current) {
      return null;
    }

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map: storeMapInstanceRef.current,
    });

    naver.maps.Event.addListener(marker, 'click', () => setIsModalOpen(true));

    markerListRef.current.push(marker);

    return marker;
  }, []);

  return {
    storeMapRef,
    isModalOpen,
    setIsModalOpen,
    setCenter,
    addMarker,
  };
};
