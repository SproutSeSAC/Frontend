import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useInsertCalendar } from '@/services/calendar/calendarMutations';
import { useGetCalendarAcl } from '@/services/calendar/calendarQueries';

import { useDialogContext } from '@/hooks';
import { BiInfoCircle } from 'react-icons/bi';

import SquareButton from '@/components/common/button/SquareButton';

interface AclInfoButtonProps {
  courseId: number;
  calendarId: string;
}

export default function AclInfoButton({
  courseId,
  calendarId,
}: AclInfoButtonProps) {
  const queryClient = useQueryClient();

  const { hideDialog, alert } = useDialogContext();

  const {
    data: aclList,
    isError,
    error,
    isLoading,
  } = useGetCalendarAcl(courseId, calendarId);

  const { mutateAsync: insertCalendar } = useInsertCalendar({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['useGetCalendarList'] });
      await queryClient.invalidateQueries({
        queryKey: ['useGetCalendarAcl', courseId],
      });
    },
  });

  useEffect(() => {
    if (isError && error.response?.status === 403) {
      queryClient.setQueryData(['useGetCalendarAcl', courseId], {
        status: 'Forbidden',
      });
    }
  }, [isError, error, queryClient, courseId]);

  const alertList: {
    type: 'notFoundCalendar' | 'hasNotAcl' | 'hasAclButNotInMyCalendarList';
    text: string;
    subText: string;
    condition: boolean;
  }[] = [
    {
      type: 'notFoundCalendar',
      text: '캘린더에 오류가 발생했습니다.',
      subText: '생성되었던 해당 캘린더가 유실되었습니다.',
      condition: typeof aclList === 'string' && aclList === 'Not Found',
    },
    {
      type: 'hasNotAcl',
      text: '아직 캘린더 권한이 없는 상태입니다.',
      subText:
        '잠시만 기다려주시면 관리자가 확인 후 권한을 곧 부여해드리겠습니다.',
      condition: typeof aclList === 'string' && aclList === 'Forbidden',
    },
    {
      type: 'hasAclButNotInMyCalendarList',
      text: '캘린더 권한이 있지만 나의 캘린더 목록에는 없는 상태입니다.',
      subText: '나의 캘린더 목록에 추가하셔야 캘린더 일정을 볼 수 있습니다.',
      condition: !!aclList?.length && typeof aclList === 'object',
    },
  ];

  const activeAlert =
    alertList.find(alertItem => alertItem.condition) || alertList[0];

  const onInfoClick = () => {
    const { text, subText, type } = activeAlert;

    alert({
      text,
      subText,
      subTextColor: 'green',
      children: (
        <div className="flex gap-4">
          <SquareButton
            name="닫기"
            color="gray"
            onClick={hideDialog}
            type="button"
          />
          {type === 'hasAclButNotInMyCalendarList' && (
            <SquareButton
              name="나의 캘린더에 추가"
              onClick={() => {
                insertCalendar(calendarId);
                hideDialog();
              }}
              type="button"
            />
          )}
        </div>
      ),
    });
  };

  return (
    activeAlert &&
    !isLoading && (
      <button type="button" onClick={onInfoClick} className="group text-[15px]">
        <BiInfoCircle
          className={`inline size-[20px] ${activeAlert.type !== 'hasAclButNotInMyCalendarList' ? 'text-red-400' : 'text-mainGreen'}`}
        />
      </button>
    )
  );
}
