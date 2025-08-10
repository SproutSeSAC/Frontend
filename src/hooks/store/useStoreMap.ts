import { useCallback, useEffect, useRef, useState } from 'react';

import { zoomBehaviorFlagAtom } from '@/atoms/storeDetailsAtom';

import { useAtom } from 'jotai';

interface UseStoreMapOption extends naver.maps.MapOptions {
  lat: number;
  lng: number;
}

const modalOpenInitValue = {
  open: false,
  id: 0,
};

export const useStoreMap = (mapOption: UseStoreMapOption) => {
  const [isZoomBehaviorFlag, setIsZoomBehaviorFlag] =
    useAtom(zoomBehaviorFlagAtom);

  const storeMapRef = useRef(null);
  const storeMapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerListRef = useRef<naver.maps.Marker[]>([]);
  const [modalOpen, setModalOpen] = useState<{ open: boolean; id: number }>(
    modalOpenInitValue,
  );
  const [zoom, setZoom] = useState(mapOption.zoom || 15);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    console.log('loading script...');

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_API_CLIENT_ID}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log('naver maps script loaded');
      setIsScriptLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      console.log('Cleaning up naver map script...');
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const loadMap = () => {
      if (!window.naver) {
        console.error('naver maps not loaded');
        return;
      }

      const DEFAULT_OPTIONS = {
        center: new naver.maps.LatLng(mapOption.lat, mapOption.lng),
        zoom,
        minZoom: 7,
        zoomControl: false,
        disableKineticPan: false,
        ...mapOption,
      };

      if (!storeMapRef.current) {
        return;
      }

      storeMapInstanceRef.current = new naver.maps.Map(
        storeMapRef.current,
        DEFAULT_OPTIONS,
      );

      setIsMapReady(true);

      // zoom 변경 이벤트 리스너 추가
      naver.maps.Event.addListener(
        storeMapInstanceRef.current,
        'zoom_changed',
        () => {
          const currentZoom = storeMapInstanceRef.current?.getZoom();
          if (currentZoom !== undefined) {
            setZoom(currentZoom);
            if (isZoomBehaviorFlag) {
              setIsZoomBehaviorFlag(false);
            }
          }
        },
      );
    };

    if (isScriptLoaded) {
      loadMap();
    }
  }, [
    isScriptLoaded,
    isZoomBehaviorFlag,
    mapOption,
    setIsZoomBehaviorFlag,
    zoom,
  ]);

  useEffect(() => {
    // 지도 초기화 후 마커 추가
    if (isMapReady && storeMapInstanceRef.current) {
      const mapInstance = storeMapInstanceRef.current;

      // 지도 중심
      mapInstance.setCenter(
        new naver.maps.LatLng(mapOption.lat, mapOption.lng),
      );
      // 줌 업데이트
      mapInstance.setZoom(isZoomBehaviorFlag ? mapOption.zoom || 15 : zoom);

      // 마커 리스트를 순회하며 마커 업데이트
      markerListRef.current.forEach(marker => {
        const markerPosition = marker.getPosition();
        marker.setMap(mapInstance);

        if (markerPosition) {
          // 마커 위치를 다시 설정
          marker.setPosition(markerPosition);
        }
      });
    }
  }, [isMapReady, isZoomBehaviorFlag, mapOption, zoom]);

  const setCenter = useCallback((lat: number, lng: number) => {
    if (storeMapInstanceRef.current) {
      storeMapInstanceRef.current.setCenter(new naver.maps.LatLng(lat, lng));
    }
  }, []);

  const addMarker = useCallback((lat: number, lng: number, id: number) => {
    if (!storeMapInstanceRef.current) {
      return null;
    }

    // 이미 마커가 존재하면 추가하지 않도록
    const markerExists = markerListRef.current.find(marker =>
      marker.getPosition().equals(new naver.maps.LatLng(lat, lng)),
    );

    if (markerExists) {
      // eslint-disable-next-line consistent-return
      return;
    }

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map: storeMapInstanceRef.current,
    });

    naver.maps.Event.addListener(marker, 'click', () =>
      setModalOpen({ open: true, id }),
    );

    // 마커 리스트에 추가
    markerListRef.current.push(marker);

    return marker;
  }, []);

  return {
    markerListRef,
    storeMapRef,
    isMapReady,
    modalOpen,
    setModalOpen,
    setCenter,
    addMarker,
    modalOpenInitValue,
  };
};
