import { useState } from 'react';

export function useCollapsibleSideView() {
  const [sideViewOpen, setSideViewOpen] = useState(true);

  const openSideView = () => setSideViewOpen(true);
  const closeSideView = () => setSideViewOpen(false);
  const toggleSideView = () => setSideViewOpen(prev => !prev);

  return {
    sideViewOpen,
    openSideView,
    closeSideView,
    toggleSideView,
  };
}
