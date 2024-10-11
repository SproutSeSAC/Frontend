import { useEffect } from 'react';

import { useCalendarData } from '@/hooks/useCalendarData';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { setCookie } from '@/utils';

import Calendar from '@/components/schedule/Calendar';
import CalendarCheckBoxList from '@/components/schedule/CalendarCheckBoxList';

const CALENDAR_COOKIE = 'calendar_access_token';

export default function Schedule() {
  const { data: userProfile } = useGetUserProfile();

  const {
    calendarListByType,
    fullCalendarEvents,
    isCalendarListLoading, //
  } = useCalendarData();

  useEffect(() => {
    getCalendarToken().then(res => {
      setCookie(CALENDAR_COOKIE, res.data.access_token, 1);
    });
  }, []);

  if (isCalendarListLoading) return null;

  return (
    <MainView>
      <Header
        title={`${userProfile?.name} 스프님 새싹 일정`}
        highlight="새싹"
      />
      <div className="flex h-full gap-4">
        <div className="flex w-80 flex-col gap-4">
          <Calendar type="small" events={fullCalendarEvents} />

          {calendarListByType && (
            <CalendarCheckBoxList calendarListByType={calendarListByType} />
          )}
        </div>

        <Calendar type="big" events={fullCalendarEvents} />
      </div>
    </MainView>
  );
}
