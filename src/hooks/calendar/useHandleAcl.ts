import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useGrantAcl } from '@/services/calendar/calendarMutations';
import { useGetCalendarAcl } from '@/services/calendar/calendarQueries';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import { useDialogContext } from '@/hooks';
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
    data: calendarAclList,
    isLoading: isCalendarAclLoading, //
  } = useGetCalendarAcl(courseId, calendarId);

  const getHasAclAdminList = useCallback(() => {
    if (typeof calendarAclList === 'string') return [];

    const superAdminObj = {
      roleType: 'SUPER_ADMIN' as const,
      email: SUPER_ADMIN_EMAIL,
      nickname: '새싹 관리자',
      name: '관리자',
    };

    return calendarAclList
      ?.filter(acl => {
        const hasAclAdmin = [...adminList, superAdminObj]?.find(
          ({ email }) => email === acl.email,
        );
        return !!hasAclAdmin;
      })
      .map(acl => {
        const hasAclAdmin = [...adminList, superAdminObj]?.find(
          ({ email }) => email === acl.email,
        );
        return { ...acl, ...hasAclAdmin };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [adminList, calendarAclList]);

  const getHasNotAclAdminList = useCallback(() => {
    if (typeof calendarAclList === 'string') return [];
    return adminList
      .filter(
        ({ email }) =>
          !calendarAclList?.find(({ email: aclEmail }) => email === aclEmail),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [adminList, calendarAclList]);

  const getCalendarStatus = () => {
    if (!calendarId) return 'Not Created';

    if (calendarAclList === 'Not Found' || calendarAclList === 'Forbidden')
      return calendarAclList;

    return 'Created';
  };

  const calendarStatus: CourseCalendarAcl['status'] = getCalendarStatus();

  const courseAclInfo: CourseCalendarAcl = {
    courseId,
    status: calendarStatus,
    calendarId,
    hasAclAdminList: getHasAclAdminList(),
    hasNotAclAdminList: getHasNotAclAdminList(),
  };

  return {
    courseAclInfo,
    onGrantAclClick,
    isCalendarAclLoading,
    isGrantAclPending,
  };
};
