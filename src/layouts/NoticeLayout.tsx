import { Outlet, useLocation } from 'react-router-dom';

import { useCalendarEvents } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import Title from '@/components/common/Title';
import NoticeTabNavigation from '@/components/notice/layout/NoticeTabNavigation';
import Calendar from '@/components/schedule/Calendar';
import NoticeInfoList from '@/components/user/NoticeInfoList';

export default function NoticeLayout() {
  const { pathname } = useLocation();

  const { fullCalendarEvents, fullCalendarSideViewEvents } =
    useCalendarEvents();

  return (
    <>
      <MainView>
        <Header title="공지사항" />
        {!pathname.includes('notice/post') && <NoticeTabNavigation />}
        <Outlet />
      </MainView>

      <SideView>
        <Title title="주요일정" className="mb-2" />
        <Calendar
          type="small"
          events={fullCalendarEvents}
          sideViewEvents={fullCalendarSideViewEvents}
        />
        <NoticeInfoList title="공지사항" />
      </SideView>
    </>
  );
}
