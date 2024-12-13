import { useNavigate } from 'react-router-dom';

import { UseMutateAsyncFunction, useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { AxiosError } from 'axios';

interface UseHandlePostProps<T, K> {
  postId: T;
  postType: '프로젝트를' | '공지사항을';
  handleDelete?: {
    deletePost: UseMutateAsyncFunction<boolean, AxiosError<unknown>, T>;
    navigateTo: string;
  };
  handleEdit?: {
    detail?: K;
    navigateTo: string;
  };
  invalidateQueryKeys: string[];
}

export const useHandlePost = <T, K>({
  postId,
  postType,
  handleDelete,
  handleEdit,
  invalidateQueryKeys,
}: UseHandlePostProps<T, K>) => {
  const { showToast, hideDialog, alert } = useDialogContext();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleDeletePost = async () => {
    alert({
      text: `정말 ${postType} 삭제하시겠어요?`,
      subText:
        '삭제하면 모든 정보가 사라지며, 복구할 수 없어요.\n 그래도 계속하시겠어요?',
      buttonList: [
        {
          name: '닫기',
          color: 'gray',
          onClick: hideDialog,
        },
        {
          name: '삭제',
          onClick: async () => {
            try {
              if (handleDelete?.deletePost) {
                await handleDelete.deletePost(postId);
              }
              showToast(`${postType} 삭제했습니다.`);
              if (handleDelete?.navigateTo) {
                navigate(handleDelete.navigateTo);
              }
              if (invalidateQueryKeys) {
                queryClient.invalidateQueries({
                  queryKey: invalidateQueryKeys,
                });
              }
            } catch (err) {
              showToast(`${postType.slice(0, -1)} 삭제를 실패했습니다.`);
            }
            hideDialog();
          },
        },
      ],
    });
  };

  const handleEditPost = () => {
    if (handleEdit?.navigateTo) {
      navigate(handleEdit.navigateTo, { state: handleEdit.detail });
    }
  };

  /* Actions */
  const deleteAction = {
    label: '삭제하기',
    onClick: handleDeletePost,
    className: 'font-semibold text-red-500 text-[15px]',
  };
  const editAction = {
    label: '수정하기',
    onClick: handleEditPost,
    className: 'font-semibold text-[15px]',
  };
  const actions = [
    ...(handleDelete ? [deleteAction] : []),
    ...(handleEdit ? [editAction] : []),
  ];

  return {
    actions,
  };
};
