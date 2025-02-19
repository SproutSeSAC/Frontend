import { rolesObj } from '@/constants';
import { AclEmail, AdminEmail } from '@/types';
import { getColorByRole } from '@/utils';
import { BiUserPin } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';

import Tag from '@/components/common/tag/Tag';

interface AclUserProps {
  admin: AdminEmail | AclEmail;
}

export default function AclUser({ admin }: AclUserProps) {
  const { email, nickname, roleType } = admin;

  return (
    <li key={email} className="relative flex items-center">
      <BiUserPin className="peer cursor-pointer" />
      <span className="peer cursor-pointer truncate tracking-tighter">
        {nickname}
      </span>
      {roleType && (
        <div className="absolute left-4 top-6 z-10 hidden flex-col items-start rounded-b-xl rounded-tr-xl bg-lightGreen-hover p-4 shadow-sm hover:flex peer-hover:flex">
          <div className="mb-2 flex">
            <span className="peer cursor-pointer truncate text-[15px] tracking-tighter text-darkGray-hover">
              {nickname}
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
