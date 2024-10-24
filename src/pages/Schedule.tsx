import { useGetUserProfile } from '@/services/auth/authQueries';

import { useCalendarData } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Calendar from '@/components/schedule/Calendar';
import CalendarCheckBoxList from '@/components/schedule/CalendarCheckBoxList';

export default function Schedule() {
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useGetUserProfile();

  const {
    calendarListByType,
    fullCalendarEvents,
    isCalendarListLoading, //
  } = useCalendarData();

  if (isUserProfileLoading || isCalendarListLoading) return null;

  return (
    <MainView>
      <Header
        title={`${userProfile?.name} 스프님 새싹 일정`}
        highlight="새싹"
      />
      <div className="flex h-full gap-4">
        <div className="flex max-w-[265px] flex-col gap-4">
          <Calendar type="small" events={fullCalendarEvents} />

          {calendarListByType && userProfile && (
            <CalendarCheckBoxList
              calendarListByType={calendarListByType}
              userRole={userProfile.role}
            />
          )}
        </div>

        <Calendar type="big" events={fullCalendarEvents} />
      </div>
    </MainView>
  );
}
