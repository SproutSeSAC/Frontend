import { useGetCalendarIdByCourse } from '@/services/schedule/calendarQueries';

import { useDialogContext } from '@/hooks';
import { FaPlus } from 'react-icons/fa6';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';

interface AddSubscribeCalenderButtonProps {
  courseTitle: string;
  courseId: number;
}

export default function SubscribeCalenderButton({
  courseTitle,
  courseId,
}: AddSubscribeCalenderButtonProps) {
  const { alert, hideDialog } = useDialogContext();

  const { data: calendarIdByCourse, isLoading: isCalenderIdLoading } =
    useGetCalendarIdByCourse(courseId);

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
        showDim: true,
        className: 'z-30',
        text: `${courseTitle} 캘린더가 곧 생성될 예정입니다.`,
        subText: `조금만 기다려주세요!`,
        children: (
          <SquareButton
            name="확인"
            onClick={hideDialog}
            type="button"
            color="oliveGreen"
            className="mt-5"
          />
        ),
      });
    } else {
      alert({
        showDim: true,
        className: 'z-30',
        text: `${courseTitle} 캘린더`,
        subText: `위 캘린더를 구독하시겠어요? `,
        children: (
          <div className="flex max-w-80 flex-col">
            <Title
              as="p"
              highlight={courseTitle}
              title={`${courseTitle}에 관련된 일정들을 확인할 수 있습니다.`}
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
      <button type="button" onClick={onTraineeCalendarClick} className="pr-2">
        <FaPlus className="size-4 text-oliveGreen1" />
      </button>
      <span className="flex-1 tracking-tight text-gray2">
        {courseTitle} 캘린더 구독하기
      </span>
    </div>
  );
}
