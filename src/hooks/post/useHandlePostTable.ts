import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDeleteComment } from '@/services/comment/commentMutations';
import { useDeleteMyPost } from '@/services/post/postMutation';

import { Option, PostTypeKey, UserManagementDto } from '@/types';
import { MyPostDto } from '@/types/mypage/myPostDto';

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
  contentList: { contentList, categoryOptionList },
  tableFilter,
  handleChangeFilter,
}: UseHandlePostTableProps<T>) => {
  const queryClient = useQueryClient();

  const [checkedPostIdList, setCheckedPostIdList] = useState<number[]>([]);

  const onPostCheckboxChange = (postId: number) => {
    setCheckedPostIdList(prev => {
      if (prev.includes(postId)) {
        return prev.filter(checkedPostId => checkedPostId !== postId);
      }
      return [...prev, postId];
    });
  };

  const onPostCheckboxListChange = (postIdList: number[]) => {
    setCheckedPostIdList(postIdList);
  };

  const initializePostCheckedBoxList = () => setCheckedPostIdList([]);

  const { mutateAsync: deletePost, isPending: isDeletePostPending } =
    useDeleteMyPost();

  const { mutateAsync: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment();

  const isCheckBoxChecked =
    contentList?.content.length !== 0 &&
    checkedPostIdList.length === contentList?.content.length;

  const onCheckBoxClick = () => {
    const idList = contentList?.content.map(({ postId }) => postId) || [];
    const checkedIdList = checkedPostIdList.length !== 0 ? [] : idList;
    return onPostCheckboxListChange(checkedIdList);
  };

  const checkedCategoryOptionList = categoryOptionList?.filter(option =>
    tableFilter.postTypes?.includes(option?.key as PostTypeKey),
  );

  const onChangeCategory = (optionList: Option[]) => {
    const postTypes = optionList.map(({ key }) => key as PostTypeKey);
    handleChangeFilter({ postTypes });
  };

  const onChangeOrder = () => {
    const order = tableFilter.order === 'latest' ? 'oldest' : 'latest';
    handleChangeFilter({ order });
  };

  const disabledDelete =
    contentList?.content.length === 0 || checkedPostIdList.length === 0;

  const onDeleteConfirmClick = (collection: T, postIdList: number[]) => {
    initializePostCheckedBoxList();

    return postIdList.map(async postId => {
      if (collection.includes('게시글')) {
        await deletePost({ postId });
        await queryClient.invalidateQueries({ queryKey: ['useGetMyPostList'] });
      }
      if (collection.includes('댓글')) {
        await deleteComment({ commentId: postId });
        await queryClient.invalidateQueries({
          queryKey: ['useGetMyCommentList'],
        });
      }
      return postId;
    });
  };

  return {
    currPostList: contentList,
    page: {
      totalPage: contentList?.totalPages,
      currentPage: contentList?.number,
    },
    postCheckbox: {
      checkedPostIdList,
      isCheckBoxChecked,
      onCheckBoxClick,
      onPostCheckboxChange,
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
