import { useCourseData, useHandleAcl } from '@/hooks';
import { UserCourse } from '@/types';
import { FaPlus } from 'react-icons/fa6';

import AdminUser from '@/components/calendar/AdminUser';
import CalendarCreateButton from '@/components/calendar/CalendarCreateButton';
import TableDataCell from '@/components/common/table/TableDataCell';

interface CalendarAclTableItemProps {
  index: number;
  course: UserCourse;
}

export default function CalendarAclTableItem({
  index,
  course: { courseId, courseTitle },
}: CalendarAclTableItemProps) {
  const {
    adminList,
    courseCalendar: { calendarId },
  } = useCourseData({ courseId });

  const {
    courseAclInfo: { status, hasAclAdminList, hasNotAclAdminList },
    onGrantAclClick,
    isGrantAclPending,
    isCalendarAclLoading,
  } = useHandleAcl({ courseId, calendarId, adminList });

  const notFound = status === 'Not Found';

  const notFoundStyle = notFound ? 'bg-[#f1f1f1] opacity-30' : '';

  return (
    <tr className="group border-t hover:bg-lightGray [&:last-child>td]:border-b-0 [&>td]:border-b [&>td]:py-4">
      <TableDataCell
        className={`pl-4 [&>label>input]:mr-0 [&>label>input]:size-5 ${notFoundStyle}`}
      >
        <span className="text-darkGray">{index + 1}</span>
      </TableDataCell>

      {/* 캘린더 생성 상태 */}
      <TableDataCell
        className={`max-w-[0px] overflow-hidden truncate ${notFoundStyle}`}
      >
        {isCalendarAclLoading && (
          <div className="mx-auto h-8 w-16 rounded-xl bg-lightGray-active" />
        )}

        {!isCalendarAclLoading &&
          (calendarId ? (
            <div className="w-full px-2">
              <span className="text-center text-sm tracking-tighter text-darkGray">
                {notFound ? '데이터유실' : '생성완료'}
              </span>
            </div>
          ) : (
            <CalendarCreateButton
              courseTitle={courseTitle}
              courseId={courseId}
            />
          ))}
      </TableDataCell>

      {/* 교육과정명 */}
      <TableDataCell
        className={`${status === 'Created' ? '' : 'text-mainGray'} ${notFoundStyle} h-full overflow-hidden pr-8 text-start leading-5 tracking-tight`}
      >
        {courseTitle}
      </TableDataCell>

      {/* 캘린더 권한 부여된 유저 */}
      <TableDataCell className={notFoundStyle}>
        {calendarId && (
          <div className="flex justify-start">
            {hasAclAdminList?.length === 0 && (
              <span className="block w-full text-start text-mainGray">
                권한대기중
              </span>
            )}
            {hasAclAdminList && (
              <ul className="flex w-full flex-wrap gap-x-6 gap-y-1">
                {hasAclAdminList?.map(admin => (
                  <AdminUser
                    key={admin.email}
                    admin={admin}
                    accessRole={admin.accessRole}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </TableDataCell>

      {/* 캘린더 권한 대기중인 유저 */}
      <TableDataCell className={notFoundStyle}>
        {calendarId && (
          <div className="flex justify-start">
            {hasAclAdminList?.length === 0 && (
              <span className="block w-full text-start text-mainGray">
                권한대기중
              </span>
            )}

            {hasAclAdminList &&
              (hasNotAclAdminList?.length === 0 ? (
                '-'
              ) : (
                <ul className="flex w-full flex-wrap gap-x-6 gap-y-1">
                  {hasNotAclAdminList?.map(admin => (
                    <AdminUser key={admin.nickname} admin={admin} />
                  ))}
                </ul>
              ))}
          </div>
        )}
      </TableDataCell>

      {/* 권한 부여 버튼 */}
      <TableDataCell
        className={`border-b pr-5 text-end [&>button]:px-4 ${notFoundStyle}`}
      >
        <button
          type="button"
          onClick={() => {
            if (calendarId && hasNotAclAdminList) {
              onGrantAclClick(calendarId, hasNotAclAdminList);
            }
          }}
          disabled={
            !hasAclAdminList ||
            status !== 'Created' ||
            hasNotAclAdminList?.length === 0 ||
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
