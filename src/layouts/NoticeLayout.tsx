import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useCalendarEvents } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import Calendar from '@/components/calendar/Calendar';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import NoticeTabNavigation from '@/components/notice/layout/NoticeTabNavigation';

export default function NoticeLayout() {
  const { pathname } = useLocation();

  const {
    fullCalendarEvents,
    fullCalendarSideViewEvents,
    isCourseCalendarLoadingArr,
  } = useCalendarEvents();

  const navigate = useNavigate();

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
          isCourseCalendarLoadingArr={isCourseCalendarLoadingArr}
        />
        <SquareButton
          color="lightGreen"
          type="button"
          name="특강/행사 신청 내역 보기"
          className="mt-6 w-full !py-3 font-semibold"
          onClick={() => {
            navigate('/application-status-for-sessions');
          }}
        />
      </SideView>
    </>
  );
}
