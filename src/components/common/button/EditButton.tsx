import { FiEdit } from 'react-icons/fi';

interface EditButtonProps {
  size?: number;
  label: string;
  className?: string;
  onClick: () => void;
}

export default function EditButton({
  size = 18,
  label,
  className,
  onClick,
}: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-1 ${className}`}
      aria-label={label}
    >
      <FiEdit className={`size-[${size}px]`} />
    </button>
  );
}
