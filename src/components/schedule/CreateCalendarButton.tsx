import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useCreateCalendar } from '@/services/schedule/calendarMutations';
import { useGetManagerEmailListByCourse } from '@/services/schedule/calendarQueries';

import { superAdminAndManagerRolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { RoleKey } from '@/types';
import { FaPlus } from 'react-icons/fa6';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';

interface CreateCalendarButtonProps {
  courseTitle: string;
  courseId: number;
  userRole: RoleKey;
  disabled: boolean;
}

export default function CreateCalendarButton({
  courseTitle,
  courseId,
  userRole,
  disabled,
}: CreateCalendarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { alert, hideDialog } = useDialogContext();

  const { data: authorizedEmailList } =
    useGetManagerEmailListByCourse(courseId);

  const authorizedEmailListByCourse = authorizedEmailList
    ?.filter(item => item.roleType !== userRole)
    ?.reduce<Partial<Record<RoleKey, string>>>((acc, user) => {
      acc[user.roleType as RoleKey] = user.email;
      return acc;
    }, {}) as {
    EDU_MANAGER?: string;
    CAMPUS_LEADER?: string;
    JOB_COORDINATOR?: string;
  };

  const managerListExceptUserRole = Object.values(
    Object.fromEntries(
      Object.entries(superAdminAndManagerRolesObj).filter(
        ([key]) => key !== userRole,
      ),
    ),
  ).join(', ');

  const queryClient = useQueryClient();

  const { mutateAsync } = useCreateCalendar({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['calendarList'] });
      queryClient.invalidateQueries({ queryKey: ['calendarIdByCourse'] });
      queryClient.invalidateQueries({ queryKey: ['courseCalenderList'] });
    },
  });

  const onEduManagerCalendarClick = () => {
    const onConfirmCreateClick = () => {
      mutateAsync({
        courseId,
        summary: courseTitle,
        authorizedEmails: authorizedEmailListByCourse,
        userRole,
      });
      hideDialog();
    };

    alert({
      text: `${courseTitle} 캘린더`,
      subText: '위 캘린더를 생성하시겠어요?',
      children: (
        <div className="flex flex-col">
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
  };

  return (
    <div className="relative flex items-start justify-between">
      {isLoading ? (
        <span className="flex-1 tracking-tight text-mainGray">
          {courseTitle} 캘린더 생성 중...
        </span>
      ) : (
        <>
          <button
            type="button"
            onClick={onEduManagerCalendarClick}
            className="mt-1 pr-2"
            disabled={disabled}
          >
            <FaPlus
              className={`"size-4 ${disabled ? 'text-mainGray' : 'text-mainGreen'}`}
            />
          </button>
          <span
            className={`flex-1 tracking-tight ${disabled ? 'text-mainGray' : 'text-black'}`}
          >
            {courseTitle} <span className="text-mainGray">캘린더 생성하기</span>
          </span>
        </>
      )}
    </div>
  );
}
