import { ElementType, ReactNode } from 'react';

interface TableHeaderCellProps {
  name: string;
  icon?: ElementType;
  onIconClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function TableHeaderCell({
  name,
  className,
  icon: Icon,
  onIconClick,
  children,
}: TableHeaderCellProps) {
  const checkboxStyle =
    name === '체크박스' && '[&>label>input]:mr-0 [&>label>input]:size-5 pl-6';

  return (
    <th
      className={`border-b border-gray3 px-1 pb-5 font-medium ${checkboxStyle} ${className}`}
    >
      {name !== '체크박스' && (
        <span className="font-normal text-gray1">{name}</span>
      )}
      {Icon && (
        <button onClick={onIconClick}>
          <Icon className="ml-1 inline size-6 cursor-pointer stroke-2 px-1 text-gray3" />
        </button>
      )}
      {children}
    </th>
  );
}
