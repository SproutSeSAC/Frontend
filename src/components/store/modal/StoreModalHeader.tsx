import { BsChevronLeft } from 'react-icons/bs';

import FavoriteButton from '@/components/common/button/FavoriteButton';

interface StoreModalHeaderProps {
  onClose: () => void;
}

export default function StoreModalHeader({ onClose }: StoreModalHeaderProps) {
  return (
    <header className="mb-[10px] flex items-center justify-between">
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="text-[#d9d9d9]"
      >
        <BsChevronLeft />
      </button>

      <FavoriteButton size={20} isFavorite={false} onClick={() => {}} />
    </header>
  );
}
