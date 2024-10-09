import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCalendarEvents,
  useGetCalendarList,
} from '@/services/schedule/calendarQueries';

import { calendarAtom } from '@/atoms/calendarAtom';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { Calendar as CalendarType } from '@/types/calendarDto';
import { setCookie } from '@/utils';
import { useAtom } from 'jotai';
import { FaPlus } from 'react-icons/fa6';

import SquareButton from '@/components/common/button/SquareButton';
import Calendar from '@/components/schedule/Calendar';
import CalendarCheckBoxList from '@/components/schedule/CalendarCheckBoxList';

const CALENDAR_TOKEN = 'calendar_access_token';
const CALENDAR_ADDRESS_ID = 'addressbook#contacts@group.v.calendar.google.com';

export default function Schedule() {
  const [currentCalendar, setCurrentCalendar] = useAtom(calendarAtom);

  const { data: userProfile } = useGetUserProfile();

  const {
    data: calendarList,
    isLoading: isCalendarListLoading, //
  } = useGetCalendarList();

  const {
    data: eventList,
    isLoading: isEventListLoading, //
  } = useGetCalendarEvents(currentCalendar?.id);

  const calendarListByType = useMemo(() => {
    const calendars = calendarList?.items?.filter(
      ({ id }) => id !== CALENDAR_ADDRESS_ID,
    );

    const myCalendarList = calendars
      ?.filter(({ accessRole }) => accessRole === 'owner')
      .sort((a, b) => b.id.localeCompare(a.id)) as CalendarType[];

    const subscribeCalendarList = calendars?.filter(
      ({ accessRole }) => accessRole !== 'owner',
    ) as CalendarType[];

    return {
      myCalendarList,
      subscribeCalendarList,
    };
  }, [calendarList?.items]);

  useEffect(() => {
    getCalendarToken().then(res =>
      setCookie(CALENDAR_TOKEN, res.data.access_token, 1),
    );
  }, []);

  const primaryCalendar = calendarList?.items.find(
    calendar => calendar.primary,
  );

  useEffect(() => {
    if (primaryCalendar) {
      setCurrentCalendar(primaryCalendar);
    }
  }, [primaryCalendar, setCurrentCalendar]);

  const fullCalendarEvents = useMemo(() => {
    return eventList?.items.map(({ summary, start, end, id }) => ({
      title: summary,
      start: start.dateTime || start.date,
      end: end.dateTime || end.date,
      id,
    }));
  }, [eventList?.items]);

  if (isCalendarListLoading || isEventListLoading) return null;

  return (
    <MainView>
      <Header
        title={`${userProfile?.name} 스프님 새싹 일정`}
        highlight="새싹"
      />
      <div className="flex h-full gap-4">
        <div className="flex w-80 flex-col gap-4">
          <Calendar type="small" events={fullCalendarEvents} />

          <CalendarCheckBoxList calendarListByType={calendarListByType} />

          <ul className="flex flex-col gap-3">
            {['캠퍼스 매니저', '교육 매니저'].map(calendar => (
              <SquareButton
                key={calendar}
                name={`${calendar} 구독`}
                className="flex items-center gap-1 py-3 text-sm font-semibold shadow-[15px]"
              >
                <FaPlus className="text-sm" />
              </SquareButton>
            ))}
          </ul>
        </div>

        <Calendar type="big" events={fullCalendarEvents} />
      </div>
    </MainView>
  );
}
