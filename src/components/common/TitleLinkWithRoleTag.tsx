import { MouseEvent } from 'react';

import { Link } from 'react-router-dom';

import { rolesObj } from '@/constants';
import { HasAdminRole } from '@/types';

import Tag from '@/components/common/tag/Tag';

interface TitleLinkWithRoleTagProps {
  to: string;
  roleType: keyof HasAdminRole;
  title: string;
  onClick: (event: MouseEvent) => void;
}

export default function TitleLinkWithRoleTag({
  to,
  roleType,
  title,
  onClick,
}: TitleLinkWithRoleTagProps) {
  return (
    <Link to={to} className="flex h-7 items-center gap-1.5" onClick={onClick}>
      <Tag
        size="medium"
        roleKey={roleType}
        text={rolesObj[roleType]}
        className="!rounded-md !px-[10px] py-1.5 font-medium"
      />
      <p className="line-clamp-1 text-sm">{title}</p>
    </Link>
  );
}
