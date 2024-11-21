import { Outlet } from 'react-router-dom';

import NotificationSideView from '../components/notification/NotificationSideView';

import NavigationBar from '@/layouts/NavigationBar';

export default function Layout() {
  return (
    <div className="flex min-h-[100vh] min-w-[1200px] bg-bg">
      <NavigationBar />
      <Outlet />
      <NotificationSideView />
    </div>
  );
}
