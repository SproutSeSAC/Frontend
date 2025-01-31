import { useQueryClient } from '@tanstack/react-query';

import { useGrantAcl } from '@/services/schedule/calendarMutations';

import { rolesObj } from '@/constants';
import { useDialogContext, useGetUserAclList } from '@/hooks';
import { getColorByRole } from '@/utils';
import { FaPlus } from 'react-icons/fa6';

import LoopLoading from '@/components/common/LoopLoading';
import SquareButton from '@/components/common/button/SquareButton';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';
import Tag from '@/components/common/tag/Tag';

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
    { name: '번호', className: 'pl-4' },
    { name: '캘린더 상태' },
    { name: '교육과정 캘린더' },
    { name: '권한이 부여된 이메일' },
    { name: '권한이 없는 매니저' },
    { name: '권한 부여', className: 'text-end pr-4' },
  ];

  return (
    <table className="mx-1 my-4 border-separate border-spacing-y-5 rounded-lg border-red-500 bg-white px-1">
      <colgroup>
        <col width="5%" />
        <col width="9%" />
        <col width="32%" />
        <col width="23%" />
        <col width="23%" />
        <col width="8%" />
      </colgroup>

      <thead>
        <tr className="text-left">
          {headerCellList.map(cell => (
            <TableHeaderCell
              key={cell.name}
              name={cell.name}
              className={cell.className}
            />
          ))}
        </tr>
      </thead>

      <tbody>
        {!isCalendarAclLoading ? (
          bodyCellList.map((cell, index) => (
            <tr key={cell.courseTitle} className="group hover:bg-lightGray">
              <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                <span className="text-darkGray-active">{index + 1}</span>
              </TableDataCell>

              <TableDataCell className="max-w-[0px] overflow-hidden truncate">
                {cell.isCreated ? (
                  <div className="w-fit rounded-md bg-mainGreen p-1 px-2 text-sm text-white">
                    생성 완료
                  </div>
                ) : (
                  <div className="w-fit rounded-md bg-mainGray p-1 px-2 text-sm font-medium text-darkGray-active">
                    생성 전
                  </div>
                )}
              </TableDataCell>

              <TableDataCell
                className={`${cell.isCreated ? '' : 'text-mainGray'} max-w-[0px] overflow-hidden truncate pr-8`}
              >
                {cell.courseTitle}
              </TableDataCell>

              <TableDataCell>
                {cell?.aclEmailList?.length === 0 ? (
                  '-'
                ) : (
                  <ul className="flex flex-col gap-y-1">
                    {cell?.aclEmailList?.map(({ email, roleType }) => (
                      <div key={email} className="flex">
                        {roleType && (
                          <Tag
                            size="small"
                            color={getColorByRole(roleType)}
                            emphasisText
                            text={rolesObj[roleType]}
                            className="mr-0.5 font-medium"
                          />
                        )}
                        <span>{email}</span>
                      </div>
                    ))}
                  </ul>
                )}
              </TableDataCell>

              <TableDataCell>
                {cell?.hasNotAclEmailList?.length === 0 ? (
                  '-'
                ) : (
                  <ul className="flex flex-col gap-y-1">
                    {cell?.hasNotAclEmailList?.map(({ email, roleType }) => (
                      <div key={email} className="flex">
                        <Tag
                          size="small"
                          color={getColorByRole(roleType)}
                          emphasisText
                          text={rolesObj[roleType]}
                          className="mr-0.5 font-medium"
                        />
                        <span>{email}</span>
                      </div>
                    ))}
                  </ul>
                )}
              </TableDataCell>

              <TableDataCell className="pr-5 text-end [&>button]:px-4">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      !cell.calendarId ||
                      cell?.hasNotAclEmailList?.length === 0
                    )
                      return;
                    const { calendarId, hasNotAclEmailList } = cell;
                    if (hasNotAclEmailList) {
                      mutateAsync({ calendarId, hasNotAclEmailList });
                    }
                  }}
                  disabled={
                    !cell.hasAcl || cell?.hasNotAclEmailList?.length === 0
                  }
                  className="disabled:text-mainGray"
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
  );
}
