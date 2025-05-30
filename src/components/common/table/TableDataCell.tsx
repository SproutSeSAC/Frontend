import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function TableDataCell({ children, className }: Props) {
  return (
    <td
      className={`p-2 text-center text-[15px] [&:first-child]:group-hover:rounded-l-lg [&:last-child]:group-hover:rounded-r-lg ${className}`}
    >
      {children}
    </td>
  );
}
