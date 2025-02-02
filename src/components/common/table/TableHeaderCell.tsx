import { ElementType, MouseEvent, ReactNode } from 'react';

interface TableHeaderCellProps {
  name: string;
  icon?: ElementType;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: ReactNode;
}

export default function TableHeaderCell({
  name,
  className,
  icon: Icon,
  onClick,
  children,
}: TableHeaderCellProps) {
  const checkboxStyle =
    name === '체크박스' && '[&>label>input]:mr-0 [&>label>input]:size-5 pl-6';

  return (
    <th
      className={`relative border-b border-mainGray px-1 pb-5 font-medium ${checkboxStyle} ${className}`}
    >
      {name !== '체크박스' &&
        (onClick ? (
          <button type="button" onClick={onClick}>
            <span>{name}</span>
            {Icon && (
              <Icon className="ml-1 inline size-6 cursor-pointer stroke-2 px-1 text-mainGray" />
            )}
          </button>
        ) : (
          <div>
            <span>{name}</span>
            {Icon && (
              <Icon className="ml-1 inline size-6 cursor-pointer stroke-2 px-1 text-mainGray" />
            )}
          </div>
        ))}

      {children}
    </th>
  );
}
