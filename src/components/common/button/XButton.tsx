import { BsX } from 'react-icons/bs';

interface XButtonProps {
  onDeleteClick: () => void;
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
}

export default function XButton({
  onDeleteClick,
  className = '',
  iconClassName = '',
  disabled,
}: XButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onDeleteClick}
      className={className}
    >
      <BsX className={`size-5 ${iconClassName}`} />
    </button>
  );
}
