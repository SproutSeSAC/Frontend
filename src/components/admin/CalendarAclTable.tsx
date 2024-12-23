import { useQueryClient } from '@tanstack/react-query';

import { useGrantAcl } from '@/services/schedule/calendarMutations';

import { useDialogContext, useGetUserAclList } from '@/hooks';
import { FaPlus } from 'react-icons/fa6';

import LoopLoading from '@/components/common/LoopLoading';
import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';

export default function CalendarAclTable() {
  const { aclEmailListByCourse: bodyCellList = [], isCalendarAclLoading } =
    useGetUserAclList();

  const queryClient = useQueryClient();

  const { alert, hideDialog } = useDialogContext();

  const { mutateAsync } = useGrantAcl({
    onSuccess: () => {
      alert({
        text: '일정관리 권한이 성공적으로 부여되었습니다. 전체 권한 부여가 끝난 후 새로고침을 해주세요.',
        children: (
          <SquareButton name="확인" onClick={hideDialog} type="button" />
        ),
      });
      queryClient.invalidateQueries({
        queryKey: ['useGetAllCalendarAclEmailList'],
      });
    },
  });

  const headerCellList = [
    {
      name: '체크박스',
      onChange: () => console.log('체크박스 클릭'),
    },
    {
      name: '캘린더 상태',
      onIconClick: () => console.log('교육과정'),
    },
    {
      name: '교육과정 캘린더',
      onIconClick: () => console.log('교육과정'),
    },
    {
      name: '권한이 부여된 이메일',
      onIconClick: () => console.log('캘린더 권한 이메일'),
    },
    {
      name: '권한이 없는 이메일',
      onIconClick: () => console.log('캘린더 권한 이메일'),
    },
    {
      name: '전체 부여',
      className: 'text-end pr-6',
      onClick: () => console.log('삭제'),
    },
  ];

  return (
    <div>
      <table className="mx-1 my-4 border-separate border-spacing-y-5 rounded-lg bg-white px-1">
        <colgroup>
          <col width="3%" />
          <col width="8%" />
          <col width="40%" />
          <col width="20%" />
          <col width="20%" />
          <col width="9%" />
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
                  onIconClick={cell.onIconClick}
                />
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {!isCalendarAclLoading ? (
            bodyCellList.map(cell => (
              <tr key={cell.courseTitle} className="group hover:bg-gray4">
                <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                  <Checkbox id="체크박스" checked={false} onChange={() => {}} />
                </TableDataCell>

                <TableDataCell className="max-w-[0px] overflow-hidden truncate">
                  {cell.isCreated ? (
                    <div className="w-fit rounded-md bg-oliveGreen1 p-1 px-2 text-sm text-white">
                      생성 완료
                    </div>
                  ) : (
                    <div className="w-fit rounded-md bg-gray3 p-1 px-2 text-sm font-medium text-gray1">
                      생성 전
                    </div>
                  )}
                </TableDataCell>

                <TableDataCell
                  className={`${cell.isCreated ? '' : 'text-gray2'} max-w-[0px] overflow-hidden truncate pr-8`}
                >
                  {cell.courseTitle}
                </TableDataCell>

                <TableDataCell>
                  {cell?.aclEmailList?.length === 0
                    ? '-'
                    : cell.aclEmailList.map(email => (
                        <span key={email} className="block text-oliveGreen1">
                          {email}
                        </span>
                      ))}
                </TableDataCell>

                <TableDataCell>
                  {cell?.hasNotAclEmailList?.length === 0
                    ? '-'
                    : cell.hasNotAclEmailList.map(email => (
                        <span key={email} className="block">
                          {email}
                        </span>
                      ))}
                </TableDataCell>

                <TableDataCell className="pr-5 text-end [&>button]:px-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        !cell.calendarId ||
                        cell.hasNotAclEmailList.length === 0
                      )
                        return;
                      const { calendarId, hasNotAclEmailList } = cell;
                      mutateAsync({ calendarId, hasNotAclEmailList });
                    }}
                    disabled={
                      cell.hasNotAclEmailList.length === 0 || !cell.calendarId
                    }
                    className="disabled:text-gray3"
                  >
                    <FaPlus />
                  </button>
                </TableDataCell>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="w-full">
                <div className="my-20 flex justify-center">
                  <LoopLoading />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
