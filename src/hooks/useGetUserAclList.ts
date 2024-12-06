import { useMemo } from 'react';

import { useCalendarData } from '@/hooks/useCalendarData';

import {
  UserCalendarInfo,
  useGetAllCalendarAclList,
} from '@/services/schedule/calendarQueries';

// 유저의 캘린더별 권한 리스트 가져오기
export const useGetUserAclList = () => {
  const { courseCalendarList } = useCalendarData();

  const userCourseCalendarList = useMemo(() => {
    const result: UserCalendarInfo[] = courseCalendarList.map(
      ({ courseTitle, calendarId, isCreated, courseId }) => ({
        courseTitle,
        courseId,
        calendarId,
        isCreated,
      }),
    );
    return result;
  }, [courseCalendarList]);

  const { data: userAclList = [], isLoading: isUserAclListLoading } =
    useGetAllCalendarAclList(userCourseCalendarList);

  const hasNotAclCalendarList = useMemo(() => {
    return userAclList.filter(({ hasAcl }) => !hasAcl);
  }, [userAclList]);

  return {
    userAclList,
    isUserAclListLoading,
    hasNotAclCalendarList,
  };
};
