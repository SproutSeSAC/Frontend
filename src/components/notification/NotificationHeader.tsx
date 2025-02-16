import { IoIosInformation } from 'react-icons/io';

import Icon from '@/components/common/Icon';

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
          className="border-lightGrey flex size-12 items-center justify-center rounded-lg border border-solid bg-white text-mainGray"
          onClick={handleClose}
        >
          <Icon name="ChevronRight" />
        </button>
        <div className="w-full flex-1 py-3 text-center text-lg font-semibold text-black">
          알림
        </div>
        <div className="group relative flex cursor-pointer items-center justify-center rounded-lg bg-bg">
          <IoIosInformation className="size-8 text-xl text-darkGray" />
          <span className="absolute right-0 top-14 hidden w-[185px] rounded-lg bg-black px-5 py-6 text-base leading-6 text-white opacity-70 group-hover:block">
            알림은 최대 20개까지 <br />
            표시됩니다.
          </span>
        </div>
      </div>
    </div>
  );
}
