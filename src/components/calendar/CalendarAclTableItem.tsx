import { useHandleAcl } from '@/hooks';
import { UserCourse } from '@/types';
import { FaPlus } from 'react-icons/fa6';

import AclUser from '@/components/calendar/AclUser';
import CalendarCreateButton from '@/components/calendar/CalendarCreateButton';
import TableDataCell from '@/components/common/table/TableDataCell';

interface CalendarAclTableItemProps {
  index: number;
  course: UserCourse;
}

export default function CalendarAclTableItem({
  index,
  course,
}: CalendarAclTableItemProps) {
  const {
    courseCalendarAcl,
    isGrantAclPending,
    courseAclInfo,
    grantAcl,
    isLoading,
    adminList,
  } = useHandleAcl(course);

  return (
    <tr className="group border-t hover:bg-lightGray [&:last-child>td]:border-b-0">
      <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
        <span className="text-darkGray-active">{index + 1}</span>
      </TableDataCell>

      <TableDataCell className="max-w-[0px] overflow-hidden truncate">
        {isLoading && (
          <div className="h-8 w-16 rounded-xl bg-lightGray-active" />
        )}

        {!isLoading &&
          (courseCalendarAcl ? (
            <div className="w-fit px-2 text-sm tracking-tighter text-darkGray">
              생성완료
            </div>
          ) : (
            <CalendarCreateButton
              courseTitle={course.courseTitle}
              courseId={course.courseId}
              adminList={adminList}
            />
          ))}
      </TableDataCell>

      <TableDataCell
        className={`${courseCalendarAcl ? '' : 'text-mainGray'} h-full overflow-hidden pr-8 leading-5 tracking-tight`}
      >
        {course.courseTitle}
      </TableDataCell>

      <TableDataCell>
        {courseAclInfo.isCreated && (
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {courseAclInfo?.hasAclAdminList?.map(admin => (
              <AclUser key={admin.email} admin={admin} />
            ))}
          </ul>
        )}
      </TableDataCell>

      <TableDataCell>
        {courseAclInfo.isCreated &&
          (courseAclInfo?.hasNotAclAdminList?.length === 0 ? (
            '-'
          ) : (
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {courseAclInfo?.hasNotAclAdminList?.map(admin => (
                <AclUser key={admin.email} admin={admin} />
              ))}
            </ul>
          ))}
      </TableDataCell>

      {/* 권한 부여 버튼 */}
      <TableDataCell className="border-b pr-5 text-end [&>button]:px-4">
        <button
          type="button"
          onClick={() => grantAcl(courseAclInfo)}
          disabled={
            !courseAclInfo.isCreated ||
            courseAclInfo?.hasNotAclAdminList?.length === 0 ||
            isGrantAclPending
          }
          className="disabled:text-mainGray"
        >
          <FaPlus />
        </button>
      </TableDataCell>
    </tr>
  );
}
