import Icon from '@/components/common/Icon';

interface NotificationHeaderProps {
  handleClose: () => void;
}

export default function NotificationHeader({
  handleClose,
}: NotificationHeaderProps) {
  return (
    <div className="mb-4 flex w-full">
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          aria-label="접어두기"
          className="border-lightGrey flex size-12 items-center justify-center rounded-lg border border-solid bg-white text-mainGray"
          onClick={handleClose}
        >
          <Icon name="ChevronRight" />
        </button>
        <div className="w-full flex-1 py-3 text-center text-lg font-semibold text-black">
          알림
        </div>
      </div>
    </div>
  );
}
