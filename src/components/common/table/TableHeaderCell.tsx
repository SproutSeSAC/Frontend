import { ElementType, ReactNode } from 'react';

interface BaseProps {
  className?: string;
}

interface NameProps extends BaseProps {
  name: string;
  icon?: ElementType;
  children?: ReactNode;
}

interface IconChildrenProps extends BaseProps {
  name?: string;
  icon: ElementType;
  children?: ReactNode;
}

interface ChildrenProps extends BaseProps {
  name?: string;
  icon?: ElementType;
  children: ReactNode;
}

type Props = NameProps | IconChildrenProps | ChildrenProps;

export default function TableHeaderCell({
  name,
  children,
  className,
  icon: Icon,
}: Props) {
  return (
    <th className={`border-b border-gray3 px-1 pb-5 font-medium ${className}`}>
      <span className="font-normal text-gray1">{name}</span>
      {Icon && <Icon className="ml-1 inline size-3.5 stroke-2 text-gray3" />}
      {children}
    </th>
  );
}
