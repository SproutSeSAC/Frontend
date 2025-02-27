import { hasAdminRolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { HasAdminRole } from '@/types';
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

  // NOTE: 최대 4개 신청내역 불러오기
  const list: { id: number; title: string; role: keyof HasAdminRole }[] = [
    {
      id: 1,
      title:
        '1세대에게 직접 배우는 안드로이드 앱 개발 1세대에게 직접 배우는 안드로이드 앱 개발',
      role: 'CAMPUS_LEADER',
    },
  ];

  return (
    <div className="mt-2.5 flex h-[200px] w-full items-center justify-center rounded-[20px] bg-white p-6">
      {1 ? (
        <span className="text-mainGray-hover">
          특강 / 행사 신청 내역이 없어요!
        </span>
      ) : (
        <ul className="h-full w-full space-y-2">
          {list.map(({ id, title, role }) => (
            <li key={id} className="flex items-center gap-2">
              <Tag
                size="medium"
                text={hasAdminRolesObj[role]}
                emphasisText
                color={getColorByRole(role)}
                className="!px-2 !py-1.5"
              />
              <span className="w-full overflow-hidden truncate">{title}</span>
              <XButton
                onDeleteClick={onCancelClick}
                iconClassName="text-mainGray !size-6"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
