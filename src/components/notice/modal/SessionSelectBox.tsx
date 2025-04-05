import { NoticeSession } from '@/types';
import { formatDate } from '@/utils';

import ErrorMsg from '@/components/common/input/ErrorMsg';

interface SessionSelectBoxProps {
  onClick: () => void;
  session: NoticeSession;
  isSelected: boolean;
  disabled: boolean;
  errorMsg?: string;
}

export default function SessionSelectBox({
  onClick,
  session,
  isSelected,
  disabled,
  errorMsg,
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
    initialSessionStatus || !isSelected
      ? 'bg-white [&>h3]:text-black [&>h4]:text-darkGray-active border-darkGray'
      : '';
  const isSelectedStyle = isSelected
    ? 'bg-darkGreen text-white [&>h4]:text-lightGray border-darkGray'
    : '';

  const boxStyle = isSelected ? isSelectedStyle : initialStyle;

  const disabledStyle = disabled
    ? '!bg-mainGray !text-darkGray !cursor-not-allowed border-mainGray'
    : '';

  return (
    <>
      <button
        type="button"
        aria-label={`수업일시: ${sessionDate} ${sessionTime}`}
        onClick={onClick}
        disabled={disabled}
        className={`flex w-full cursor-pointer flex-col gap-1 rounded-2xl border px-5 py-6 ${boxStyle} ${disabledStyle}`}
      >
        <h3 className="mb-1 text-lg font-medium">{session.ordinal}회차</h3>
        <h4>수업 일시</h4>
        <span>{sessionDate}</span>
        <span>{sessionTime}</span>
      </button>
      {disabled && errorMsg && <ErrorMsg msg={errorMsg} className="pl-2" />}
    </>
  );
}
