import { useGetCreatedCourseCalendar } from '@/services/schedule/calendarQueries';

import { useDialogContext } from '@/hooks';
import { FaPlus } from 'react-icons/fa6';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';

interface AddSubscribeCalenderButtonProps {
  courseTitle: string;
  courseId: number;
  disabled: boolean;
}

export default function SubscribeCalenderButton({
  courseTitle,
  courseId,
  disabled,
}: AddSubscribeCalenderButtonProps) {
  const { alert, hideDialog } = useDialogContext();

  const { data: calendarIdByCourse, isLoading: isCalenderIdLoading } =
    useGetCreatedCourseCalendar(courseId);

  const sproutCalendarId = calendarIdByCourse?.calendarId;

  const onConfirmSubscribeClick = () => {
    if (sproutCalendarId) {
      const publicCalendarUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(sproutCalendarId)}`;
      window.open(publicCalendarUrl, '_blank');
    }
    hideDialog();
  };

  const onTraineeCalendarClick = () => {
    if (!sproutCalendarId) {
      alert({
        text: `${courseTitle} 캘린더가 곧 생성될 예정입니다.`,
        subText: `조금만 기다려주세요!`,
        className: 'max-w-[600px]',
        children: (
          <SquareButton name="확인" onClick={hideDialog} type="button" />
        ),
      });
    } else {
      alert({
        text: `${courseTitle} 캘린더`,
        subText: `위 캘린더를 구독하시겠어요? `,
        subTextColor: 'green',
        className: 'max-w-[600px]',
        children: (
          <div className="flex flex-col">
            <Title
              as="p"
              highlight={courseTitle}
              title="위 교육과정과 관련된 일정들을 확인할 수 있습니다."
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
                name="구독"
                onClick={onConfirmSubscribeClick}
                type="button"
                className="mt-5"
              />
            </div>
          </div>
        ),
      });
    }
  };

  if (isCalenderIdLoading) return null;

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        disabled={disabled}
        onClick={onTraineeCalendarClick}
        className="pr-2"
      >
        <FaPlus
          className={`size-4 ${disabled ? 'text-mainGray' : 'text-mainGreen'}`}
        />
      </button>
      <span className="flex-1 tracking-tight text-mainGray">
        {courseTitle} 캘린더 구독하기
      </span>
    </div>
  );
}
