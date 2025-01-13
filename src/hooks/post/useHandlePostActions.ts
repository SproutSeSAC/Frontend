import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks';

type Actions = {
  edit?: {
    label?: '수정하기' | '수정';
    action: () => void;
    className?: string;
  };
  delete?: {
    label?: '삭제하기' | '삭제';
    action: () => void;
    className?: string;
  };
};

interface UseHandlePostProps {
  postType: '프로젝트를' | '공지사항을';
  requiredActions: Actions;
  invalidateQueryKeys: string[];
}

export const useHandlePostActions = ({
  postType,
  requiredActions,
  invalidateQueryKeys,
}: UseHandlePostProps) => {
  const { showToast, hideDialog, alert } = useDialogContext();

  const queryClient = useQueryClient();

  const deleteAction = async () => {
    if (requiredActions?.delete) {
      try {
        const { action: deletePost } = requiredActions.delete;
        deletePost();
        showToast(`${postType} 삭제했습니다.`);
        if (invalidateQueryKeys) {
          queryClient.invalidateQueries({ queryKey: invalidateQueryKeys });
        }
      } catch (err) {
        showToast(`${postType.slice(0, -1)} 삭제를 실패했습니다.`);
      }
    }
    hideDialog();
  };

  const onDeleteClick = () => {
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
          onClick: deleteAction,
        },
      ],
    });
  };

  /** Actions */
  const deleteActionObj = {
    onClick: onDeleteClick,
    label: requiredActions?.delete?.label ?? '삭제하기',
    className: `font-semibold text-red-500 text-[15px] ${requiredActions?.delete?.className ?? ''}`,
  };

  const editActionObj = {
    onClick: requiredActions.edit?.action ?? (() => {}),
    label: requiredActions?.edit?.label ?? '수정하기',
    className: `font-semibold text-[15px] ${requiredActions?.edit?.className ?? ''}`,
  };

  const actions = [
    ...(requiredActions.delete ? [deleteActionObj] : []),
    ...(requiredActions.edit ? [editActionObj] : []),
  ];

  return {
    actions,
  };
};
