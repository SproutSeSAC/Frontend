import { ReactNode } from 'react';

interface TableContainerProps {
  colWidthList: number[];
  children: ReactNode;
}

export default function TableContainer({
  children,
  colWidthList,
}: TableContainerProps) {
  return (
    <table>
      <colgroup>
        {colWidthList.map(widthNum => (
          <col key={widthNum} width={`${widthNum}%`} />
        ))}
      </colgroup>

      {children}
    </table>
  );
}
