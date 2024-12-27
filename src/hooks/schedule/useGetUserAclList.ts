import { useMemo } from 'react';

import { useGetAllCalendarAclEmailList } from '@/services/schedule/calendarQueries';

import { useCalendarData } from '@/hooks';

export const useGetUserAclList = () => {
  const { allCourseCalendarList } = useCalendarData();

  const {
    data: aclEmailListByCourse,
    isLoading: isAclEmailListLoading,
    isPending: isAclEmailListPending,
  } = useGetAllCalendarAclEmailList(allCourseCalendarList);

  const isCalendarAclLoading = isAclEmailListPending || isAclEmailListLoading;

  const hasNotAclCalendarList = useMemo(() => {
    return aclEmailListByCourse?.filter(({ hasAcl }) => !hasAcl);
  }, [aclEmailListByCourse]);

  return {
    aclEmailListByCourse,
    isCalendarAclLoading,
    hasNotAclCalendarList,
  };
};
