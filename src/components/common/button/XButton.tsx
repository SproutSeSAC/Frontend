import { BsX } from 'react-icons/bs';

interface XButtonProps {
  onDeleteClick: () => void;
  className?: string;
  iconClassName?: string;
}

export default function XButton({
  onDeleteClick,
  className = '',
  iconClassName = '',
}: XButtonProps) {
  return (
    <button type="button" onClick={onDeleteClick} className={className}>
      <BsX className={`size-5 text-white ${iconClassName}`} />
    </button>
  );
}
