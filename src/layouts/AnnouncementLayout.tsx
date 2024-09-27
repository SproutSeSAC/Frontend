import { Outlet, useLocation } from 'react-router-dom';

import Header from './Header';

import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import AnnouncementSideView from '@/components/announcement/layout/AnnouncementSideView';
import AnnouncementTabNavigation from '@/components/announcement/layout/AnnouncementTabNavigation';

export default function AnnouncementLayout() {
  const location = useLocation();

  return (
    <>
      <MainView>
        <Header title="공지사항" />
        {!location.pathname.includes('/announcement/post') && (
          <AnnouncementTabNavigation />
        )}
        <Outlet />
      </MainView>
      <SideView>
        <AnnouncementSideView />
      </SideView>
    </>
  );
}
