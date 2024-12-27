import { useCallback, useMemo } from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import { useCalendarData } from '@/hooks/schedule/useCalendarData';

import { useGetEventsByCalendar } from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CalenderEvents, Event, FullCalendarEvent } from '@/types';
import { changeFullCalendarEvents } from '@/utils';
import { useAtomValue } from 'jotai';

export const useCalendarEvents = () => {
  const currShowingCalendarIds = useAtomValue(calendarIdsAtom);

  const { allCalendarList, allCourseCalendarList } = useCalendarData();

  const getCalendarColor = useMemo(() => {
    return (calendarSummary: string) =>
      allCalendarList?.find(({ summary }) => summary === calendarSummary)
        .backgroundColor;
  }, [allCalendarList]);

  const getEventList = useCallback(
    (events: UseQueryResult<CalenderEvents, Error>[]) => {
      return events
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
      })[];
    },
    [getCalendarColor],
  );

  const eventsByCalendar = useGetEventsByCalendar(currShowingCalendarIds || []);

  const fullCalendarEvents: FullCalendarEvent[] = useMemo(() => {
    const eventList = getEventList(eventsByCalendar);
    return changeFullCalendarEvents(eventList);
  }, [eventsByCalendar, getEventList]);

  const createdCourseCalendarIds = allCourseCalendarList
    .filter(({ calendarId }) => !!calendarId)
    .map(({ calendarId }) => calendarId);

  const courseEventsByCalendar = useGetEventsByCalendar(
    createdCourseCalendarIds,
  );

  const fullCalendarCourseEvents: FullCalendarEvent[] = useMemo(() => {
    const eventList = getEventList(courseEventsByCalendar);
    return changeFullCalendarEvents(eventList);
  }, [courseEventsByCalendar, getEventList]);

  return {
    fullCalendarEvents,
    fullCalendarCourseEvents,
  };
};
