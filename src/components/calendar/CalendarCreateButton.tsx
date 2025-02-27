import { useHandleCalendar } from '@/hooks/calendar/useHandleCalendar';

import { useGetUserProfile } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';
import { HasSuperAdminRole } from '@/types';

import SquareButton from '@/components/common/button/SquareButton';

interface CreateCalendarButtonProps {
  courseTitle: string;
  courseId: number;
}

export default function CalendarCreateButton({
  courseTitle,
  courseId,
}: CreateCalendarButtonProps) {
  const { alert, hideDialog } = useDialogContext();

  const { createCalendar, isCreateCalendarPending } = useHandleCalendar({
    courseId,
  });

  const { data: userProfile } = useGetUserProfile();

  const onCreateCalendarClick = () => {
    alert({
      text: '교육과정 캘린더 생성하기',
      subTextColor: 'green',
      subText: `<${courseTitle}> 과정에 대한 공개 캘린더를 생성하시겠어요?`,
      className: '!max-w-[500px]',
      children: (
        <div className="flex w-full items-center justify-center gap-4">
          <SquareButton
            name="취소"
            onClick={hideDialog}
            type="button"
            color="gray"
            className="mt-5"
          />
          {userProfile && (
            <SquareButton
              name="생성"
              onClick={() => {
                createCalendar({
                  courseId,
                  summary: courseTitle,
                  currentRole: userProfile?.role as keyof HasSuperAdminRole,
                });
                hideDialog();
              }}
              type="button"
              className="mt-5"
            />
          )}
        </div>
      ),
    });
  };

  return (
    <button
      type="button"
      onClick={onCreateCalendarClick}
      className="rounded-md bg-mainGreen px-2.5 py-1.5 text-[13px] tracking-tighter text-white"
      disabled={isCreateCalendarPending}
    >
      생성하기
    </button>
  );
}
