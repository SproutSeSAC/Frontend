import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';
import { useCourseData } from '@/hooks/course/useCourseData';

import { useGrantAcl } from '@/services/schedule/calendarMutations';
import { useGetCalendarAcl } from '@/services/schedule/calendarQueries';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import { AdminEmail, CourseCalendarAcl } from '@/types';

export const useHandleAcl = ({
  courseId,
  calendarId,
}: {
  courseId: number;
  calendarId: string;
}) => {
  const { hideDialog, loadingAlert } = useDialogContext();

  const queryClient = useQueryClient();

  // 권한 부여
  const { mutateAsync: grantAcl, isPending: isGrantAclPending } = useGrantAcl({
    onMutate: async () => {
      loadingAlert({
        text: '권한 부여중입니다... 잠시만 기다려주세요.',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetCalendarAcl'],
      });
      hideDialog();
    },
  });

  const onGrantAclClick = (calId: string, hasNotAclAdminList: AdminEmail[]) => {
    const noEmailToBeAuthorized = hasNotAclAdminList?.length === 0;
    if (!calId || noEmailToBeAuthorized) return;
    grantAcl({ calendarId: calId, hasNotAclAdminList });
  };

  const {
    adminList,
    courseCalendar,
    isAdminListLoading,
    isCourseCalendarLoading,
  } = useCourseData({ courseId });

  const {
    data: courseCalendarAcl,
    isLoading: isCalendarAclLoading, //
  } = useGetCalendarAcl(courseId, calendarId);

  const getHasAclAdminList = useCallback(() => {
    return courseCalendarAcl?.map(acl => {
      const admin = adminList?.find(({ email }) => email === acl.email);

      if (!admin) return acl;

      const isSuperAdmin = acl.email === SUPER_ADMIN_EMAIL;
      return {
        ...acl,
        nickname: isSuperAdmin ? '관리자' : admin?.nickname,
        name: isSuperAdmin ? '관리자' : admin?.name,
        roleType: isSuperAdmin ? 'SUPER_ADMIN' : admin?.roleType,
      };
    });
  }, [adminList, courseCalendarAcl]);

  const getHasNotAclAdminList = useCallback(() => {
    return adminList.filter(
      ({ email }) =>
        !courseCalendarAcl?.find(({ email: aclEmail }) => email === aclEmail),
    );
  }, [adminList, courseCalendarAcl]);

  const courseAclInfo: CourseCalendarAcl = {
    courseId,
    isCreated: !!courseCalendar?.calendarId,
    calendarId: courseCalendar?.calendarId,
    hasAclAdminList: getHasAclAdminList(),
    hasNotAclAdminList: getHasNotAclAdminList(),
  };

  const isLoading =
    isAdminListLoading || isCourseCalendarLoading || isCalendarAclLoading;

  return {
    adminList,
    courseCalendarAcl,
    courseAclInfo,
    onGrantAclClick,
    isLoading,
    isGrantAclPending,
    courseCalendar,
  };
};
