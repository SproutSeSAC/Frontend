import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDeleteComment } from '@/services/comment/commentMutations';
import { useDeleteMyPost } from '@/services/post/postMutation';

import { myCommentTypeOptionList, myPostTypeOptionList } from '@/constants';
import { Option, UserComment } from '@/types';
import { UserPost } from '@/types/mypage/myPostDto';

export type CommentItem = {
  postType: 'MEAL' | 'STORE' | 'NOTICE' | 'PROJECT' | 'STUDY';
  title: string;
  createdNickName: string;
  linkedId: number;
  postId: number;
  commentId: number;
  createdAt: string;
};

interface UseHandlePostTableProps<T> {
  currCollection: T;
  postList?: UserPost[];
  commentList?: UserComment[];
  itemListPerPage?: number;
}

export const useHandlePostTable = <T extends string>({
  currCollection,
  postList,
  commentList,
  itemListPerPage = 3,
}: UseHandlePostTableProps<T>) => {
  const queryClient = useQueryClient();

  const [isLatest, setIsLatest] = useState(true);

  const [checkedCategoryOptionList, setCheckedCategoryOptionList] = useState<
    Option[]
  >(
    currCollection.includes('게시글')
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

  const setCategoryOptionListByCollection = (collection: T) => {
    const optionList = collection.includes('댓글')
      ? myCommentTypeOptionList
      : myPostTypeOptionList;

    setCheckedCategoryOptionList(optionList);
  };

  const onCategoryOptionListChange = (value: Option[]) => {
    setCheckedCategoryOptionList(value);
    onChangePage(1);
  };

  const { mutateAsync: deletePost, isPending: isDeletePostPending } =
    useDeleteMyPost();

  const { mutateAsync: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment();

  const onDeleteConfirmClick = (collection: T, postIdList: number[]) => {
    if (
      currentPage > 1 &&
      (postIdList.length === itemListPerPage || postIdList.length === 1)
    ) {
      onChangePage('prevPage');
    }
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

  const filteredAndOrderedPostList = useMemo(() => {
    const currPostList = currCollection.includes('게시글')
      ? postList
      : commentList;

    const filteredList = currPostList?.filter(({ postType }) => {
      return checkedCategoryOptionList.some(({ key }) => key === postType);
    });

    const orderedList = filteredList?.sort((a, b) => {
      const getPostTime = (createdAt: string) => new Date(createdAt).getTime();

      if (!isLatest) {
        return getPostTime(a.createdAt) - getPostTime(b.createdAt);
      }
      return getPostTime(b.createdAt) - getPostTime(a.createdAt);
    });
    return orderedList || [];
  }, [
    currCollection,
    postList,
    commentList,
    checkedCategoryOptionList,
    isLatest,
  ]);

  const paginationList = useMemo(() => {
    return filteredAndOrderedPostList?.slice(
      itemListPerPage * (currentPage - 1),
      itemListPerPage * currentPage,
    );
  }, [currentPage, filteredAndOrderedPostList, itemListPerPage]);

  const totalPages = Math.ceil(
    (filteredAndOrderedPostList?.length || 0) / itemListPerPage,
  );

  return {
    paginationList,
    filteredAndOrderedPostList,

    sort: {
      isLatest,
      onChangeSort,
    },
    category: {
      checkedCategoryOptionList,
      setCategoryOptionListByCollection,
      onCategoryOptionListChange,
    },
    page: {
      currentPage,
      onChangePage,
      totalPages,
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
