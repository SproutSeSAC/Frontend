import { useCallback, useEffect, useRef, useState } from 'react';

import axios from 'axios';

interface UseStoreMapOption extends naver.maps.MapOptions {
  lat: number;
  lng: number;
}

export const useStoreMap = (mapOption: UseStoreMapOption) => {
  const storeMapRef = useRef(null);
  const storeMapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerListRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    console.log('loading script...');

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_API_CLIENT_ID}&submodules=geocoder`;
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
        zoom: mapOption.zoom,
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

      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      // eslint-disable-next-line consistent-return
      return () => {
        if (storeMapInstanceRef.current) {
          storeMapInstanceRef.current.destroy();
        }
      };
    };

    // script 로드 된 후 초기화 진행되도록
    if (isScriptLoaded) {
      loadMap();
    }
  }, [mapOption, isScriptLoaded]);

  const setCenter = useCallback((lat: number, lng: number) => {
    if (storeMapInstanceRef.current) {
      storeMapInstanceRef.current.setCenter(new naver.maps.LatLng(lat, lng));
    }
  }, []);

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

  const drawRoute = useCallback(async (start: string, goal: string) => {
    try {
      const response = await axios.get('http://localhost:8080/api/directions', {
        params: { start, goal },
      });
      console.log(response);
      const { path } = response.data.route.trafast[0];

      const routePath = path.map(
        (point: [number, number]) => new naver.maps.LatLng(point[1], point[0]),
      );

      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      polylineRef.current = new naver.maps.Polyline({
        path: routePath,
        strokeColor: '#FF0000',
        strokeWeight: 5,
        strokeOpacity: 1,
        map: storeMapInstanceRef.current || undefined,
      });

      if (storeMapInstanceRef.current) {
        storeMapInstanceRef.current.setCenter(
          routePath[Math.floor(routePath.length / 2)],
        );
      }
    } catch (error) {
      console.error('Failed to fetch the route:', error);
    }
  }, []);

  return {
    storeMapRef,
    isMapReady,
    isModalOpen,
    setIsModalOpen,
    setCenter,
    addMarker,
    polylineRef,
    drawRoute,
  };
};
