import { NoticeSession } from '@/types';
import { formatDate } from '@/utils';

import ErrorMsg from '@/components/common/input/ErrorMsg';

interface SessionSelectBoxProps {
  onClick: () => void;
  session: NoticeSession;
  isSelected: boolean;
  disabled: boolean;
}

export default function SessionSelectBox({
  onClick,
  session,
  isSelected,
  disabled,
}: SessionSelectBoxProps) {
  const initialSessionStatus = session.currentStatus === null;

  const sessionDate = formatDate(
    session.sessionStartDateTime,
    'yyyy년 M월 d일 EEEE',
  );

  const sessionTime = `${formatDate(
    session.sessionStartDateTime,
    'HH:mm',
  )} ~ ${formatDate(session.sessionEndDateTime, 'HH:mm')}`;

  const initialStyle =
    initialSessionStatus || !isSelected ? 'bg-white [&>h4]:text-gray1' : '';
  const isSelectedStyle = isSelected
    ? 'bg-oliveGreen1 text-white [&>h4]:text-gray4'
    : '';

  const boxStyle = isSelected ? isSelectedStyle : initialStyle;

  const disabledStyle = disabled
    ? '!bg-gray3 !text-gray1 !cursor-not-allowed'
    : '';

  return (
    <button
      type="button"
      aria-label={`수업일시: ${sessionDate} ${sessionTime}`}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-[294px] cursor-pointer flex-col gap-1 rounded-2xl px-5 py-6 shadow-card ${boxStyle} ${disabledStyle}`}
    >
      <h4>수업 일시</h4>
      <span>{sessionDate}</span>
      <span>{sessionTime}</span>

      {disabled && <ErrorMsg msg="정원이 다 찼습니다." />}
    </button>
  );
}
