import { FaChevronRight } from 'react-icons/fa';

interface NotificationHeaderProps {
  handleClose: () => void;
}

export default function NotificationHeader({
  handleClose,
}: NotificationHeaderProps) {
  return (
    <div className="mb-6 flex w-full items-center">
      <button
        type="button"
        aria-label="접어두기"
        className="flex size-12 items-center justify-center rounded-lg border border-solid border-gray4 bg-white text-gray2"
        onClick={handleClose}
      >
        <FaChevronRight />
      </button>
      <div className="ml-3 w-full flex-1 py-3 text-center text-lg font-semibold text-text">
        알림
      </div>
    </div>
  );
}
