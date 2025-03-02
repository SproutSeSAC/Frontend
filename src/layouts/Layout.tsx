import { ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import NavigationBar from '@/layouts/NavigationBar';

import ScrollToTop from '@/components/common/SrollToTop';
import NotificationSideView from '@/components/notification/NotificationSideView';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen min-w-[1200px] bg-bg">
      <ScrollToTop />
      <NavigationBar />
      {children || <Outlet />}
      <NotificationSideView />
    </div>
  );
}
