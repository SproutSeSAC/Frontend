import { useState } from 'react';

import { BiChevronDown, BiExpandVertical } from 'react-icons/bi';

import Pagination from '@/components/common/Pagination';
import EyeButton from '@/components/common/button/EyeButton';
import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';

type Collection = '내가 쓴 게시글' | '내가 쓴 댓글';

export const ITEMS_PER_PAGE = 6;

export default function PostAndCommentCollection() {
  const [currCollection, setCurrCollection] =
    useState<Collection>('내가 쓴 게시글');

  const changeCollection = (contentType: Collection) => {
    setCurrCollection(contentType);
  };

  const collectionList: Collection[] = ['내가 쓴 게시글', '내가 쓴 댓글'];

  const headerCellList = [
    {
      name: '체크박스',
      onChange: () => console.log('체크박스 클릭'),
    },
    {
      name: '작성일',
      icon: BiExpandVertical,
      onIconClick: () => console.log('작성일'),
    },
    { name: '번호', className: 'text-center' },
    {
      name: '분류',
      icon: BiChevronDown,
      onIconClick: () => console.log('분류'),
    },
    { name: '글제목' },
    {
      name: '숨김',
      className: 'text-center',
      onClick: () => console.log('숨김'),
    },
    {
      name: '삭제',
      className: 'text-end pr-6',
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

  const commonCheckboxStyle =
    '[&>label>input]:mr-0 [&>label>input]:size-5 pl-6';

  return (
    <div className="rounded-lg bg-white py-5">
      <div className="flex items-center justify-between gap-3 px-4">
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
        <EyeButton />
        <TrashButton />
      </div>

      <table className="mx-1 my-4 border-separate border-spacing-y-3">
        <colgroup>
          <col width="1%" />
          <col width="8%" />
          <col width="10%" />
          <col width="14%" />
          <col width="44%" />
          <col width="8%" />
          <col width="8%" />
        </colgroup>

        <thead>
          <tr className="text-left">
            {headerCellList.map(cell =>
              cell.name === '체크박스' ? (
                <TableHeaderCell key={cell.name} name="체크박스">
                  <Checkbox id="체크박스" checked={false} onChange={() => {}} />
                </TableHeaderCell>
              ) : (
                <TableHeaderCell
                  key={cell.name}
                  name={cell.name}
                  className={cell.className}
                  icon={cell.icon}
                  onIconClick={cell.onIconClick}
                />
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {bodyCellList.map(cell => (
            <tr key={cell.number} className="group hover:bg-gray4">
              <TableDataCell className={commonCheckboxStyle}>
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

              <TableDataCell className="text-center">
                <EyeButton />
              </TableDataCell>

              <TableDataCell className="pr-5 text-end">
                <TrashButton />
              </TableDataCell>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <Pagination
        totalPages={bodyCellList.length}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
