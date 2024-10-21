import { useEffect, useMemo } from 'react';

import { getCalendarToken } from '@/services/auth/authQueries';
import {
  useGetCalendarList,
  useGetEventsByCalendar,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CALENDAR_ADDRESS_ID, CALENDAR_COOKIE_KEY } from '@/constants';
import { Calendar, Event } from '@/types/calendarDto';
import { getCookie, setCookie } from '@/utils';
import { useAtomValue } from 'jotai';

export const useCalendarData = () => {
  const currentCalendarIds = useAtomValue(calendarIdsAtom);

  useEffect(() => {
    if (!getCookie(CALENDAR_COOKIE_KEY)) {
      getCalendarToken().then(res => {
        setCookie(CALENDAR_COOKIE_KEY, res.data.access_token, 1);
      });
    }
  }, []);

  const {
    data: calendarList,
    isLoading: isCalendarListLoading, //
  } = useGetCalendarList();

  const getCalendarColor = (calendarSummary: string) => {
    const findCalendar = calendarList?.items.find(
      ({ summary }) => summary === calendarSummary,
    );
    return findCalendar?.backgroundColor;
  };

  const calendarListByType = useMemo(() => {
    const calendars = calendarList?.items?.filter(
      ({ id }) => id !== CALENDAR_ADDRESS_ID,
    );

    const myCalendarList = calendars
      ?.filter(({ accessRole }) => accessRole === 'owner')
      .sort((a, b) => b.id.localeCompare(a.id)) as Calendar[];

    const subscribeCalendarList = calendars?.filter(
      ({ accessRole }) => accessRole !== 'owner',
    ) as Calendar[];

    return {
      myCalendarList,
      subscribeCalendarList,
    };
  }, [calendarList?.items]);

  const eventsByCalendar = useGetEventsByCalendar(currentCalendarIds || []);

  const eventList = eventsByCalendar
    ?.map(calendar => {
      return calendar?.data?.items.map(item => {
        const backgroundColor = getCalendarColor(calendar?.data?.summary);
        return { ...item, backgroundColor };
      });
    })
    .flat() as (Event & { backgroundColor: string })[];

  const fullCalendarEvents = useMemo(() => {
    return eventList[0]?.summary
      ? eventList?.map(event => ({
          title: event?.summary,
          start: event?.start.dateTime || event?.start.date,
          end: event?.end.dateTime || event?.end.date,
          id: event?.id,
          backgroundColor: event?.backgroundColor,
          allDay: !event?.start?.dateTime && !event?.end?.dateTime,
        }))
      : [];
  }, [eventList]);

  return {
    isCalendarListLoading,
    calendarListByType,
    fullCalendarEvents,
  };
};
