import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function TableDataCell({ children, className }: Props) {
  return (
    <td
      className={`border-b border-lightGray-active px-1.5 py-4 [&:first-child]:group-hover:rounded-l-lg [&:last-child]:group-hover:rounded-r-lg ${className}`}
    >
      {children}
    </td>
  );
}
