import { hasAdminRolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { HasAdminRole, AppliedSession as Session } from '@/types';

import XButton from '@/components/common/button/XButton';
import Tag from '@/components/common/tag/Tag';
import AppliedSessionCancelModal from '@/components/session/AppliedSessionCancelModal';

interface AppliedSessionProps {
  session: Session;
}

export default function AppliedSession({ session }: AppliedSessionProps) {
  const { showDialog } = useDialogContext();

  const handleShowDialog = async (appliedSession: Session) => {
    await showDialog({
      key: 'SESSIONS-CANCEL-CARD-TYPE',
      element: <AppliedSessionCancelModal session={appliedSession} />,
    });
  };

  return (
    <li className="flex items-center gap-1.5">
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
      <span className="w-full overflow-hidden truncate">{session.title}</span>
      <XButton
        onDeleteClick={() => handleShowDialog(session)}
        iconClassName="text-mainGray !size-6"
      />
    </li>
  );
}
