import { useMemo, useState } from 'react';

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
    editedContent: string;
  }>;
}

const PAGE_PER_NUM = 10;

export const useHandleComment = ({ postId, reset }: UseHandleCommentProps) => {
  const [currPage, setCurrPage] = useState(1);

  const [isEditingComment, setIsEditingComment] = useState({
    commentId: 0,
    isEditing: false,
  });

  const queryClient = useQueryClient();

  const { data: commentList = [], isLoading: isCommentListLoading } =
    useGetCommentByPostList(postId);

  const { data: { profileImageUrl: imgUrl } = initialUserProfile } =
    useGetUserProfile();

  const movePage = (page: number) => setCurrPage(page);

  const totalPage = Math.ceil(commentList.length / PAGE_PER_NUM);

  const commentListPerPage = useMemo(() => {
    const startNum = (currPage - 1) * PAGE_PER_NUM;
    return commentList.slice(startNum, startNum + PAGE_PER_NUM);
  }, [commentList, currPage]);

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['useGetCommentByPostList'],
    });
  };

  const { mutateAsync: postComment, isPending: isPostCommentPending } =
    usePostComment(postId, {
      onSuccess: invalidateQueries,
    });

  const { mutateAsync: editComment, isPending: isEditCommentPending } =
    usePatchComment({
      onSuccess: invalidateQueries,
    });

  const { mutateAsync: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment({
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
    editedContent,
    commentId,
  }: {
    editedContent: string;
    commentId: number;
  }) => {
    if (editedContent === '') return;

    try {
      await editComment({ commentId, postId, imgUrl, content: editedContent });
      showToast('댓글을 수정했어요!');
      toggleEditingComment();
      reset();
    } catch (err) {
      showToast('댓글수정을 실패했어요');
    }
  };

  const onDeleteCommentClick = async (commentId: number) => {
    try {
      await deleteComment({ commentId });
      if (commentListPerPage.length === 1) {
        movePage(currPage - 1);
      }
      showToast('댓글을 삭제했어요!');
    } catch (err) {
      showToast('댓글삭제를 실패했어요');
    }
  };

  return {
    commentList,
    commentListPerPage,
    onSubmit,
    onEditSubmit,
    isEditingComment,
    toggleEditingComment,
    onDeleteCommentClick,
    isCommentListLoading,
    isPostCommentPending,
    isEditCommentPending,
    isDeleteCommentPending,
    currPage,
    totalPage,
    movePage,
  };
};
