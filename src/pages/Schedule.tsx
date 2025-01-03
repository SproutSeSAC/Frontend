import { useGetUserProfile } from '@/services/auth/authQueries';

import { useCalendarEvents, useCalendarList } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import LoadingPage from '@/pages/LoadingPage';

import Calendar from '@/components/schedule/Calendar';
import CalendarCheckBoxList from '@/components/schedule/CalendarCheckBoxList';

export default function Schedule() {
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useGetUserProfile();

  const { allCourseCalendarList, personalCalendarList, isCalendarDataLoading } =
    useCalendarList();

  const { fullCalendarSideViewEvents, fullCalendarEvents } =
    useCalendarEvents();

  if (isCalendarDataLoading || isUserProfileLoading) return <LoadingPage />;

  return (
    <MainView>
      <Header
        title={`${userProfile?.name} 스프님 새싹 일정`}
        highlight="새싹"
      />
      <div className="flex h-[85vh] min-h-[700px] gap-4">
        <div className="flex h-full max-w-[300px] flex-col gap-4">
          <Calendar
            type="small"
            events={fullCalendarEvents}
            sideViewEvents={fullCalendarSideViewEvents}
          />

          <CalendarCheckBoxList
            allCourseCalendarList={allCourseCalendarList}
            personalCalendarList={personalCalendarList}
            userRole={userProfile?.role}
          />
        </div>

        <Calendar type="big" events={fullCalendarEvents} />
      </div>
    </MainView>
  );
}
