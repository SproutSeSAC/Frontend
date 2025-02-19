import {
  useGetCalendarAcl,
  useGetCourseCalendar,
} from '@/services/schedule/calendarQueries';

import { useDialogContext } from '@/hooks';
import { AccessRole } from '@/types';
import { BiInfoCircle } from 'react-icons/bi';

import SquareButton from '@/components/common/button/SquareButton';

interface AclInfoButtonProps {
  courseId: number;
  accessRole: AccessRole;
}

export default function AclInfoButton({
  courseId,
  accessRole,
}: AclInfoButtonProps) {
  const { calendarId: sproutCalendarId = '' } =
    useGetCourseCalendar(courseId).data || {};

  const { hideDialog, alert } = useDialogContext();

  const { data: aclList } = useGetCalendarAcl(sproutCalendarId);

  const alertText = {
    hasNotAcl: {
      text: '아직 일정관리 권한이 부여되지 않은 상태입니다.',
      subText:
        '잠시만 기다려주시면 관리자가 확인 후 권한을 곧 부여해드리겠습니다.',
    },
    notInMyCalendar: {
      text: '캘린더 권한이 부여되었으나 나의 캘린더 목록에는 없는 상태입니다.',
      subText:
        '내 캘린더 목록에 추가하지 않을시 교육과정 캘린더 목록에서 보이지 않을 수 있습니다.',
    },
  };

  const onInfoClick = () => {
    alert({
      ...alertText[aclList?.length === 0 ? 'hasNotAcl' : 'notInMyCalendar'],
      children: (
        <div className="flex gap-4 border">
          <SquareButton
            name="확인"
            color="gray"
            onClick={hideDialog}
            type="button"
          />
          <SquareButton
            name="나의 캘린더에 추가"
            onClick={hideDialog}
            type="button"
          />
        </div>
      ),
    });
  };

  return (
    (aclList?.length === 0 || !accessRole) && (
      <button type="button" onClick={onInfoClick} className="group text-[15px]">
        <BiInfoCircle className="inline size-[22px] text-mainGreen" />
      </button>
    )
  );
}
