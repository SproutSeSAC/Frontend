import { Link } from 'react-router-dom';

import { managerAndAdminRolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { ManagerAdminRole } from '@/types';
import { getColorByRole } from '@/utils';

import SquareButton from '@/components/common/button/SquareButton';
import XButton from '@/components/common/button/XButton';
import Tag from '@/components/common/tag/Tag';

export default function ApplicationListOfSessionsCard() {
  const { alert, hideDialog } = useDialogContext();

  const onCancelClick = () => {
    alert({
      text: '취소하시겠어요?',
      children: (
        <div className="flex flex-col items-center justify-center">
          <li className="mb-5 flex items-start gap-2">
            <Tag
              size="medium"
              text="캠퍼스매니저"
              emphasisText
              color="pink"
              className="!px-1"
            />
            <span className="max-w-[330px]">
              1세대에게 직접 배우는 안드로이드 앱 개발 1세대에게 직접 배우는
              안드로이드 앱 개발
            </span>
          </li>
          <div className="flex gap-4">
            <SquareButton
              name="취소"
              color="gray"
              onClick={hideDialog}
              type="button"
            />
            <SquareButton name="확인" onClick={hideDialog} type="button" />
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="rounded-xl bg-white px-6 py-4 shadow-card">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">내가 신청한 특강</h4>
        <Link
          to="/application-status-for-sessions"
          className="text-sm font-medium text-gray2"
        >
          더보기
        </Link>
      </div>

      <ul className="mt-2.5 w-full space-y-1.5">
        {(
          [
            'CAMPUS_MANAGER',
            'EDU_MANAGER',
            'JOB_COORDINATOR',
          ] as (keyof ManagerAdminRole)[]
        ).map(item => (
          <li key={item} className="flex items-center gap-2">
            <Tag
              size="medium"
              text={managerAndAdminRolesObj[item]}
              emphasisText
              color={getColorByRole(item)}
              className="!px-1"
            />
            <span className="w-full overflow-hidden truncate">
              1세대에게 직접 배우는 안드로이드 앱 개발 1세대에게 직접 배우는
              안드로이드 앱 개발
            </span>
            <XButton
              onDeleteClick={onCancelClick}
              iconClassName="text-gray2 !size-6"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
