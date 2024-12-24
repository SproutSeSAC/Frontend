import { useCallback } from 'react';

import { UseMutateAsyncFunction, useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks';
import { AxiosError } from 'axios';

interface UseHandleCommentProps {
  postComment: UseMutateAsyncFunction<
    boolean,
    AxiosError<unknown>,
    {
      content: string;
    },
    unknown
  >;
  invalidateQueryKeys: string[];
}

// CRUD
export const useHandleComment = ({
  postComment,
  invalidateQueryKeys,
}: UseHandleCommentProps) => {
  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const handleSubmitComment = useCallback(
    async (data: { content: string }) => {
      try {
        await postComment(data);

        showToast('댓글을 등록했어요!');

        if (invalidateQueryKeys) {
          queryClient.invalidateQueries({
            queryKey: invalidateQueryKeys,
          });
        }
      } catch (err) {
        showToast('댓글등록을 실패했어요');
      }
    },
    [invalidateQueryKeys, postComment, queryClient, showToast],
  );

  return {
    handleSubmitComment,
  };
};
