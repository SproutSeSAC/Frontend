import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useCreateCalendar } from '@/services/schedule/calendarMutations';
import {
  useGetAclListByCalendar,
  useGetAuthorizedEmailsByCourse,
  useGetCreatedCourseCalendar,
} from '@/services/schedule/calendarQueries';

import { managerAndAdminRolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { KeyOfRole } from '@/types';
import { FaPlus } from 'react-icons/fa6';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';

interface CreateCalendarButtonProps {
  courseTitle: string;
  courseId: number;
  userRole: KeyOfRole;
}

export default function CreateCalendarButton({
  courseTitle,
  courseId,
  userRole,
}: CreateCalendarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { alert, hideDialog } = useDialogContext();

  const { data: authorizedEmailList } =
    useGetAuthorizedEmailsByCourse(courseId);

  const { calendarId: sproutCalendarId = '' } =
    useGetCreatedCourseCalendar(courseId).data || {};

  const { data: aclList } = useGetAclListByCalendar(sproutCalendarId);

  const authorizedEmailListByRole = authorizedEmailList
    ?.filter(item => item.roleType !== userRole)
    ?.reduce<Partial<Record<KeyOfRole, string>>>((acc, user) => {
      acc[user.roleType as KeyOfRole] = user.email;
      return acc;
    }, {}) as {
    EDU_MANAGER?: string;
    CAMPUS_MANAGER?: string;
    JOB_COORDINATOR?: string;
  };

  const managerListExceptUserRole = Object.values(
    Object.fromEntries(
      Object.entries(managerAndAdminRolesObj).filter(
        ([key]) => key !== userRole,
      ),
    ),
  ).join(', ');

  const queryClient = useQueryClient();

  const { mutateAsync } = useCreateCalendar(
    courseId,
    courseTitle,
    authorizedEmailListByRole,
    userRole,
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ['calendarList'] });
      },
    },
  );

  const onEduManagerCalendarClick = () => {
    const onConfirmCreateClick = () => {
      mutateAsync();
      hideDialog();
    };

    if (sproutCalendarId) {
      alert({
        className: 'max-w-[360px]',
        text: `${courseTitle} 캘린더가 이미 생성되어 있습니다.`,
        subText: aclList
          ? '캘린더가 이미 생성되었으며 캘린더 권한이 부여된 상태입니다. Gmail을 확인해주세요.'
          : '잠시만 기다려주시면 관리자가 확인 후 캘린더 권한을 부여해드리겠습니다. 알림을 확인해주세요.',
        children: (
          <SquareButton name="확인" onClick={hideDialog} type="button" />
        ),
      });
    } else {
      alert({
        text: `${courseTitle} 캘린더`,
        subText: '위 캘린더를 생성하시겠어요?',
        children: (
          <div className="flex max-w-80 flex-col">
            <Title
              as="p"
              highlight={managerListExceptUserRole}
              title={`${courseTitle} 캘린더는 누구나 볼 수 있는 공개 캘린더로 생성됩니다. ${managerListExceptUserRole}는 캘린더에 대해 동일한 권한을 갖게 됩니다.`}
              className="mt-2 px-2 text-center leading-6"
            />
            <div className="flex justify-center gap-2">
              <SquareButton
                name="취소"
                onClick={hideDialog}
                type="button"
                color="gray"
                className="mt-5"
              />
              <SquareButton
                name="생성"
                onClick={onConfirmCreateClick}
                type="button"
                className="mt-5"
              />
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <div className="relative flex items-center justify-between">
      {isLoading ? (
        <span className="flex-1 tracking-tight text-gray2">
          {courseTitle} 캘린더 생성 중...
        </span>
      ) : (
        <>
          <button
            type="button"
            onClick={onEduManagerCalendarClick}
            className="pr-2"
          >
            <FaPlus
              className={`size-4 ${sproutCalendarId ? 'text-gray2' : 'text-oliveGreen1'}`}
            />
          </button>
          <span
            className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap tracking-tight ${sproutCalendarId ? 'text-gray2' : 'text-text'}`}
          >
            {courseTitle} 캘린더 생성하기
          </span>
        </>
      )}
    </div>
  );
}
