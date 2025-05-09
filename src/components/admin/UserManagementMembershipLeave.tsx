import { useState } from 'react';

import { rolesObj } from '@/constants';
import { UserManagementDto } from '@/types';

import SquareButton from '@/components/common/button/SquareButton';

interface UserManagementMembershipLeaveProps {
  user: UserManagementDto.GetUserList['content'][number];
  onMenuClose: () => void;
}

export default function UserManagementMembershipLeave({
  user,
  onMenuClose,
}: UserManagementMembershipLeaveProps) {
  const { name: userName, role } = user;

  const [showReconfirmMembershipLeave, setShowReconfirmMembershipLeave] =
    useState(false);

  const onClose = () => {
    onMenuClose();
    setShowReconfirmMembershipLeave(false);
  };

  return showReconfirmMembershipLeave ? (
    <>
      <p>
        회원 정보를 삭제하시면 복구할 수 없습니다.
        <br /> <span className="font-bold text-mainGreen">{userName}</span>
        님의 회원정보를 정말로 삭제하시겠습니까?
      </p>
      <div className="ml-auto mt-4 flex w-fit items-center gap-4">
        <SquareButton
          name="삭제"
          color="mainGreen"
          className="min-w-fit !rounded-xl"
          onClick={onClose}
        />
        <SquareButton
          name="닫기"
          color="gray"
          className="min-w-fit !rounded-xl"
          onClick={onClose}
        />
      </div>
    </>
  ) : (
    <>
      <p className="mb-10 text-darkGray">
        선택한 회원을 탈퇴 처리할 수 있어요.
      </p>

      <div className="flex items-center gap-6">
        <div className="text-lg font-medium">
          <span className="pr-2 text-mainGreen">{userName}</span>{' '}
          {rolesObj[role || 'CAMPUS_LEADER']}
        </div>
        <SquareButton
          name="삭제"
          color="gray"
          className="min-w-fit !rounded-xl"
          onClick={() => setShowReconfirmMembershipLeave(prev => !prev)}
        />
      </div>
    </>
  );
}
