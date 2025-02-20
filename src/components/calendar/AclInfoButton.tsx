import { useQueryClient } from '@tanstack/react-query';

import { useInsertCalendar } from '@/services/schedule/calendarMutations';
import { useGetCalendarAcl } from '@/services/schedule/calendarQueries';

import { useDialogContext } from '@/hooks';
import { AccessRole } from '@/types';
import { BiInfoCircle } from 'react-icons/bi';

import SquareButton from '@/components/common/button/SquareButton';

interface AclInfoButtonProps {
  courseId: number;
  calendarId: string;
  accessRole: AccessRole;
}

export default function AclInfoButton({
  courseId,
  calendarId,
  accessRole,
}: AclInfoButtonProps) {
  const queryClient = useQueryClient();

  const { hideDialog, alert } = useDialogContext();

  const { data: aclList } = useGetCalendarAcl(courseId, calendarId);

  const { mutateAsync: insertCalendar } = useInsertCalendar({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetCalendarList'],
      });
    },
  });

  const alertText = {
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

  const hasAclRole = accessRole === 'owner' || accessRole === 'writer';

  const hasNotAcl = !aclList && !hasAclRole;

  const hasAclButNotInMyCalendarList = aclList?.length !== 0 && !hasAclRole;

  const onInfoClick = () => {
    alert({
      ...alertText[hasNotAcl ? 'hasNotAcl' : 'notInMyCalendar'],
      subTextColor: 'green',
      children: (
        <div className="flex gap-4">
          <SquareButton
            name="닫기"
            color="gray"
            onClick={hideDialog}
            type="button"
          />
          <SquareButton
            name="나의 캘린더에 추가"
            onClick={() => {
              insertCalendar(calendarId);
              hideDialog();
            }}
            type="button"
          />
        </div>
      ),
    });
  };

  return (
    (hasNotAcl || hasAclButNotInMyCalendarList) && (
      <button type="button" onClick={onInfoClick} className="group text-[15px]">
        <BiInfoCircle
          className={`inline size-[20px] ${hasNotAcl ? 'text-red-400' : 'text-mainGreen'}`}
        />
      </button>
    )
  );
}
