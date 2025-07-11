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

  // 맨처음 로컬스토리지에 값 없으면 다 저장.
  // 로컬스토리지에 값 가져오기
  useEffect(() => {
    const courseCalendarIdList = courseCalendarList
      .filter(({ calendarId }) => calendarId)
      .map(({ calendarId }) => calendarId);

    // const selectedCourseCalendarIdList = localStorage
    //   .getItem('selectedCourseCalendarIdList')
    //   ?.split(', ');

    // if (
    //   !selectedCourseCalendarIdList ||
    //   selectedCourseCalendarIdList?.length === 0
    // ) {
    //   localStorage.setItem(
    //     'selectedCourseCalendarIdList',
    //     courseCalendarIdList.join(', '),
    //   );
    // }

    if (courseCalendarIdList?.length !== 0) {
      setCurrShowingCalendarIds(courseCalendarIdList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseCalendarList]);

  return {
    allCalendarList,
    courseCalendarList,
    personalCalendarList,
    isCalendarDataLoading,
    isCourseCalendarStatusLoading,
  };
};
