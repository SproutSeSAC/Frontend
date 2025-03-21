import { ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import NavigationBar from '@/layouts/NavigationBar';

import ScrollToTop from '@/components/common/SrollToTop';
import NotificationSideView from '@/components/notification/NotificationSideView';

interface LayoutProps {
  children?: ReactNode;
  type: 'trainee' | 'admin';
}

export default function Layout({ children, type }: LayoutProps) {
  return (
    <div className="flex min-h-screen min-w-[1200px] bg-bg">
      <ScrollToTop />
      <NavigationBar type={type} />
      {children || <Outlet />}
      <NotificationSideView />
    </div>
  );
}
