import {
  useGetAclListByCalendar,
  useGetCreatedCourseCalendar,
} from '@/services/schedule/calendarQueries';

import { useDialogContext } from '@/hooks';
import { AccessRole } from '@/types';
import { BiInfoCircle } from 'react-icons/bi';

import SquareButton from '@/components/common/button/SquareButton';

export default function AclInfoButton({
  courseId,
  accessRole,
}: {
  courseId: number;
  accessRole: AccessRole;
}) {
  const { calendarId: sproutCalendarId = '' } =
    useGetCreatedCourseCalendar(courseId).data || {};

  const { hideDialog, alert } = useDialogContext();

  const { data: aclList } = useGetAclListByCalendar(sproutCalendarId);

  const alertText = {
    noAcl: {
      text: '아직 일정관리 권한이 부여되지 않은 상태입니다.',
      subText:
        '잠시만 기다려주시면 관리자가 확인 후 권한을 부여해드리겠습니다. 알림을 확인해주세요.',
    },
    noInMyCalendar: {
      text: '일정관리 권한이 부여된 상태이지만 나의 캘린더 목록에는 추가되지 않은 상태입니다.',
      subText:
        '현재 구글 계정의 Gmail에 캘린더 추가 링크가 전달되었으니 링크를 통해 내 캘린더 목록에도 추가하세요.',
    },
  };

  const onInfoClick = () => {
    alert({
      ...alertText[aclList?.length === 0 ? 'noAcl' : 'noInMyCalendar'],
      children: <SquareButton name="확인" onClick={hideDialog} type="button" />,
    });
  };

  return (
    (aclList?.length === 0 || !accessRole) && (
      <button type="button" onClick={onInfoClick} className="group text-[15px]">
        <BiInfoCircle className="inline size-[22px] text-oliveGreen1" />
      </button>
    )
  );
}
