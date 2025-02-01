import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostMyComment } from '@/services/comment/commentMutations';
import { useGetCommentByPostList } from '@/services/comment/commentQueries';

import { useDialogContext } from '@/hooks';

interface UseHandleCommentProps {
  postId: number;
  invalidateQueryKeys: string[];
}

// CRUD
export const useHandleComment = ({
  postId,
  invalidateQueryKeys,
}: UseHandleCommentProps) => {
  const { data: commentList = [] } = useGetCommentByPostList(postId);

  const { mutateAsync: postComment } = usePostMyComment(postId);

  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const handleSubmitComment = useCallback(
    async (data: { imgUrl: string; content: string }) => {
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
    commentList,
    handleSubmitComment,
  };
};
