import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 예외 처리할 페이지 Path 목록
    const exemptedPaths: string[] = [];

    if (!exemptedPaths?.includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
