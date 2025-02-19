import { useGetUserProfile } from '@/services/auth/authQueries';

import CalendarAclTableItem from '@/components/calendar/CalendarAclTableItem';
import LoopLoading from '@/components/common/LoopLoading';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';

// NOTE: SUPER_ADMIN & CAMPUS_LEADER 만 들어갈 수 있는 페이지
// NOTE: 캘린더 생성 후 새로고침하지 않아도 바로 데이터 적용되도록

export default function CalendarAclTable() {
  const { data: userProfile } = useGetUserProfile();

  const headerCellList = [
    { name: '번호', className: 'pl-4' },
    { name: '캘린더 상태' },
    { name: '교육과정 캘린더' },
    { name: '권한이 부여된 유저' },
    { name: '권한 대기중인 유저' },
    { name: '권한 부여', className: 'text-end pr-4' },
  ];

  return (
    <table className="mx-1 my-4 border-separate border-spacing-y-0 rounded-lg bg-white px-1 pb-3 pt-5">
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
        {userProfile && userProfile?.courseList.length !== 0 ? (
          userProfile.courseList.map((course, index) => (
            <CalendarAclTableItem
              key={course.courseId}
              index={index}
              course={course}
            />
          ))
        ) : (
          <tr>
            <td colSpan={6} className="w-full">
              <div className="my-32 flex justify-center">
                <LoopLoading />
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
