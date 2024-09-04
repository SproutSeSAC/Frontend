import { Outlet } from 'react-router-dom';

import NavigationBar from '@/layouts/NavigationBar';

export default function Layout() {
  return (
    <div className="flex min-h-[100vh] bg-bg">
      <NavigationBar />
      <Outlet />
    </div>
  );
}
