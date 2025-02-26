import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { useGrantAcl } from '@/services/calendar/calendarMutations';
import { useGetCalendarAcl } from '@/services/calendar/calendarQueries';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import { AdminEmail, CourseCalendarAcl } from '@/types';

interface UseHandleAclProps {
  courseId: number;
  calendarId: string;
  adminList: AdminEmail[];
}

export const useHandleAcl = ({
  courseId,
  calendarId,
  adminList,
}: UseHandleAclProps) => {
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
        queryKey: ['useGetCalendarAcl', courseId],
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
    data: courseCalendarAcl,
    isLoading: isCalendarAclLoading, //
  } = useGetCalendarAcl(courseId, calendarId);

  const getHasAclAdminList = useCallback(() => {
    return courseCalendarAcl?.map(acl => {
      const superAdminObj = {
        roleType: 'SUPER_ADMIN' as const,
        email: SUPER_ADMIN_EMAIL,
        nickname: '새싹 관리자',
        name: '관리자',
      };

      const admin = [...adminList, superAdminObj]?.find(
        ({ email }) => email === acl.email,
      );

      if (!admin) return acl;
      return { ...acl, ...admin };
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
    isCreated: !!calendarId,
    calendarId,
    hasAclAdminList: getHasAclAdminList(),
    hasNotAclAdminList: getHasNotAclAdminList(),
  };

  return {
    adminList,
    courseCalendarAcl,
    courseAclInfo,
    onGrantAclClick,
    isCalendarAclLoading,
    isGrantAclPending,
  };
};
