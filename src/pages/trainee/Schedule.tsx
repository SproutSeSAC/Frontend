import { useGetUserProfile } from '@/services/auth/authQueries';

import { useCalendarEvents, useCalendarList } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import LoadingPage from '@/pages/LoadingPage';

import Calendar from '@/components/calendar/Calendar';
import CalendarCheckBoxList from '@/components/calendar/CalendarCheckBoxList';

export default function Schedule() {
  const { data: userProfile, isLoading } = useGetUserProfile();

  const {
    courseCalendarList,
    personalCalendarList,
    isCalendarDataLoading,
    isCourseCalendarStatusLoading,
  } = useCalendarList();

  const { fullCalendarEvents } = useCalendarEvents();

  if (isCalendarDataLoading || isLoading) return <LoadingPage />;

  return (
    <MainView className="mb-40 h-screen !min-h-[900px]">
      <Header
        title={`${userProfile?.name} 스프님 새싹 일정`}
        highlight="새싹"
      />

      {!isCalendarDataLoading && !isCourseCalendarStatusLoading && (
        <div className="flex h-full gap-6">
          <CalendarCheckBoxList
            courseCalendarList={courseCalendarList}
            personalCalendarList={personalCalendarList || []}
          />
          <Calendar type="big" events={fullCalendarEvents} />
        </div>
      )}
    </MainView>
  );
}
