import { Outlet } from 'react-router-dom';

import NavigationBar from '@/layouts/NavigationBar';

import NotificationSideView from '@/components/notification/NotificationSideView';

export default function Layout() {
  return (
    <div className="flex min-h-[100vh] min-w-[1200px] bg-bg">
      <NavigationBar />
      <Outlet />
      <NotificationSideView />
    </div>
  );
}
