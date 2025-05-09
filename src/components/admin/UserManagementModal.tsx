import { modalSizeObj } from '@/constants';
import { UserManagementDto, UserManagingActionMenu } from '@/types';
import { BsX } from 'react-icons/bs';

import UserManagementMembershipLeave from '@/components/admin/UserManagementMembershipLeave';
import UserManagementPermission from '@/components/admin/UserManagementPermission';
import UserManagementPhoneNumber from '@/components/admin/UserManagementPhoneNumber';

interface UserManagingActionMenuProps {
  currMenu: UserManagingActionMenu;
  onMenuClose: () => void;
  user: UserManagementDto.GetUserList['content'][number];
}

export default function UserManagementModal({
  currMenu,
  onMenuClose,
  user,
}: UserManagingActionMenuProps) {
  const { name: userName } = user;

  return (
    <div className="absolute right-0 top-0 z-40 !pb-16">
      <div
        className={`rounded-xl bg-white px-8 !pb-8 !pt-7 shadow-2xl ${currMenu.label === '권한 수정' ? modalSizeObj.lg : modalSizeObj.md}`}
      >
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{currMenu.label}</h1>
          <button type="button" aria-label="모달 닫기" onClick={onMenuClose}>
            <BsX size={38} />
          </button>
        </header>

        {currMenu.label === '회원 탈퇴' && (
          <UserManagementMembershipLeave
            user={user}
            onMenuClose={onMenuClose}
          />
        )}

        {currMenu.label !== '회원 탈퇴' && (
          <>
            <p className="mb-5 text-darkGray">
              {userName}님의{' '}
              <span className="font-medium">
                {currMenu.label.includes('권한')
                  ? '캠퍼스, 교육과정, 역할 권한을'
                  : '연락처를'}
              </span>{' '}
              수정할 수 있어요.
            </p>

            {currMenu.label === '연락처 수정' && (
              <UserManagementPhoneNumber
                user={user}
                onMenuClose={onMenuClose}
              />
            )}

            {currMenu.label === '권한 수정' && (
              <UserManagementPermission user={user} onMenuClose={onMenuClose} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
