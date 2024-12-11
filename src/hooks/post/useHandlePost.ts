import { useNavigate } from 'react-router-dom';

import { UseMutateAsyncFunction, useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { AxiosError } from 'axios';

interface UseHandlePostProps<T> {
  postId: T;
  postType: '프로젝트를' | '공지사항을';
  handleDelete?: {
    deletePost: UseMutateAsyncFunction<boolean, AxiosError<unknown>, T>;
    navigateTo: string;
  };
  handleEdit?: {
    navigateTo: string;
  };
  invalidateQueryKeys: string[];
}

export const useHandlePost = <T>({
  postId,
  postType,
  handleDelete,
  handleEdit,
  invalidateQueryKeys,
}: UseHandlePostProps<T>) => {
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
      navigate(handleEdit.navigateTo);
    }
  };

  const deleteAction = {
    label: '삭제하기',
    onClick: handleDeletePost,
    className: 'bg-gray2',
  };

  const editAction = {
    label: '수정하기',
    onClick: handleEditPost,
    className: 'bg-oliveGreen1',
  };

  const actions = [
    ...(handleDelete ? [deleteAction] : []),
    ...(handleEdit ? [editAction] : []),
  ];

  return {
    actions,
  };
};
