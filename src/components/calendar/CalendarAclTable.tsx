import { useGetUserProfile } from '@/services/auth/authQueries';

import CalendarAclTableItem from '@/components/calendar/CalendarAclTableItem';
import LoopLoading from '@/components/common/LoopLoading';

export default function CalendarAclTable() {
  const { data: userProfile } = useGetUserProfile();

  const headerCellList = [
    { name: '번호', className: 'pl-4 text-center' },
    { name: '캘린더 상태', className: 'text-center' },
    { name: '교육과정 캘린더', className: 'text-start' },
    { name: '권한이 부여된 유저', className: 'text-start' },
    { name: '권한 대기중인 유저', className: 'text-start' },
    { name: '권한 부여', className: 'text-end pr-4' },
  ];

  return (
    <table className="mx-1 my-4 border-separate rounded-lg bg-white px-1 pb-3 pt-5">
      <colgroup>
        <col width="5%" />
        <col width="9%" />
        <col width="32%" />
        <col width="23%" />
        <col width="23%" />
        <col width="8%" />
      </colgroup>

      <thead>
        <tr>
          {headerCellList.map(({ name, className }) => (
            <th key={name} className={`${className} pb-5 font-normal`}>
              {name}
            </th>
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
