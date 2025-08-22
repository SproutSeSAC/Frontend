import { useCallback, useEffect, useRef, useState } from 'react';

import {
  StoreMapDetail,
  storeMapDetailsAtom,
  storeModalOpenAtom,
} from '@/atoms/storeDetailsAtom';

import { useAtom, useSetAtom } from 'jotai';

interface UseStoreMapProps {
  initialMapDetail: StoreMapDetail;
}

export const INITIAL_ZOOM = 15;

export const useStoreMap = ({ initialMapDetail }: UseStoreMapProps) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const [storeMapDetails, setStoreMapDetails] = useAtom(storeMapDetailsAtom);
  const setStoreModalOpen = useSetAtom(storeModalOpenAtom);

  const storeMapRef = useRef(null);
  const storeMapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerListRef = useRef<naver.maps.Marker[]>([]);

  // 스크립트 로딩 로직
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

  // 맵 초기화 로딩 로직
  useEffect(() => {
    const loadMap = () => {
      if (!window.naver) {
        console.error('naver maps not loaded');
        return;
      }

      if (!storeMapRef.current) return;

      const { lat, lng } = initialMapDetail;

      const initialMapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        zoom: INITIAL_ZOOM,
        minZoom: INITIAL_ZOOM,
        zoomControl: true,
        disableKineticPan: false,
      };

      storeMapInstanceRef.current = new naver.maps.Map(
        storeMapRef.current,
        initialMapOptions,
      );

      setIsMapReady(true);
    };

    if (isScriptLoaded) loadMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded]);

  // 지도 초기화 후 마커 추가
  useEffect(() => {
    if (!isMapReady || !storeMapInstanceRef.current) return;

    markerListRef.current.forEach(marker => {
      const markerPosition = marker.getPosition();
      marker.setMap(storeMapInstanceRef.current);

      if (markerPosition) {
        marker.setPosition(markerPosition);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, initialMapDetail]);

  // 식당 상태값으로 마커로 중심 이동
  useEffect(() => {
    if (!storeMapInstanceRef.current || !storeMapDetails) return;

    const { lat, lng } = storeMapDetails;
    const mapInstance = storeMapInstanceRef.current;

    mapInstance.setCenter(new naver.maps.LatLng(lat, lng));
    const currentZoom = mapInstance?.getZoom();
    const mapZoom = currentZoom < 17 ? 17 : currentZoom;
    mapInstance.setZoom(mapZoom);
  }, [storeMapDetails]);

  const storeMarkerClick = ({ storeId, lat, lng }: StoreMapDetail) => {
    if (storeMapInstanceRef.current && storeId !== 'CAMPUS_MARKER') {
      setStoreMapDetails({ storeId, lat, lng });
      setStoreModalOpen({ open: true, storeId });
    }
  };

  const addMarker = useCallback(
    ({ storeId, lat, lng }: StoreMapDetail) => {
      if (!storeMapInstanceRef.current) return;

      // 이미 마커가 존재하면 추가하지 않도록
      const markerExists = markerListRef.current.find(marker =>
        marker.getPosition().equals(new naver.maps.LatLng(lat, lng)),
      );

      if (markerExists) return;

      const campusIcon = {
        content: `<div style="font-size: 30px;">🏫</div>`,
        anchor: new naver.maps.Point(12, 12),
      };

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: storeMapInstanceRef.current,
        icon: storeId === 'CAMPUS_MARKER' ? campusIcon : undefined,
      });

      markerListRef.current.push(marker);

      naver.maps.Event.addListener(marker, 'click', () => {
        if (storeId !== 'CAMPUS_MARKER') {
          storeMarkerClick({ storeId, lat, lng });
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    storeMapRef,
    storeMapInstanceRef,
    isMapReady,
    addMarker,
    markerListRef,
  };
};
