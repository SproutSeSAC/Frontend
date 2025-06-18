import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { useDeleteComment } from '@/services/comment/commentMutations';
import { useDeleteMyPost } from '@/services/post/postMutation';

import { Option, PostTypeKey, UserManagementDto } from '@/types';
import { MyPostDto, UserComment, UserPost } from '@/types/mypage/myPostDto';

type ContentList = {
  contentList?:
    | MyPostDto.GetPostList
    | UserManagementDto.GetPostList
    | MyPostDto.GetCommentList
    | UserManagementDto.GetCommentList;
  categoryOptionList: Option[];
};

interface UseHandlePostTableProps<T> {
  currCollection: T;
  contentList: ContentList;
  tableFilter: MyPostDto.GetPostListParams;
  handleChangeFilter: (newData: Partial<MyPostDto.GetPostListParams>) => void;
}

export const useHandlePostTable = <T extends string>({
  currCollection,
  contentList: { contentList, categoryOptionList },
  tableFilter,
  handleChangeFilter,
}: UseHandlePostTableProps<T>) => {
  const queryClient = useQueryClient();

  const [currCheckedIdList, setCurrCheckedIdList] = useState<number[]>([]);

  const onTableItemCheckboxChange = (Id: number) => {
    setCurrCheckedIdList(prev => {
      if (prev.includes(Id)) {
        return prev.filter(checkedPostId => checkedPostId !== Id);
      }
      return [...prev, Id];
    });
  };

  const onPostCheckboxListChange = (idList: number[]) => {
    setCurrCheckedIdList(idList);
  };

  const initializePostCheckedBoxList = () => setCurrCheckedIdList([]);

  const { mutateAsync: deletePost, isPending: isDeletePostPending } =
    useDeleteMyPost();

  const { mutateAsync: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment();

  const isCheckBoxChecked =
    contentList?.content.length !== 0 &&
    currCheckedIdList.length === contentList?.content.length;

  const onHeaderCheckBoxClick = () => {
    const idList = currCollection.includes('게시글')
      ? (contentList?.content as UserPost[]).map(({ postId }) => postId)
      : (contentList?.content as UserComment[]).map(({ commentId: id }) => id);

    const checkedIdList = currCheckedIdList.length !== 0 ? [] : idList;

    return onPostCheckboxListChange(checkedIdList);
  };

  const checkedCategoryOptionList = categoryOptionList?.filter(option =>
    tableFilter.postTypes?.includes(option?.key as PostTypeKey),
  );

  const onChangeCategory = (optionList: Option[]) => {
    const postTypes = optionList.map(({ key }) => key as PostTypeKey);
    handleChangeFilter({ postTypes, page: 1 });
  };

  const onChangeOrder = () => {
    const order = tableFilter.order === 'latest' ? 'oldest' : 'latest';
    handleChangeFilter({ order });
  };

  const disabledDelete =
    contentList?.content.length === 0 || currCheckedIdList.length === 0;

  const { showToast } = useDialogContext();

  const handleBatchDelete = async (
    deleteFn: (id: number) => void,
    idList: number[],
    queryKey: string[],
  ) => {
    const results = await Promise.allSettled(idList.map(deleteFn));
    await queryClient.invalidateQueries({ queryKey });
    const errorCounts = results.filter(r => r.status === 'rejected').length;

    if (errorCounts) {
      showToast(
        `삭제 중 일부 항목에 오류가 발생하여 삭제하지 못했습니다. 오류 발생 항목 개수: ${errorCounts}`,
      );
    } else {
      showToast('선택한 항목이 삭제되었습니다.');
    }
  };

  const onDeleteConfirmClick = async (collection: T, idList: number[]) => {
    if (collection.includes('게시글')) {
      await handleBatchDelete(
        id => deletePost({ postId: id }),
        idList,
        ['useGetMyPostList'], //
      );
    }

    if (collection.includes('댓글')) {
      await handleBatchDelete(
        id => deleteComment({ commentId: id }),
        idList,
        ['useGetMyCommentList'], //
      );
    }

    initializePostCheckedBoxList();
  };

  return {
    currPostList: contentList,
    page: {
      totalPage: contentList?.totalPages,
      currentPage: contentList?.number,
    },
    postCheckbox: {
      currCheckedIdList,
      isCheckBoxChecked,
      onHeaderCheckBoxClick,
      onTableItemCheckboxChange,
      initializePostCheckedBoxList,
    },
    order: {
      onChangeOrder,
    },
    category: {
      checkedCategoryOptionList,
      onChangeCategory,
    },
    deletePost: {
      onDeleteConfirmClick,
      disabledDelete,
    },
    isDeletePostPending,
    isDeleteCommentPending,
  };
};
