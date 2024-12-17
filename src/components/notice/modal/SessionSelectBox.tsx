import { NoticeSession } from '@/types';
import { formatDate } from '@/utils';

interface SessionSelectBoxProps {
  onClick: () => void;
  session: NoticeSession;
  isSelected: boolean;
}

export default function SessionSelectBox({
  onClick,
  session,
  isSelected,
}: SessionSelectBoxProps) {
  const initialSessionStatus = session.currentStatus === null; // 참가 신청을 아직 안한 상태 아직

  const sessionDate = formatDate(
    session.sessionStartDateTime,
    'yyyy년 M월 d일 EEEE',
  );

  const sessionTime = `${formatDate(
    session.sessionStartDateTime,
    'HH:mm',
  )} ~ ${formatDate(session.sessionEndDateTime, 'HH:mm')}`;

  // const disabledStyle = 'bg-gray4 text-gray2';

  const initialStyle =
    (initialSessionStatus || !isSelected) && 'bg-white [&>h4]:text-gray1';
  const isSelectedStyle =
    isSelected && 'bg-oliveGreen1 text-white [&>h4]:text-gray4';

  const boxStyle = isSelected ? isSelectedStyle : initialStyle;

  return (
    <button
      type="button"
      aria-label={`수업일시: ${sessionDate} ${sessionTime}`}
      onClick={onClick}
      className={`flex w-[294px] cursor-pointer flex-col gap-1 rounded-2xl px-5 py-6 shadow-card ${boxStyle} `}
    >
      <h4>수업 일시</h4>
      <span>{sessionDate}</span>
      <span>{sessionTime}</span>
    </button>
  );
}
