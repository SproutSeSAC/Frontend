import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { useGrantAcl } from '@/services/schedule/calendarMutations';
import {
  useGetAdminEmailListByCourse,
  useGetCalendarAcl,
  useGetCourseCalendar,
} from '@/services/schedule/calendarQueries';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import { AclEmail, CourseCalendarAcl, UserCourse } from '@/types';

export const useHandleAcl = ({ courseId, courseTitle }: UserCourse) => {
  const { hideDialog, loadingAlert } = useDialogContext();

  const queryClient = useQueryClient();

  const {
    data: adminList, //
    isLoading: isAdminListLoading,
  } = useGetAdminEmailListByCourse(courseId);

  const {
    data: courseCalendar, //
    isLoading: isCourseCalendarLoading,
  } = useGetCourseCalendar(courseId);

  const {
    data: courseCalendarAcl,
    isLoading: isCalendarAclLoading, //
  } = useGetCalendarAcl(courseCalendar?.calendarId);

  const { mutateAsync, isPending: isGrantAclPending } = useGrantAcl({
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

  const grantAcl = (cell: CourseCalendarAcl) => {
    const noEmailToBeAuthorized = cell?.hasNotAclAdminList?.length === 0;
    if (!cell.calendarId || noEmailToBeAuthorized) return;
    const { calendarId, hasNotAclAdminList = [] } = cell;
    mutateAsync({ calendarId, hasNotAclAdminList });
  };

  const courseAclInfo: CourseCalendarAcl = {
    isCreated: !!courseCalendarAcl,

    hasAclAdminList: courseCalendarAcl?.map(acl => {
      const adminData = adminList?.find(({ email }) => email === acl.email);
      const isSuperAdmin = acl.email === SUPER_ADMIN_EMAIL;
      return {
        ...acl,
        nickname: isSuperAdmin ? '관리자' : adminData?.nickname,
        roleType: isSuperAdmin ? 'SUPER_ADMIN' : adminData?.roleType,
      };
    }) as AclEmail[],

    hasNotAclAdminList: adminList?.filter(
      ({ email }) =>
        !courseCalendarAcl?.find(({ email: aclEmail }) => email === aclEmail),
    ),

    courseId,
    courseTitle,
    calendarId: courseCalendar?.calendarId,
  };

  const isLoading =
    isAdminListLoading || isCourseCalendarLoading || isCalendarAclLoading;

  return {
    adminList,
    courseCalendarAcl,
    courseAclInfo,
    grantAcl,
    isLoading,
    isGrantAclPending,
  };
};
