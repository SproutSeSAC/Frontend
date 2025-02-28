import { useQueryClient } from '@tanstack/react-query';

import { useDeleteScrap, usePostScrap } from '@/services/post/postMutation';

import { useDialogContext } from '@/hooks';

interface UseHandleOnScrapProps {
  postId: number;
  isScraped: boolean;
  invalidateQueryKeys: { queryKey: (string | number)[] }[];
}

export const useHandleScrap = ({
  postId,
  isScraped,
  invalidateQueryKeys,
}: UseHandleOnScrapProps) => {
  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const { mutateAsync: postScrap, isPending: isPostScrapPending } =
    usePostScrap();

  const {
    mutateAsync: deleteScrap,
    isPending: isDeleteScrapPending,
    isIdle,
  } = useDeleteScrap();

  const onScrapClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (isScraped) {
        await deleteScrap({ postId });
        showToast('게시물 찜을 취소 했어요!', 1000);
      } else {
        await postScrap({ postId });
        showToast('게시물을 찜했어요!', 1000);
      }

      await Promise.all(
        invalidateQueryKeys.map(queryKey =>
          queryClient.invalidateQueries(queryKey),
        ),
      );
    } catch (err) {
      showToast('게시물 찜하기를 실패했어요');
    }
  };
  return {
    onScrapClick,
    isPostScrapPending,
    isDeleteScrapPending,
    isIdle,
  };
};
