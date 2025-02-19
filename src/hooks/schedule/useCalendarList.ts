import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCalendarList,
  useGetCourseCalendarStatusList,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CALENDAR_ADDRESS_ID, CALENDAR_TOKEN_KEY } from '@/constants';
import { Calendar } from '@/types';
import { getCookie, setCookie } from '@/utils';
import { useSetAtom } from 'jotai';

export const useCalendarList = () => {
  const setCurrShowingCalendarIds = useSetAtom(calendarIdsAtom);

  const { data: userProfile } = useGetUserProfile();

  const {
    data: calendarData,
    isLoading: isCalendarDataLoading, //
  } = useGetCalendarList();

  const allCalendarList = useMemo(() => {
    if (isCalendarDataLoading) return [];
    return calendarData?.items?.filter(({ id }) => id !== CALENDAR_ADDRESS_ID);
  }, [calendarData?.items, isCalendarDataLoading]);

  const {
    data: courseCalendarStatusList = [],
    isLoading: isCourseCalendarStatusLoading,
  } = useGetCourseCalendarStatusList(userProfile?.courseList || []);

  const courseCalendarList = useMemo(() => {
    if (isCalendarDataLoading || isCourseCalendarStatusLoading) return [];

    const findCourseCalendar = (calendarId: string) =>
      allCalendarList?.find(({ id }) => id === calendarId);

    return courseCalendarStatusList.map(courseCalendar => {
      const createdCalendarDetails: Calendar =
        findCourseCalendar(courseCalendar.calendarId) ?? {};

      return { ...courseCalendar, ...createdCalendarDetails };
    });
  }, [
    allCalendarList,
    courseCalendarStatusList,
    isCalendarDataLoading,
    isCourseCalendarStatusLoading,
  ]);

  // 개인 캘린더
  const personalCalendarList = useMemo(() => {
    if (isCalendarDataLoading) return [];

    const courseCalendarIdList = courseCalendarStatusList.map(
      ({ calendarId }) => calendarId,
    );

    return allCalendarList?.filter(
      ({ id, accessRole }) =>
        accessRole === 'owner' && !courseCalendarIdList?.includes(id),
    );
  }, [allCalendarList, courseCalendarStatusList, isCalendarDataLoading]);

  useEffect(() => {
    if (!getCookie(CALENDAR_TOKEN_KEY)) {
      getCalendarToken().then(res => {
        setCookie(CALENDAR_TOKEN_KEY, res?.data?.access_token, 1);
      });
    }
  }, []);

  useEffect(() => {
    const courseCalendarIdList = courseCalendarList
      .filter(detail => detail?.accessRole === 'owner')
      .map(({ calendarId }) => calendarId);

    if (courseCalendarIdList?.length !== 0) {
      setCurrShowingCalendarIds(courseCalendarIdList);
    }
  }, [setCurrShowingCalendarIds, courseCalendarList]);

  return {
    isCalendarDataLoading,
    allCalendarList,
    courseCalendarList,
    personalCalendarList,
  };
};
