import { useEffect } from 'react';

import { campusList } from '@/constants/seviceConstant';
import { useStoreMap } from '@/hooks';

interface NaverMapDirectionsProps {
  campusName?: string;
}

export default function NaverMapDirections({
  campusName,
}: NaverMapDirectionsProps) {
  const { storeMapRef, drawRoute, isMapReady } = useStoreMap({
    lat: 37.3674001,
    lng: 127.1181196,
    zoom: 16,
    zoomControl: true,
    scrollWheel: false,
    disableDoubleClickZoom: true,
    pinchZoom: false,
    keyboardShortcuts: false,
    draggable: true,
  });

  useEffect(() => {
    if (isMapReady && campusName) {
      const targetCampus = campusList.find(item => item.name === campusName);

      drawRoute(
        `${targetCampus?.longitude},${targetCampus?.latitude}`,
        '127.0368512,37.6036792',
      );
    }
  }, [campusName, drawRoute, isMapReady]);

  return <div ref={storeMapRef} className="main-w-[260px] mb-6 h-96 w-full" />;
}
