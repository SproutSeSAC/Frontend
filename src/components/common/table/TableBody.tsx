import { ReactNode } from 'react';
import { Fragment } from 'react/jsx-runtime';

interface TableBodyProps<T> {
  paginationList: T[];
  children: (item: T) => ReactNode;
  colLength: number;
}

export default function TableBody<T extends { createdAt: string }>({
  paginationList,
  children,
  colLength,
}: TableBodyProps<T>) {
  return (
    <tbody>
      {paginationList.length !== 0 ? (
        paginationList.map(pageItem => (
          <Fragment key={pageItem.createdAt}>{children(pageItem)}</Fragment>
        ))
      ) : (
        <tr>
          <td colSpan={colLength}>
            <span className="flex justify-center py-14 text-mainGray">
              아직 정보가 없어요
            </span>
          </td>
        </tr>
      )}
    </tbody>
  );
}
