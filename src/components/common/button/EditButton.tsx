import { FiEdit } from 'react-icons/fi';

interface EditButtonProps {
  size?: number;
  label: string;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function EditButton({
  size = 18,
  label,
  className,
  onClick,
  disabled,
}: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${disabled ? '' : 'cursor-pointer'} text-darkGray ${className}`}
      aria-label={label}
    >
      <FiEdit className={`size-[${size}px]`} />
    </button>
  );
}
