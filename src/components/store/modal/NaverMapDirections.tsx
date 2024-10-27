import { useEffect } from 'react';

import { useStoreMap } from '@/hooks';

export default function NaverMapDirections() {
  const { storeMapRef, drawRoute, isMapReady } = useStoreMap({
    lat: 37.3674001,
    lng: 127.1181196,
    zoom: 16,
    zoomControl: false,
    scrollWheel: false,
    disableDoubleClickZoom: true,
    pinchZoom: false,
    keyboardShortcuts: false,
    draggable: true,
  });
  useEffect(() => {
    if (isMapReady) {
      drawRoute('127.037784,37.570082', '127.041411,37.570862');
    }
  }, [isMapReady, drawRoute]);

  return <div ref={storeMapRef} className="main-w-[260px] mb-6 h-96 w-full" />;
}
