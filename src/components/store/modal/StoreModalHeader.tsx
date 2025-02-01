import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostStoreScrap } from '@/services/store/storeMutations';

import { useDialogContext } from '@/hooks';

import Icon from '@/components/common/Icon';
import FavoriteButton from '@/components/common/button/FavoriteButton';

interface StoreModalHeaderProps {
  onClose: () => void;
  storeId: number;
}

export default function StoreModalHeader({
  onClose,
  storeId,
}: StoreModalHeaderProps) {
  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const { mutateAsync: postStoreScrap } = usePostStoreScrap();

  const onStoreScrap = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const result = await postStoreScrap({ storeId });

        if (result) {
          showToast('맛집을 찜했어요!', 1000);
        } else {
          showToast('맛집 찜하기를 취소 했어요!', 1000);
        }

        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjectList', {}],
        });
      } catch (err) {
        console.error(err);
        showToast('맛집 찜하기를 실패했어요');
      }
    },
    [postStoreScrap, queryClient, showToast, storeId],
  );

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

      <FavoriteButton size={20} isFavorite={false} onClick={onStoreScrap} />
    </header>
  );
}
