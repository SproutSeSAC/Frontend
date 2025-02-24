import { useGetUserProfile } from '@/services/auth/authQueries';

import { rolesObj } from '@/constants';
import { AccessRole, AdminEmail } from '@/types';
import { getColorByRole, isSuperAdmin } from '@/utils';
import { BiUserPin } from 'react-icons/bi';
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
    isSuperAdmin(userProfile?.role) && name === '관리자'
      ? userProfile.name
      : name;

  const currentUser = userProfile?.name === adminName;

  return (
    <li key={email} className="relative flex items-center">
      {accessRole && (
        <BiUserPin
          className={`peer cursor-pointer ${currentUser ? 'text-mainGreen' : 'text-text'}`}
        />
      )}
      <span
        className={`peer cursor-pointer truncate tracking-tighter ${currentUser ? 'text-mainGreen' : 'text-text'}`}
      >
        {adminName}
        {currentUser && <span className="mb-1 inline-block text-sm">(나)</span>}
      </span>
      {roleType && (
        <div className="absolute left-4 top-6 z-10 hidden flex-col items-start rounded-b-xl rounded-tr-xl bg-lightGreen-hover p-4 shadow-sm hover:flex peer-hover:flex">
          <div className="mb-2 flex">
            <span className="peer cursor-pointer truncate text-[15px] tracking-tighter text-darkGray-hover">
              {name}
            </span>
            <Tag
              size="small"
              color={getColorByRole(roleType)}
              emphasisText
              text={rolesObj[roleType]}
              className="mr-0.5 font-medium tracking-tighter"
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
