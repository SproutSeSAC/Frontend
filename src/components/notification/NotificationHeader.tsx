import Icon from '@/components/common/Icon';
import InfoHoverBox from '@/components/common/InfoHoverBox';

interface NotificationHeaderProps {
  handleClose: () => void;
}

export default function NotificationHeader({
  handleClose,
}: NotificationHeaderProps) {
  return (
    <div className="mb-6 flex w-full">
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          aria-label="접어두기"
          className="flex size-12 items-center justify-center rounded-lg border border-solid border-lightGray bg-white text-mainGray"
          onClick={handleClose}
        >
          <Icon name="ChevronRight" />
        </button>
        <div className="w-full flex-1 py-3 text-center text-lg font-semibold text-black">
          알림
        </div>
        <InfoHoverBox text="알림은 최대 20개까지 표시됩니다." />
      </div>
    </div>
  );
}
