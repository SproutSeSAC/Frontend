import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCalendarIdByCourse,
  useGetCalendarList,
  useGetEventsByCalendar,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CALENDAR_ADDRESS_ID, CALENDAR_TOKEN_KEY } from '@/constants';
import { Event, FullCalendarEvent } from '@/types';
import { createRrule, getCookie, setCookie } from '@/utils';
import { useAtom } from 'jotai';

export const useCalendarData = () => {
  const [currCalendarIds, setCurrCalendarIds] = useAtom(calendarIdsAtom);

  const {
    data: calendarList,
    isLoading: isCalendarListLoading, //
  } = useGetCalendarList();

  const { data: userProfile } = useGetUserProfile();

  const { data: calendarIdByCourse } = useGetCalendarIdByCourse(
    userProfile?.courseList[0]?.courseId,
  );

  const sproutCalendarIds = useMemo(() => {
    return calendarIdByCourse?.calendarId
      ? [calendarIdByCourse?.calendarId]
      : [];
  }, [calendarIdByCourse?.calendarId]);

  const allCalendars = useMemo(() => {
    return calendarList?.items
      ?.filter(({ id }) => id !== CALENDAR_ADDRESS_ID)
      ?.sort((a, b) => b.id.localeCompare(a.id));
  }, [calendarList?.items]);

  const sproutCalendars = useMemo(() => {
    return allCalendars
      ? allCalendars
          ?.filter(({ id }) => sproutCalendarIds.includes(id))
          ?.sort((a, b) => b.id.localeCompare(a.id))
      : [];
  }, [allCalendars, sproutCalendarIds]);

  const personalCalendars = useMemo(() => {
    return allCalendars
      ? allCalendars
          ?.filter(({ id }) => !sproutCalendarIds.includes(id))
          ?.filter(({ accessRole }) => accessRole === 'owner')
      : [];
  }, [allCalendars, sproutCalendarIds]);

  const eventsByCalendar = useGetEventsByCalendar(currCalendarIds || []);

  const fullCalendarEvents: FullCalendarEvent[] = useMemo(() => {
    const getCalendarColor = (calendarSummary: string) => {
      const findCalendar = calendarList?.items?.find(
        ({ summary }) => summary === calendarSummary,
      );
      return findCalendar?.backgroundColor;
    };

    const eventList =
      eventsByCalendar?.length !== 0
        ? (eventsByCalendar
            ?.map(calendar => {
              const summary = calendar?.data?.summary ?? '';
              return calendar?.data?.items.map(item => {
                const backgroundColor = getCalendarColor(summary);
                return { ...item, backgroundColor };
              });
            })
            ?.flat()
            ?.filter(item => item?.status === 'confirmed') as (Event & {
            backgroundColor: string;
          })[])
        : [];

    const recurringEvents = eventList
      .filter(event => event?.recurringEventId)
      .map(event => ({
        recurringEventId: event.recurringEventId,
        start: event?.start?.dateTime || event?.start?.date,
      }));

    return eventList && eventList[0]?.summary
      ? eventList
          ?.map(event => {
            const start = event?.start?.dateTime || event?.start?.date;
            const end = event?.end?.dateTime || event?.end?.date;

            const defaultEvent = {
              title: event?.summary ?? '제목없음',
              start,
              end,
              id: event?.id,
              backgroundColor: event?.backgroundColor,
              allDay: !event?.start?.dateTime && !event?.end?.dateTime,
            };

            const exdate = recurringEvents
              .filter(({ recurringEventId }) => recurringEventId === event.id)
              .map(item => item.start);

            return event?.recurrence
              ? {
                  ...defaultEvent,
                  rrule: {
                    ...createRrule(event.recurrence[0]),
                    dtstart: start,
                  },
                  exdate,
                }
              : defaultEvent;
          })
          ?.sort((a, b) => a.start.localeCompare(b.start))
      : [];
  }, [calendarList?.items, eventsByCalendar]);

  useEffect(() => {
    if (!getCookie(CALENDAR_TOKEN_KEY)) {
      getCalendarToken().then(res => {
        setCookie(CALENDAR_TOKEN_KEY, res?.data?.access_token, 1);
      });
    }
  }, []);

  useEffect(() => {
    if (sproutCalendarIds.length !== 0) {
      setCurrCalendarIds(sproutCalendarIds);
    }
  }, [setCurrCalendarIds, sproutCalendarIds]);

  return {
    isCalendarListLoading,
    sproutCalendars,
    personalCalendars,
    fullCalendarEvents,
  };
};
