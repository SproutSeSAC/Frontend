import { useCallback, useMemo } from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import { useGetEventsByCalendar } from '@/services/calendar/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { useCalendarList } from '@/hooks';
import { EventWithId, FullCalendarEvent, GoogleCalendarApiDto } from '@/types';
import { changeFullCalendarEvents } from '@/utils';
import { useAtomValue } from 'jotai';

export const useCalendarEvents = () => {
  const currShowingCalendarIds = useAtomValue(calendarIdsAtom);

  const { allCalendarList, courseCalendarList } = useCalendarList();

  const getCalendarColor = useMemo(() => {
    return (calendarId: string) =>
      allCalendarList?.find(({ id }) => id === calendarId)?.backgroundColor;
  }, [allCalendarList]);

  const getEventList: (
    eventsByCalendar: UseQueryResult<
      GoogleCalendarApiDto.GetCalenderEvents,
      Error
    >[],
  ) => EventWithId[] = useCallback(
    eventsByCalendar => {
      return eventsByCalendar
        ?.map(({ isLoading, data }) => {
          if (isLoading || !data) return data;
          const { calendarId, items: eventList } = data;
          return eventList?.map(event => {
            if (calendarId) {
              const backgroundColor = getCalendarColor(calendarId);
              return { ...event, calendarId, backgroundColor };
            }
            return { ...event, calendarId };
          });
        })
        ?.flat()
        ?.filter(item => item?.status === 'confirmed') as EventWithId[];
    },
    [getCalendarColor],
  );

  const eventsByCalendar = useGetEventsByCalendar(currShowingCalendarIds || []);

  // 생성된 교육과정 캘린더 ID들
  const courseCalendarIdList = useMemo(() => {
    return courseCalendarList
      .filter(({ accessRole }) => accessRole)
      .map(({ calendarId }) => calendarId);
  }, [courseCalendarList]);

  const courseCalendarEventList = useGetEventsByCalendar(courseCalendarIdList);

  // 현재 선택된 캘린더의 이벤트 목록
  const fullCalendarEvents: FullCalendarEvent[] = useMemo(() => {
    if (eventsByCalendar.length === 0) return [];

    const eventList = getEventList(eventsByCalendar);
    return changeFullCalendarEvents(eventList);
  }, [eventsByCalendar, getEventList]);

  // 사이드뷰의 근시일 이벤트 목록
  const fullCalendarSideViewEvents: FullCalendarEvent[] = useMemo(() => {
    const eventListByCalendar = getEventList(courseCalendarEventList);
    const courseEventList = changeFullCalendarEvents(eventListByCalendar);
    const today = new Date();

    return courseEventList
      ?.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= today;
      })
      ?.slice(0, 4);
  }, [courseCalendarEventList, getEventList]);

  const isCourseCalendarLoadingArr: boolean[] = courseCalendarEventList.map(
    item => item.isLoading,
  );

  return {
    fullCalendarEvents,
    fullCalendarSideViewEvents,
    isCourseCalendarLoadingArr,
  };
};
