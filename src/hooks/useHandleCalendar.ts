import { useEffect, useMemo } from 'react';

import {
  useGetCalendarList,
  useGetEventsByCalendar,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, Event } from '@/types/calendarDto';
import { useAtom } from 'jotai';

const CALENDAR_ADDRESS_ID = 'addressbook#contacts@group.v.calendar.google.com';

export const useHandleCalendar = () => {
  const [currentCalendarIds, setCurrentCalendarIds] = useAtom(calendarIdsAtom);

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

  useEffect(() => {
    const subscribeCalendarIds = calendarListByType?.subscribeCalendarList?.map(
      calendar => calendar?.id,
    );
    setCurrentCalendarIds(subscribeCalendarIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarListByType?.subscribeCalendarList]);

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
