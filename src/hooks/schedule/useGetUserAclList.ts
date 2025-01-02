import { useMemo } from 'react';

import { useGetAllCalendarAclEmailList } from '@/services/schedule/calendarQueries';

import { useCalendarList } from '@/hooks';

export const useGetUserAclList = () => {
  const { allCourseCalendarList } = useCalendarList();

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
