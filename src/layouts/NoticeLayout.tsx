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
        <Title title="주요일정" className="mb-[14px]" />
        <Calendar
          type="small"
          events={fullCalendarEvents}
          sideViewEvents={fullCalendarSideViewEvents}
        />
        <Title title="공지사항" className="mb-[14px] mt-7" />
        <NoticeInfoList
          title="공지사항"
          className="!h-fit rounded-[20px] bg-white px-[15px] py-[22px]"
        />
      </SideView>
    </>
  );
}
