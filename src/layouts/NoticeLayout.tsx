import { Outlet, useLocation } from 'react-router-dom';

import Header from './Header';

import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import NoticeSideView from '@/components/notice/layout/NoticeSideView';
import NoticeTabNavigation from '@/components/notice/layout/NoticeTabNavigation';

export default function NoticeLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <MainView>
        <Header title="공지사항" />
        {!pathname.includes('notice/post') && <NoticeTabNavigation />}
        <Outlet />
      </MainView>
      <SideView>
        <NoticeSideView />
      </SideView>
    </>
  );
}
