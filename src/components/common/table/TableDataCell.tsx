import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function TableDataCell({ children, className }: Props) {
  return (
    <td
      className={`p-1.5 [&:first-child]:group-hover:rounded-l-lg [&:last-child]:group-hover:rounded-r-lg ${className}`}
    >
      {children}
    </td>
  );
}
