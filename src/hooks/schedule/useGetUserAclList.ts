import { useMemo } from 'react';

import {
  UserCalendarInfo,
  useGetAllCalendarAclEmailList,
  useGetAllUserCalendarAclList,
} from '@/services/schedule/calendarQueries';

import { useCalendarData } from '@/hooks';

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

  const {
    data: aclEmailListByCourse,
    isLoading: isAclEmailListLoading,
    isPending: isAclEmailListPending,
  } = useGetAllCalendarAclEmailList(userCourseCalendarList);

  const isCalendarAclLoading = isAclEmailListPending || isAclEmailListLoading;

  const { data: userAclList = [], isLoading: isUserAclListLoading } =
    useGetAllUserCalendarAclList(userCourseCalendarList);

  const hasNotAclCalendarList = useMemo(() => {
    return userAclList.filter(({ hasAcl }) => !hasAcl);
  }, [userAclList]);

  return {
    aclEmailListByCourse,
    isCalendarAclLoading,
    userAclList,
    isUserAclListLoading,
    hasNotAclCalendarList,
  };
};
