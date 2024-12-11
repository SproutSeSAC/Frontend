import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks';

interface UseHandleOnScrapProps {
  getScrapResult: () => Promise<boolean>;
  invalidateQueryKeys: string[];
}

export const useHandleOnScrap = ({
  getScrapResult,
  invalidateQueryKeys,
}: UseHandleOnScrapProps) => {
  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const onScrapClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const result = await getScrapResult();

        showToast(
          result ? '게시물을 찜했어요!' : '게시물 찜하기를 취소 했어요!',
          1000,
        );
        if (invalidateQueryKeys) {
          queryClient.invalidateQueries({
            queryKey: invalidateQueryKeys,
          });
        }
      } catch (err) {
        showToast('게시물 찜하기를 실패했어요');
      }
    },
    [invalidateQueryKeys, queryClient, getScrapResult, showToast],
  );

  return {
    onScrapClick,
  };
};
