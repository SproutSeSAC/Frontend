import { useGetAppliedSessionList } from '@/services/session/sessionsQueries';

import { hasAdminRolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { AppliedSession, HasAdminRole } from '@/types';

import XButton from '@/components/common/button/XButton';
import Tag from '@/components/common/tag/Tag';
import AppliedSessionCancelModal from '@/components/session/AppliedSessionCancelModal';

export default function MyPageAppliedSessionCard() {
  const { showDialog } = useDialogContext();

  const { data: mySessionList, isLoading } =
    useGetAppliedSessionList('nearList');

  const handleShowDialog = async (session: AppliedSession) => {
    await showDialog({
      key: 'SESSIONS-CANCEL-CARD-TYPE',
      element: <AppliedSessionCancelModal session={session} />,
    });
  };

  return (
    <div className="mt-2.5 flex h-[200px] w-full items-center justify-center rounded-[20px] bg-white p-6">
      {!isLoading &&
        (mySessionList?.length === 0 ? (
          <span className="text-mainGray-hover">
            특강 / 행사 신청 내역이 없어요!
          </span>
        ) : (
          <ul className="h-full w-full space-y-2">
            {mySessionList?.map(session => (
              <li
                key={session.participantId}
                className="flex items-center gap-1.5"
              >
                <Tag
                  size="medium"
                  text={hasAdminRolesObj[session.role as keyof HasAdminRole]}
                  roleKey={session.role}
                  className="!px-2 !py-1.5"
                />
                <Tag
                  size="medium"
                  text={`${session.ordinal}회차`}
                  color="grayLight"
                  className="!px-2 !py-1.5"
                />
                <span className="w-full overflow-hidden truncate">
                  {session.title}
                </span>
                <XButton
                  onDeleteClick={() => handleShowDialog(session)}
                  iconClassName="text-mainGray !size-6"
                />
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
