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
    name === '체크박스' && '[&>label>input]:mr-0 [&>label>input]:size-5';

  return (
    <th className={`relative pb-4 font-normal ${checkboxStyle} ${className}`}>
      {name !== '체크박스' &&
        name !== '분류' &&
        (onClick ? (
          <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-center pl-3"
          >
            <span>{name}</span>
            {Icon && (
              <Icon className="inline size-5 cursor-pointer px-0.5 text-darkGray" />
            )}
          </button>
        ) : (
          <div
            className={`flex w-full items-center ${name === '삭제' ? 'justify-center' : 'pl-1.5'}`}
          >
            <span className="block">{name}</span>
            {Icon && (
              <Icon className="inline size-5 cursor-pointer px-0.5 text-darkGray" />
            )}
          </div>
        ))}

      {children}
    </th>
  );
}
