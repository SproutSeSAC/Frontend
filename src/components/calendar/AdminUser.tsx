import { useGetUserProfile } from '@/services/auth/authQueries';

import { rolesObj } from '@/constants';
import { AccessRole, AdminEmail } from '@/types';
import { hasAdmin, hasSuperAdmin, isSuperAdmin } from '@/utils';
import { BiUserPin } from 'react-icons/bi';
import { FaCrown } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

import Tag from '@/components/common/tag/Tag';

interface AdminUserProps {
  admin: AdminEmail;
  accessRole?: AccessRole;
}

export default function AdminUser({ admin, accessRole }: AdminUserProps) {
  const { email, name, roleType } = admin;

  const { data: userProfile } = useGetUserProfile();

  const adminName =
    isSuperAdmin(userProfile?.role) && admin.roleType === 'SUPER_ADMIN'
      ? userProfile.name
      : name;

  const currentUser = userProfile?.name === adminName;

  return (
    <li key={email} className="relative flex items-center">
      <div
        className={`peer flex cursor-pointer items-center ${currentUser ? 'text-mainGreen' : 'text-text'}`}
      >
        {hasSuperAdmin(roleType) && <FaCrown className="mr-0.5 size-3.5" />}
        {!hasSuperAdmin(roleType) && hasAdmin(roleType) && (
          <BiUserPin className="mr-0.5 size-3.5" />
        )}
        <span className="truncate tracking-tighter">{adminName}</span>
        {currentUser && <span className="mb-1 inline-block text-sm">(나)</span>}
      </div>

      {roleType && (
        <div className="absolute left-4 top-6 z-10 hidden flex-col items-start rounded-b-xl rounded-tr-xl bg-lightGreen-hover p-4 shadow-sm hover:flex peer-hover:flex">
          <div className="my-2 flex gap-1">
            <span className="peer cursor-pointer truncate text-[15px] tracking-tighter text-darkGray-hover">
              {name}
            </span>
            <Tag
              size="small"
              roleType={roleType}
              text={rolesObj[roleType]}
              className="mr-0.5 font-medium tracking-tighter"
            />
            <Tag
              text={accessRole === 'owner' ? '소유권한' : '일정변경권한'}
              color="grayLight"
            />
          </div>
          <span className="flex items-center gap-0.5 px-1 tracking-tighter">
            <MdOutlineEmail />
            {email}
          </span>
        </div>
      )}
    </li>
  );
}
