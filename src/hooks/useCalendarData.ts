import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';
import {
  useGetCalendarIdByCourse,
  useGetCalendarList,
  useGetEventsByCalendar,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CALENDAR_ADDRESS_ID, CALENDAR_KEY } from '@/constants';
import { Event } from '@/types';
import { getCookie, setCookie } from '@/utils';
import { useAtom } from 'jotai';

export const useCalendarData = () => {
  const [currCalendarIds, setCurrCalendarIds] = useAtom(calendarIdsAtom);

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

  // NOTE: API가 변경되어 교육과정 ID를 바로 내려주면 삭제 예정
  const { data: userProfile } = useGetUserProfile();
  const { data: campusList } = useGetCampusList();
  const userCampus = campusList?.find(
    ({ name }) => name === userProfile?.campusName,
  );
  const { data: courseList } = useGetCourseList(userCampus?.id);
  const userCourse = courseList?.find(
    ({ title }) => title === userProfile?.courseTitle,
  );
  const { data: calendarIdByCourse } = useGetCalendarIdByCourse(userCourse?.id);
  const sproutCalendarIds = useMemo(() => {
    return calendarIdByCourse?.calendarId
      ? [calendarIdByCourse?.calendarId]
      : [];
  }, [calendarIdByCourse?.calendarId]);
  // -----------------------------------

  const allCalendars = useMemo(() => {
    return calendarList?.items
      ?.filter(({ id }) => id !== CALENDAR_ADDRESS_ID)
      ?.sort((a, b) => b.id.localeCompare(a.id));
  }, [calendarList?.items]);

  const sproutCalendars = useMemo(() => {
    return allCalendars
      ? allCalendars?.filter(({ id }) => sproutCalendarIds.includes(id))
      : [];
  }, [allCalendars, sproutCalendarIds]);

  const nonSproutCalendars = useMemo(() => {
    return allCalendars
      ? allCalendars?.filter(({ id }) => !sproutCalendarIds.includes(id))
      : [];
  }, [allCalendars, sproutCalendarIds]);

  const eventsByCalendar = useGetEventsByCalendar(currCalendarIds || []);

  const eventList = eventsByCalendar
    ?.map(calendar => {
      return calendar?.data?.items.map(item => {
        const backgroundColor = getCalendarColor(calendar?.data?.summary);
        return { ...item, backgroundColor };
      });
    })
    .flat() as unknown as (Event & { backgroundColor: string })[];

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

  useEffect(() => {
    if (!getCookie(CALENDAR_KEY)) {
      getCalendarToken().then(res => {
        setCookie(CALENDAR_KEY, res.data.access_token, 1);
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
    nonSproutCalendars,
    fullCalendarEvents,
  };
};
