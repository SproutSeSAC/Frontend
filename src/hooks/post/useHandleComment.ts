import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useDeleteComment,
  usePatchComment,
  usePostComment,
} from '@/services/comment/commentMutations';
import { useGetCommentByPostList } from '@/services/comment/commentQueries';

import { useDialogContext } from '@/hooks';
import { UseFormReset } from 'react-hook-form';

interface UseHandleCommentProps {
  postId: number;
  reset: UseFormReset<{
    content: string;
  }>;
}

export const useHandleComment = ({ postId, reset }: UseHandleCommentProps) => {
  const [isEditingComment, setIsEditingComment] = useState({
    commentId: 0,
    isEditing: false,
  });

  const queryClient = useQueryClient();

  const { data: commentList = [] } = useGetCommentByPostList(postId);

  const { data: { profileImageUrl: imgUrl } = initialUserProfile } =
    useGetUserProfile();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['useGetCommentByPostList'],
    });
  };

  const { mutateAsync: postComment } = usePostComment(postId, {
    onSuccess: invalidateQueries,
  });

  const { mutateAsync: editComment } = usePatchComment({
    onSuccess: invalidateQueries,
  });

  const { mutateAsync: deleteComment } = useDeleteComment({
    onSuccess: invalidateQueries,
  });

  const { showToast } = useDialogContext();

  const toggleEditingComment = (commentId?: number) => {
    setIsEditingComment(prev => ({
      commentId: commentId || 0,
      isEditing: !prev.isEditing,
    }));
  };

  const onSubmit = async ({ content }: { content: string }) => {
    if (content === '') return;

    try {
      await postComment({ imgUrl, content });
      showToast('댓글을 등록했어요!');
      reset();
    } catch (err) {
      showToast('댓글등록을 실패했어요');
    }
  };

  const onEditSubmit = async ({
    content,
    commentId,
  }: {
    content: string;
    commentId: number;
  }) => {
    if (content === '') return;

    try {
      await editComment({ commentId, postId, imgUrl, content });
      showToast('댓글을 수정했어요!');
      toggleEditingComment();
      reset();
    } catch (err) {
      showToast('댓글수정을 실패했어요');
    }
  };

  return {
    commentList,
    onSubmit,
    onEditSubmit,
    isEditingComment,
    toggleEditingComment,
    deleteComment,
  };
};
