import { useCallback, useEffect, useMemo } from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import {
  getCalendarToken,
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useCourseCalendarList,
  useGetCalendarList,
  useGetEventsByCalendar,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { changeFullCalendarEvents } from '@/utils/getFullCalendarEvents';

import { CALENDAR_ADDRESS_ID, CALENDAR_TOKEN_KEY } from '@/constants';
import { CalenderEvents, Event, FullCalendarEvent } from '@/types';
import { getCookie, setCookie } from '@/utils';
import { useAtom } from 'jotai';

export const useCalendarData = () => {
  const [currShowingCalendarIds, setCurrShowingCalendarIds] =
    useAtom(calendarIdsAtom);

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { courseList } = userProfile;

  const { data: courseCalendarInfoList = [] } =
    useCourseCalendarList(courseList);

  const {
    data: calendarList,
    isLoading: isCalendarListLoading, //
  } = useGetCalendarList();

  const allCalendars = useMemo(() => {
    return calendarList?.items?.filter(({ id }) => id !== CALENDAR_ADDRESS_ID);
  }, [calendarList?.items]);

  const courseCalendarList = useMemo(() => {
    const findCourseCalendarInMyCalendarList = (calendarId: string) =>
      allCalendars?.find(({ id }) => id === calendarId);

    const result = courseCalendarInfoList
      .map(info => {
        const createdCalendarDetails = info.isCreated
          ? findCourseCalendarInMyCalendarList(info.calendarId)
          : {};

        return {
          ...info,
          ...createdCalendarDetails,
        };
      })
      ?.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));

    return result;
  }, [allCalendars, courseCalendarInfoList]);

  const personalCalendarList = useMemo(() => {
    const ids = courseCalendarInfoList.map(item => item.calendarId);
    return allCalendars
      ? allCalendars
          ?.filter(({ id }) => !ids?.includes(id))
          ?.filter(({ accessRole }) => accessRole === 'owner')
      : [];
  }, [allCalendars, courseCalendarInfoList]);

  useEffect(() => {
    if (!getCookie(CALENDAR_TOKEN_KEY)) {
      getCalendarToken().then(res => {
        setCookie(CALENDAR_TOKEN_KEY, res?.data?.access_token, 1);
      });
    }
  }, []);

  useEffect(() => {
    const courseCalendarIdList = courseCalendarInfoList
      .filter(({ isCreated }) => isCreated)
      .map(({ calendarId }) => calendarId);

    if (courseCalendarIdList?.length !== 0) {
      setCurrShowingCalendarIds(courseCalendarIdList);
    }
  }, [setCurrShowingCalendarIds, courseCalendarInfoList]);

  const getCalendarColor = useMemo(() => {
    return (calendarSummary: string) => {
      const findCalendar = calendarList?.items?.find(
        ({ summary }) => summary === calendarSummary,
      );
      return findCalendar?.backgroundColor;
    };
  }, [calendarList?.items]);

  // 이벤트 리스트
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

  const createdCourseCalendarIds = courseCalendarList
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
    isCalendarListLoading,
    courseCalendarList,
    personalCalendarList,
    fullCalendarEvents,
    fullCalendarCourseEvents,
  };
};
