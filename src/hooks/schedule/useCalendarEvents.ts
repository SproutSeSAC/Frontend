import { useCallback, useMemo } from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import { useGetEventsByCalendar } from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { useCalendarList } from '@/hooks';
import { EventWithId, FullCalendarEvent, GoogleCalendarApiDto } from '@/types';
import { changeFullCalendarEvents } from '@/utils';
import { useAtomValue } from 'jotai';

export const useCalendarEvents = () => {
  const currShowingCalendarIds = useAtomValue(calendarIdsAtom);

  const { allCalendarList, allCourseCalendarList } = useCalendarList();

  const getCalendarColor = useMemo(() => {
    return (calendarSummary: string) =>
      allCalendarList?.find(({ summary }) => summary === calendarSummary)
        ?.backgroundColor;
  }, [allCalendarList]);

  const getEventList = useCallback(
    (
      events: UseQueryResult<GoogleCalendarApiDto.GetCalenderEvents, Error>[],
    ) => {
      return events
        ?.map(calendar => {
          const calendarId = calendar.data?.calendarId ?? '';
          const summary = calendar?.data?.summary ?? '';

          return calendar?.data?.items.map(item => {
            const backgroundColor = getCalendarColor(summary);
            return { ...item, calendarId, backgroundColor };
          });
        })
        ?.flat()
        ?.filter(item => item?.status === 'confirmed') as EventWithId[];
    },
    [getCalendarColor],
  );

  const eventsByCalendar = useGetEventsByCalendar(currShowingCalendarIds || []);

  const createdCourseCalendarIdList = useMemo(() => {
    return allCourseCalendarList
      .filter(calendar => calendar.accessRole === 'owner')
      .map(({ calendarId }) => calendarId);
  }, [allCourseCalendarList]);

  const createdCourseCalendarEventList = useGetEventsByCalendar(
    createdCourseCalendarIdList,
  );

  // 현재 선택된 캘린더의 이벤트 목록
  const fullCalendarEvents: FullCalendarEvent[] = useMemo(() => {
    const eventList = getEventList(eventsByCalendar);
    return changeFullCalendarEvents(eventList);
  }, [eventsByCalendar, getEventList]);

  // 사이드뷰의 근시일 이벤트 목록
  const fullCalendarSideViewEvents: FullCalendarEvent[] = useMemo(() => {
    const eventList = getEventList(createdCourseCalendarEventList);

    const today = new Date();
    today.setDate(today.getDate() - 1);

    const sideViewEventList = changeFullCalendarEvents(eventList);

    return sideViewEventList
      ?.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= today;
      })
      ?.slice(0, 4);
  }, [createdCourseCalendarEventList, getEventList]);

  return {
    fullCalendarEvents,
    fullCalendarSideViewEvents,
  };
};
