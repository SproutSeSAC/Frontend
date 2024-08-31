import { FiEdit } from 'react-icons/fi';

interface EditButtonProps {
  size?: number;
  label: string;
  className?: string;
}

export default function EditButton({
  size = 18,
  label,
  className,
}: EditButtonProps) {
  return (
    <button type="button" className={`p-1 ${className}`} aria-label={label}>
      <FiEdit className={`size-[${size}px]`} />
    </button>
  );
}
