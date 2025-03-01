import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDeleteComment } from '@/services/comment/commentMutations';
import { useDeleteMyPost } from '@/services/post/postMutation';

import { collectionAtom } from '@/atoms/tableCollectionAtom';

import { myCommentTypeOptionList, myPostTypeOptionList } from '@/constants';
import { Collection, Option } from '@/types';
import { useAtomValue } from 'jotai';

export const ITEMS_PER_PAGE = 3;

export const useHandlePostTable = () => {
  const currCollection = useAtomValue(collectionAtom);

  const queryClient = useQueryClient();

  const [isLatest, setIsLatest] = useState(true);

  const [checkedCategoryOptionList, setCheckedCategoryOptionList] = useState<
    Option[]
  >(
    currCollection === '내가 쓴 게시글'
      ? myPostTypeOptionList
      : myCommentTypeOptionList,
  );

  const [checkedPostIdList, setCheckedPostIdList] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const onPostCheckboxChange = (postId: number) => {
    setCheckedPostIdList(prev => {
      if (prev.includes(postId))
        return prev.filter(checkedPostId => checkedPostId !== postId);
      return [...prev, postId];
    });
  };

  const onPostCheckboxListChange = (postIdList: number[]) => {
    setCheckedPostIdList(postIdList);
  };

  const initializePostCheckedBoxList = () => setCheckedPostIdList([]);

  const onChangeSort = () => setIsLatest(prev => !prev);

  const onChangePage = (page: number | 'prevPage' | 'nextPage') => {
    setCurrentPage(
      typeof page === 'number'
        ? page
        : prev => prev + (page === 'nextPage' ? +1 : -1),
    );
  };

  const onSetCategoryOptionList = (collection: Collection) => {
    const optionList =
      collection === '내가 쓴 댓글'
        ? myCommentTypeOptionList
        : myPostTypeOptionList;

    setCheckedCategoryOptionList(optionList);
  };

  const onCategoryOptionListChange = (value: Option[]) => {
    setCheckedCategoryOptionList(value);
  };

  const { mutateAsync: deletePost, isPending: isDeletePostPending } =
    useDeleteMyPost();

  const { mutateAsync: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment();

  const onDeleteConfirmClick = (
    collection: Collection,
    postIdList: number[],
  ) => {
    if (
      currentPage > 1 &&
      (postIdList.length === ITEMS_PER_PAGE || postIdList.length === 1)
    ) {
      onChangePage('prevPage');
    }
    initializePostCheckedBoxList();
    return postIdList.map(async postId => {
      if (collection === '내가 쓴 게시글') {
        await deletePost({ postId });
        await queryClient.invalidateQueries({ queryKey: ['useGetMyPostList'] });
      }
      if (collection === '내가 쓴 댓글') {
        await deleteComment({ commentId: postId });
        await queryClient.invalidateQueries({
          queryKey: ['useGetMyCommentList'],
        });
      }
      return postId;
    });
  };

  return {
    sort: {
      isLatest,
      onChangeSort,
    },
    category: {
      checkedCategoryOptionList,
      onSetCategoryOptionList,
      onCategoryOptionListChange,
    },
    page: {
      currentPage,
      onChangePage,
    },
    postCheckbox: {
      checkedPostIdList,
      onPostCheckboxListChange,
      onPostCheckboxChange,
      initializePostCheckedBoxList,
    },
    onDeleteConfirmClick,
    isDeletePostPending,
    isDeleteCommentPending,
  };
};
