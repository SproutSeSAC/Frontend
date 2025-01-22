import { ChangeEvent, ElementType, ReactNode } from 'react';

import Checkbox from '@/components/common/checkbox/Checkbox';

interface TableHeaderCellProps {
  name: string;
  icon?: ElementType;
  onClick?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  children?: ReactNode;
}

export default function TableHeaderCell({
  name,
  className,
  icon: Icon,
  onClick,
  onChange,
  children,
}: TableHeaderCellProps) {
  const checkboxStyle =
    name === '체크박스' && '[&>label>input]:mr-0 [&>label>input]:size-5 pl-6';

  return (
    <th
      className={`border-b border-gray3 px-1 pb-5 font-medium ${checkboxStyle} ${className}`}
    >
      {name === '체크박스' && onChange ? (
        <Checkbox id={name} checked={false} onChange={onChange} />
      ) : (
        <span className="font-normal tracking-tighter text-gray1">{name}</span>
      )}

      {Icon && (
        <button onClick={onClick}>
          <Icon className="ml-1 inline size-6 cursor-pointer stroke-2 px-1 text-gray3" />
        </button>
      )}

      {children}
    </th>
  );
}
