import { ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import NavigationBar from '@/layouts/NavigationBar';

import ScrollToTop from '@/components/common/SrollToTop';
import NotificationSideView from '@/components/notification/NotificationSideView';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen min-w-[1200px] bg-bg">
      <ScrollToTop />
      <NavigationBar type="admin" />
      {children || <Outlet />}
      <NotificationSideView />
    </div>
  );
}
