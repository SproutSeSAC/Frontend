import { Outlet } from 'react-router-dom';

import Header from './Header';

import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import AnnouncementSideView from '@/components/announcement/layout/AnnouncementSideView';

export default function AnnouncementLayout() {
  return (
    <>
      <MainView>
        <Header title="공지사항" />
        <Outlet />
      </MainView>
      <SideView>
        <AnnouncementSideView />
      </SideView>
    </>
  );
}
