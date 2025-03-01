import { Link } from 'react-router-dom';

import { rolesObj } from '@/constants';
import { HasAdminRole } from '@/types';

import Tag from '@/components/common/tag/Tag';

interface TitleLinkWithRoleTagProps {
  to: string;
  roleType: keyof HasAdminRole;
  title: string;
}

export default function TitleLinkWithRoleTag({
  to,
  roleType,
  title,
}: TitleLinkWithRoleTagProps) {
  return (
    <Link to={to} className="flex h-7 w-full items-center gap-1.5">
      <Tag
        size="medium"
        roleType={roleType}
        text={rolesObj[roleType]}
        className="!rounded-md !px-[10px] py-1.5 font-medium"
      />
      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        {title}
      </p>
    </Link>
  );
}
