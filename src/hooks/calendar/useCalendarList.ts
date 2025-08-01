import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useGetCalendarList,
  useGetCourseWithCalendarList,
} from '@/services/calendar/calendarQueries';

import { CALENDAR_ADDRESS_ID, CALENDAR_TOKEN_KEY } from '@/constants';
import { Calendar } from '@/types';

/**
 * 구글 캘린더 데이터 관련 훅
 */
export const useCalendarList = () => {
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
    data: courseWithCalendarIdList = [],
    isLoading: isCourseCalendarStatusLoading,
  } = useGetCourseWithCalendarList(userProfile?.courseList || []);

  // 교육과정 캘린더
  const courseCalendarList = useMemo(() => {
    const findCourseCalendar = (calendarId?: string) =>
      allCalendarList?.find(({ id }) => id === calendarId);

    return courseWithCalendarIdList.map(courseCalendar => {
      const createdCalendarDetails: Calendar =
        findCourseCalendar(courseCalendar.calendarId) ?? {};
      return { ...courseCalendar, ...createdCalendarDetails };
    });
  }, [allCalendarList, courseWithCalendarIdList]);

  // // 개인 캘린더
  const personalCalendarList = useMemo(() => {
    const courseCalendarIdList = courseWithCalendarIdList.map(
      ({ calendarId }) => calendarId,
    );
    return allCalendarList?.filter(
      ({ id, accessRole }) =>
        accessRole === 'owner' && !courseCalendarIdList?.includes(id),
    );
  }, [allCalendarList, courseWithCalendarIdList]);

  useEffect(() => {
    const calendarAccessToken = sessionStorage.getItem(CALENDAR_TOKEN_KEY);
    if (!calendarAccessToken) {
      getCalendarToken();
    }
  }, []);

  return {
    allCalendarList,
    courseCalendarList,
    personalCalendarList,
    isCalendarDataLoading,
    isCourseCalendarStatusLoading,
  };
};
