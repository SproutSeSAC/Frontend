import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import {
  useCreateCalendar,
  useGrantAcl,
} from '@/services/schedule/calendarMutations';
import {
  getCalendarAcl,
  useGetAdminEmailListByCourse,
  useGetCalendarAcl,
  useGetCourseCalendarStatus,
} from '@/services/schedule/calendarQueries';

import { SUPER_ADMIN_EMAIL } from '@/constants';
import {
  AclEmail,
  AdminEmail,
  Calendar,
  CourseCalendarAcl,
  UserCourse,
} from '@/types';

export const useHandleAcl = ({ courseId, courseTitle }: UserCourse) => {
  const { hideDialog, loadingAlert } = useDialogContext();

  const queryClient = useQueryClient();

  // 교육과정을 담당하는 모든 어드민 이메일 리스트 얻기
  const {
    data: adminList = [], //
    isLoading: isAdminListLoading,
  } = useGetAdminEmailListByCourse(courseId);

  // 교육과정 캘린더 상태 가져오기 - 생성되어있으면 캘린더 아이디 정보 있고 생성되지 않으면 캘린더 아이디 정보 없음.
  const {
    data: courseCalendar, //
    isLoading: isCourseCalendarLoading,
  } = useGetCourseCalendarStatus(courseId);

  // 생성된 캘린더에 대한 권한을 가진 이메일 리스트 얻기
  const {
    data: courseCalendarAcl,
    isLoading: isCalendarAclLoading, //
  } = useGetCalendarAcl(courseId, courseCalendar?.calendarId);

  // 권한 부여하기
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

  // 새로운 캘린더 생성하기
  const {
    mutateAsync: createCalendar,
    isPending: isCreateCalendarPending, //
  } = useCreateCalendar({
    onMutate: async () => {
      loadingAlert({ text: '캘린더 생성 중입니다... 잠시만 기다려주세요' });
    },
    onSuccess: async data => {
      await queryClient.fetchQuery({
        queryKey: ['useGetCourseCalendarStatus', courseId],
      });

      if ((data as Calendar).id) {
        const newCalendarId = (data as Calendar).id;

        await queryClient.invalidateQueries({
          queryKey: ['useGetCalendarAcl', courseId],
        });

        await queryClient.fetchQuery({
          queryKey: ['useGetCalendarAcl', courseId],
          queryFn: () => getCalendarAcl(newCalendarId),
        });

        await queryClient
          .fetchQuery({
            queryKey: ['useGetCalendarAcl', courseId],
            queryFn: () => getCalendarAcl(newCalendarId),
          })
          .then(d => console.log('최종 데이터', d));
      }

      hideDialog();
    },
  });

  const getHasAclAdminList = useCallback(() => {
    return courseCalendarAcl?.map(acl => {
      const adminData = adminList?.find(({ email }) => email === acl.email);
      const isSuperAdmin = acl.email === SUPER_ADMIN_EMAIL;
      return {
        ...acl,
        nickname: isSuperAdmin ? '관리자' : adminData?.nickname,
        roleType: isSuperAdmin ? 'SUPER_ADMIN' : adminData?.roleType,
      };
    }) as AclEmail[];
  }, [adminList, courseCalendarAcl]);

  const getHasNotAclAdminList = useCallback(() => {
    return (
      adminList.filter(
        ({ email }) =>
          !courseCalendarAcl?.find(({ email: aclEmail }) => email === aclEmail),
      ) || []
    );
  }, [adminList, courseCalendarAcl]);

  const onGrantAclClick = (
    calendarId: string,
    hasNotAclAdminList: AdminEmail[],
  ) => {
    const noEmailToBeAuthorized = hasNotAclAdminList?.length === 0;
    if (!calendarId || noEmailToBeAuthorized) return;
    grantAcl({ calendarId, hasNotAclAdminList });
  };

  const courseAclInfo: CourseCalendarAcl = {
    courseId,
    courseTitle,
    isCreated: !!courseCalendar?.calendarId, // 교육과정 정보에 저장된 캘린더 id로 판별, 권한으로 판별하면 없는 권한은 없는데 생성된 경우가 있을 수 있음.
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
    createCalendar,
    isCreateCalendarPending,
  };
};
