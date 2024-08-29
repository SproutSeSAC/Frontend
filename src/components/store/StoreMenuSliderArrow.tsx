import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export default function StoreMenuSlideArrow({
  direction,
  onClick,
}: {
  direction: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 -translate-y-1/2 p-2 text-white opacity-60 transition-all ${
        direction === 'left' ? 'left-2' : 'right-2'
      }`}
      aria-label={direction === 'left' ? '이전 슬라이드' : '다음 슬라이드'}
    >
      {direction === 'left' ? (
        <BsChevronLeft size={24} />
      ) : (
        <BsChevronRight size={24} />
      )}
    </button>
  );
}
