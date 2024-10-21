import { BsArrowCounterclockwise } from 'react-icons/bs';

interface ResetButtonProps {
  onResetClick: () => void;
  className?: string;
}

export default function ResetButton({
  onResetClick,
  className = '',
}: ResetButtonProps) {
  return (
    <button
      type="button"
      aria-label="선택 초기화 버튼"
      onClick={onResetClick}
      className={`flex items-center px-2 ${className}`}
    >
      <BsArrowCounterclockwise />
    </button>
  );
}
