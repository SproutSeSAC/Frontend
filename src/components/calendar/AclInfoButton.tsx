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
      await queryClient.invalidateQueries({
        queryKey: ['useGetCalendarList'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['useGetCalendarAcl', courseId],
      });
    },
  });

  useEffect(() => {
    if (isError && error.response?.status === 403) {
      queryClient.setQueryData(['useGetCalendarAcl', courseId], {
        status: 'forbidden',
      });
    }
  }, [isError, error, queryClient, courseId]);

  const alertText = {
    notFoundCalendar: {
      text: '캘린더에 오류가 발생했습니다.',
      subText: '생성되었던 해당 캘린더가 유실되었습니다.',
    },
    hasNotAcl: {
      text: '아직 캘린더 권한이 없는 상태입니다.',
      subText:
        '잠시만 기다려주시면 관리자가 확인 후 권한을 곧 부여해드리겠습니다.',
    },
    notInMyCalendar: {
      text: '캘린더 권한이 있지만 나의 캘린더 목록에는 없는 상태입니다.',
      subText: '나의 캘린더 목록에 추가하셔야 캘린더 일정을 볼 수 있습니다.',
    },
  };

  // 캘린더를 찾지 못했을때
  const notFoundCalendar =
    aclList === 'Not Found' &&
    typeof aclList === 'string' &&
    'notFoundCalendar';
  // 권한 없음
  const hasNotAcl = !aclList?.length && 'hasNotAcl';
  // 권한이 있지만 내 캘린더 목록에 추가하지 않아 캘린더 데이터를 못가져올 때
  const hasAclButNotInMyCalendarList =
    !!aclList?.length && typeof aclList === 'object' && 'notInMyCalendar';

  const onInfoClick = () => {
    alert({
      ...alertText[
        notFoundCalendar ||
          hasNotAcl ||
          hasAclButNotInMyCalendarList ||
          'hasNotAcl'
      ],
      subTextColor: 'green',
      children: (
        <div className="flex gap-4">
          <SquareButton
            name="닫기"
            color="gray"
            onClick={hideDialog}
            type="button"
          />
          {hasAclButNotInMyCalendarList && (
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
    (notFoundCalendar || hasNotAcl || hasAclButNotInMyCalendarList) &&
    !isLoading && (
      <button type="button" onClick={onInfoClick} className="group text-[15px]">
        <BiInfoCircle
          className={`inline size-[20px] ${!hasAclButNotInMyCalendarList ? 'text-red-400' : 'text-mainGreen'}`}
        />
      </button>
    )
  );
}
