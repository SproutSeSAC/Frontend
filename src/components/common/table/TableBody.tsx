import { ReactNode } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { UserComment, UserPost } from '@/types';

import LoopLoading from '@/components/common/LoopLoading';

interface TableBodyProps<T> {
  paginationList: T[];
  children: (item: T) => ReactNode;
  colLength: number;
  isLoading: boolean;
}

export default function TableBody<T extends UserPost | UserComment>({
  paginationList,
  children,
  colLength,
  isLoading,
}: TableBodyProps<T>) {
  return (
    <tbody>
      {isLoading && (
        <tr>
          <td colSpan={5} className="mx-auto">
            <div className="flex justify-center py-3">
              <LoopLoading size={115} />
            </div>
          </td>
        </tr>
      )}

      {!isLoading &&
        (paginationList.length !== 0 ? (
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
        ))}
    </tbody>
  );
}
