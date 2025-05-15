import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDeleteComment } from '@/services/comment/commentMutations';
import { useDeleteMyPost } from '@/services/post/postMutation';

import { myCommentTypeOptionList, myPostTypeOptionList } from '@/constants';
import { Option, UserManagementDto } from '@/types';
import { MyPostDto } from '@/types/mypage/myPostDto';

interface UseHandlePostTableProps<T> {
  currCollection: T;
  postList?: MyPostDto.GetPostList | UserManagementDto.GetPostList;
  commentList?: MyPostDto.GetCommentList | UserManagementDto.GetCommentList;
}

export const useHandlePostTable = <T extends string>({
  currCollection,
  postList,
  commentList,
}: UseHandlePostTableProps<T>) => {
  const queryClient = useQueryClient();

  const [isLatestOrder, setIsLatestOrder] = useState(true);

  const onChangeOrder = () => setIsLatestOrder(prev => !prev);

  const [checkedPostIdList, setCheckedPostIdList] = useState<number[]>([]);

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

  const getCategoryOptionList: (collection: T) => Option[] = collection => {
    return collection.includes('게시글')
      ? myPostTypeOptionList
      : myCommentTypeOptionList;
  };

  const [checkedCategoryOptionList, setCheckedCategoryOptionList] = useState(
    getCategoryOptionList(currCollection),
  );

  const setCategoryOptionListByCollection = (collection: T) => {
    const optionList = getCategoryOptionList(collection);
    setCheckedCategoryOptionList(optionList);
  };

  const onCategoryOptionListChange = (value: Option[]) => {
    setCheckedCategoryOptionList(value);
  };

  const { mutateAsync: deletePost, isPending: isDeletePostPending } =
    useDeleteMyPost();

  const { mutateAsync: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment();

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

  const currPostList = currCollection.includes('게시글')
    ? postList
    : commentList;

  const filteredAndOrderedPostList = useMemo(() => {
    const filteredList = currPostList?.content?.filter(({ postType }) => {
      return checkedCategoryOptionList.some(({ key }) => key === postType);
    });

    const orderedList = filteredList?.sort((a, b) => {
      const getPostTime = (createdAt: string) => new Date(createdAt).getTime();
      if (!isLatestOrder) {
        return getPostTime(a.createdAt) - getPostTime(b.createdAt);
      }
      return getPostTime(b.createdAt) - getPostTime(a.createdAt);
    });

    return orderedList || [];
  }, [currPostList?.content, checkedCategoryOptionList, isLatestOrder]);

  return {
    filteredAndOrderedPostList,
    page: {
      totalPage: currPostList?.totalPages,
      currentPage: currPostList?.number,
    },
    order: {
      isLatestOrder,
      onChangeOrder,
    },
    category: {
      checkedCategoryOptionList,
      setCategoryOptionListByCollection,
      onCategoryOptionListChange,
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
