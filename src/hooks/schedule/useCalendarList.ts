import { useEffect, useMemo } from 'react';

import {
  getCalendarToken,
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useCourseCalendarList,
  useGetCalendarList,
} from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { CALENDAR_ADDRESS_ID, CALENDAR_TOKEN_KEY } from '@/constants';
import { Calendar } from '@/types';
import { getCookie, setCookie } from '@/utils';
import { useSetAtom } from 'jotai';

export const useCalendarList = () => {
  const setCurrShowingCalendarIds = useSetAtom(calendarIdsAtom);

  const {
    data: calendarData,
    isLoading: isCalendarDataLoading, //
  } = useGetCalendarList();

  const allCalendarList = useMemo(() => {
    return calendarData?.items?.filter(({ id }) => id !== CALENDAR_ADDRESS_ID);
  }, [calendarData?.items]);

  const { data: { courseList } = initialUserProfile } = useGetUserProfile();

  const { data: allCourseCalendarStatusListData = [] } =
    useCourseCalendarList(courseList);

  const allCourseCalendarList = useMemo(() => {
    const findCourseCalendarInMyCalendarList = (calendarId: string) =>
      allCalendarList?.find(({ id }) => id === calendarId);

    return allCourseCalendarStatusListData
      ?.map(courseCalendar => {
        const createdCalendarDetails: Calendar =
          findCourseCalendarInMyCalendarList(courseCalendar.calendarId) ?? {};
        return { ...courseCalendar, ...createdCalendarDetails };
      })
      ?.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
  }, [allCalendarList, allCourseCalendarStatusListData]);

  const personalCalendarList = useMemo(() => {
    const ids = allCourseCalendarStatusListData.map(item => item.calendarId);
    return allCalendarList
      ? allCalendarList
          ?.filter(({ id }) => !ids?.includes(id))
          ?.filter(({ accessRole }) => accessRole === 'owner')
      : [];
  }, [allCalendarList, allCourseCalendarStatusListData]);

  useEffect(() => {
    if (!getCookie(CALENDAR_TOKEN_KEY)) {
      getCalendarToken().then(res => {
        setCookie(CALENDAR_TOKEN_KEY, res?.data?.access_token, 1);
      });
    }
  }, []);

  useEffect(() => {
    const courseCalendarIdList = allCourseCalendarList
      .filter(detail => detail?.accessRole === 'owner')
      .map(({ calendarId }) => calendarId);

    if (courseCalendarIdList?.length !== 0) {
      setCurrShowingCalendarIds(courseCalendarIdList);
    }
  }, [setCurrShowingCalendarIds, allCourseCalendarList]);

  return {
    isCalendarDataLoading,
    allCalendarList,
    allCourseCalendarList,
    personalCalendarList,
  };
};
