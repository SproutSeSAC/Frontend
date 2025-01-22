import { FaChevronRight, FaRegTrashAlt } from 'react-icons/fa';

interface NotificationHeaderProps {
  handleClose: () => void;
}

export default function NotificationHeader({
  handleClose,
}: NotificationHeaderProps) {
  return (
    <div className="mb-6 flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          aria-label="접어두기"
          className="border-lightGrey flex size-12 items-center justify-center rounded-lg border border-solid bg-white text-mainGray"
          onClick={handleClose}
        >
          <FaChevronRight />
        </button>
        <div className="ml-3 w-full flex-1 py-3 text-center text-lg font-semibold text-black">
          알림
        </div>
      </div>
      <button className="flex items-center justify-end gap-1 text-end text-base text-[#6D6D6D]">
        <FaRegTrashAlt />
        모두 삭제
      </button>
    </div>
  );
}
