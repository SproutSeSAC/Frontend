import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useCreateCalendar } from '@/services/schedule/calendarMutations';
import { useGetAdminEmailByCourse } from '@/services/schedule/calendarQueries';

import { useDialogContext } from '@/hooks';
import { FaPlus } from 'react-icons/fa6';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';

interface CreateCalendarButtonProps {
  courseTitle: string;
  courseId: number;
}

export default function CreateCalendarButton({
  courseTitle,
  courseId,
}: CreateCalendarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { alert, hideDialog } = useDialogContext();

  const { data: adminEmailList } = useGetAdminEmailByCourse(courseId);

  const CAMPUS_MANAGER_EMAIL = adminEmailList?.find(
    ({ roleType }) => roleType === 'CAMPUS_MANAGER',
  )?.email;

  const JOB_COORDINATOR_EMAIL = adminEmailList?.find(
    ({ roleType }) => roleType === 'JOB_COORDINATOR',
  )?.email;

  const queryClient = useQueryClient();

  const { mutateAsync } = useCreateCalendar(
    courseId,
    courseTitle,
    {
      CAMPUS_MANAGER: CAMPUS_MANAGER_EMAIL,
      JOB_COORDINATOR: JOB_COORDINATOR_EMAIL,
    },
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ['calendarList'] });
      },
    },
  );

  const onEduManagerCalendarClick = () => {
    const onConfirmCreateClick = () => {
      mutateAsync();
      hideDialog();
    };
    alert({
      showDim: true,
      className: 'z-30',
      text: `${courseTitle} 공유 캘린더`,
      subText: '위 캘린더를 생성하시겠어요?',
      children: (
        <div className="flex max-w-80 flex-col">
          <Title
            as="p"
            highlight="캠퍼스 매니저와 잡코디, 관리자"
            title="캠퍼스 매니저와 잡코디, 관리자가 함께 소유하는 캘린더가 생성됩니다."
            className="mt-2 px-2 text-center leading-6"
          />
          <div className="flex justify-center gap-2">
            <SquareButton
              name="취소"
              onClick={hideDialog}
              type="button"
              color="gray"
              className="mt-5"
            />
            <SquareButton
              name="생성"
              onClick={onConfirmCreateClick}
              type="button"
              className="mt-5"
            />
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="flex items-center justify-between">
      {isLoading ? (
        <span className="flex-1 tracking-tight text-gray2">
          {courseTitle} 캘린더 생성 중...
        </span>
      ) : (
        <>
          <button
            type="button"
            onClick={onEduManagerCalendarClick}
            className="pr-2"
          >
            <FaPlus className="size-4 text-oliveGreen1" />
          </button>
          <span className="flex-1 tracking-tight text-gray2">
            {courseTitle} 캘린더 생성하기
          </span>
        </>
      )}
    </div>
  );
}
