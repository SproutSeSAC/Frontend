import { useEffect, useState } from 'react';

export const useCollapsibleSideView = () => {
  const [sideViewOpen, setSideViewOpen] = useState(true);

  // sideView toggle로 인해서 지도의 부모 컴포넌트의 width가 변하게 됩니다.
  // 이런 경우에 지도는 첫 렌더링때 불러왔던 width값과, center값 등 위치값이 달라지기 때문에,
  // resize 이벤트를 걸어주어 지도 짤림 현상과 center가 맞지 않는 현상을 방지합니다.
  useEffect(() => {
    const resizeTimeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => {
      clearTimeout(resizeTimeout);
    };
  }, [sideViewOpen]);

  const openSideView = () => setSideViewOpen(true);
  const closeSideView = () => setSideViewOpen(false);
  const toggleSideView = () => setSideViewOpen(prev => !prev);

  return {
    sideViewOpen,
    openSideView,
    closeSideView,
    toggleSideView,
  };
};
