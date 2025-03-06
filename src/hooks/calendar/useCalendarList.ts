import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCalendarList,
  useGetCourseCalendarStatusList,
} from '@/services/calendar/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CALENDAR_ADDRESS_ID, CALENDAR_TOKEN_KEY } from '@/constants';
import { Calendar } from '@/types';
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

  // 교육과정 캘린더
  const courseCalendarList = useMemo(() => {
    const findCourseCalendar = (calendarId: string) =>
      allCalendarList?.find(({ id }) => id === calendarId);

    return courseCalendarStatusList.map(courseCalendar => {
      const createdCalendarDetails: Calendar =
        findCourseCalendar(courseCalendar.calendarId) ?? {};
      return { ...courseCalendar, ...createdCalendarDetails };
    });
  }, [allCalendarList, courseCalendarStatusList]);

  // 개인 캘린더
  const personalCalendarList = useMemo(() => {
    const courseCalendarIdList = courseCalendarStatusList.map(
      ({ calendarId }) => calendarId,
    );
    return allCalendarList?.filter(
      ({ id, accessRole }) =>
        accessRole === 'owner' && !courseCalendarIdList?.includes(id),
    );
  }, [allCalendarList, courseCalendarStatusList]);

  useEffect(() => {
    const calendarAccessToken = sessionStorage.getItem(CALENDAR_TOKEN_KEY);
    if (!calendarAccessToken) {
      getCalendarToken();
    }
  }, []);

  useEffect(() => {
    const courseCalendarIdList = courseCalendarList
      .filter(detail => detail?.accessRole)
      .map(({ calendarId }) => calendarId);

    if (courseCalendarIdList?.length !== 0) {
      setCurrShowingCalendarIds(courseCalendarIdList);
    }
  }, [setCurrShowingCalendarIds, courseCalendarList]);

  return {
    allCalendarList,
    courseCalendarList,
    personalCalendarList,
    isCalendarDataLoading,
    isCourseCalendarStatusLoading,
  };
};
