import { useState } from 'react';

import {
  useGetMyPostDetail,
  useGetMyPostList,
  useGetPostComments,
} from '@/services/post/postQueries';

import { BiChevronDown, BiExpandVertical } from 'react-icons/bi';

import Pagination from '@/components/common/Pagination';
import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';
import FavoritePostCard from '@/components/user/FavoritePostCard';

type Collection = '내가 쓴 게시글' | '내가 쓴 댓글' | '내가 찜한 글';

const collectionList: Collection[] = [
  '내가 쓴 게시글',
  '내가 쓴 댓글',
  '내가 찜한 글',
];

export const ITEMS_PER_PAGE = 6;

export default function MyCollection() {
  const [currCollection, setCurrCollection] =
    useState<Collection>('내가 쓴 게시글');

  const changeCollection = (contentType: Collection) => {
    setCurrCollection(contentType);
  };

  const { data } = useGetMyPostDetail(38);

  const { data: postList } = useGetMyPostList('project');
  const { data: commentList } = useGetPostComments(38);

  console.log(data, postList, commentList);

  const headerCellList = [
    {
      name: '체크박스',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        console.log('체크박스 전체 클릭', event), //
    },
    {
      name: '작성일',
      icon: BiExpandVertical,
      onClick: () => console.log('최신순 오래된순'),
    },
    { name: '번호', className: 'text-center' },
    {
      name: '분류',
      icon: BiChevronDown,
      onClick: () => console.log('카테고리 분류'),
    },
    { name: '글제목' },
    {
      name: '삭제',
      className: 'text-end pr-7',
      onClick: () => console.log('삭제'),
    },
  ];

  const bodyCellList = [
    {
      createdAt: '2024.08.13',
      number: 10,
      type: '한끼팟',
      title:
        '을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다! 을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다! 을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다!',
    },
    {
      createdAt: '2024.08.13',
      number: 1023,
      type: '스터디 모집',
      title:
        '을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다! 을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다!',
    },
    {
      createdAt: '2024.08.13',
      number: 10104,
      type: '프로젝트 모집',
      title: '을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다!',
    },
    {
      createdAt: '2024.08.13',
      number: 12104,
      type: '프로젝트 모집',
      title: '을지로 3가역에서 함께 저녁 먹을 한끼팟 모집합니다!',
    },
  ];

  return (
    <div className="rounded-lg bg-white py-5 shadow-card">
      <header className="flex items-center justify-between gap-3 pl-4 pr-5">
        <div className="flex flex-1 gap-2">
          {collectionList.map(collection => (
            <button
              key={collection}
              type="button"
              aria-label={collection}
              onClick={() => changeCollection(collection)}
              className={`${currCollection === collection && 'rounded-lg bg-oliveGreen1 font-semibold text-white underline'} cursor-pointer px-4 py-2`}
            >
              {collection}
            </button>
          ))}
        </div>
        <TrashButton className="px-1.5 py-2" />
      </header>

      {currCollection === '내가 찜한 글' ? (
        <ul className="flex gap-4 p-8">
          {[1, 2, 3].map(card => (
            <FavoritePostCard key={card} />
          ))}
        </ul>
      ) : (
        <table className="mx-1 my-4 border-separate border-spacing-y-3">
          <colgroup>
            <col width="3%" />
            <col width="6%" />
            <col width="10%" />
            <col width="10%" />
            <col width="35%" />
            <col width="10%" />
          </colgroup>

          <thead>
            <tr className="text-left">
              {headerCellList.map(cell => (
                <TableHeaderCell
                  key={cell.name}
                  name={cell.name}
                  className={cell.className}
                  icon={cell.icon}
                  onClick={cell.onClick}
                  onChange={cell.onChange}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {bodyCellList.map(cell => (
              <tr key={cell.number} className="group hover:bg-gray4">
                <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                  <Checkbox id="체크박스" checked={false} onChange={() => {}} />
                </TableDataCell>

                <TableDataCell>{cell.createdAt}</TableDataCell>

                <TableDataCell className="text-center">
                  {cell.number}
                </TableDataCell>

                <TableDataCell>{cell.type}</TableDataCell>

                <TableDataCell className="max-w-[0px] overflow-hidden truncate">
                  {cell.title}
                </TableDataCell>

                <TableDataCell className="pr-5 text-end [&>button]:px-2">
                  <TrashButton className="px-1.5 py-2" />
                </TableDataCell>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 페이지네이션 */}
      <Pagination
        totalPages={bodyCellList.length}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
