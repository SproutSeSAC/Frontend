import { useHandleScrap } from '@/hooks';

import Icon from '@/components/common/Icon';
import FavoriteButton from '@/components/common/button/FavoriteButton';

interface StoreModalHeaderProps {
  storeId: number;
  onClose: () => void;
  postId: number;
  isScraped: boolean;
}

export default function StoreModalHeader({
  storeId,
  onClose,
  postId,
  isScraped,
}: StoreModalHeaderProps) {
  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped,
      invalidateQueryKeys: [
        { queryKey: ['useGetInfiniteStoreList'] },
        { queryKey: ['useGetStoreDetail', storeId] },
      ],
    });

  return (
    <header className="mb-[10px] flex items-center justify-between">
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="text-[#d9d9d9]"
      >
        <Icon name="ChevronLeft" />
      </button>

      <FavoriteButton
        size={20}
        isFavorite={isScraped}
        onClick={onScrapClick}
        disabled={isDeleteScrapPending || isPostScrapPending}
      />
    </header>
  );
}
