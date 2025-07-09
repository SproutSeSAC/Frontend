import { NoticeSession } from '@/types';
import { formatDate } from '@/utils';
import { BsCheckCircle } from 'react-icons/bs';

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
      ? 'bg-white [&>h3]:text-black [&>h4]:text-darkGray border-darkGray'
      : '';
  const isSelectedStyle = isSelected
    ? 'bg-lightGreen-active [&>h4]:text-mainGreen-active border-lightGreen-active'
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
        className={`relative flex w-full cursor-pointer flex-col gap-1 rounded-2xl border p-4 ${boxStyle} ${disabledStyle}`}
      >
        {isSelected && (
          <BsCheckCircle
            className="absolute left-3 top-3 text-mainGreen-active"
            size={20}
          />
        )}
        <h3 className="mb-1 text-lg font-medium">{session.ordinal}회차</h3>
        <h4>수업 일시</h4>
        <span>{sessionDate}</span>
        <span>{sessionTime}</span>
      </button>
      {disabled && errorMsg && <ErrorMsg msg={errorMsg} className="pl-2" />}
    </>
  );
}
