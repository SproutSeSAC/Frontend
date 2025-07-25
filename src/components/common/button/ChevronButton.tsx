import Icon from '@/components/common/Icon';

interface ChevronButtonProps {
  direction: 'ChevronRight' | 'ChevronLeft';
  handleClose: () => void;
  className?: string;
}

export default function ChevronButton({
  direction,
  handleClose,
  className,
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${direction === 'ChevronRight' ? '접어두기' : '펼치기'} `}
      className={`flex size-10 items-center justify-center rounded-lg border border-[#E9E9E9] bg-white text-mainGray ${className}`}
      onClick={handleClose}
    >
      <Icon name={direction} className="fill-darkGray" />
    </button>
  );
}
