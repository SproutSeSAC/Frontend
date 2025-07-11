import { useState } from 'react';

import {
  useGetUserCommentList,
  useGetUserPostList,
  useGetUserScrapList,
} from '@/services/admin/userToManageQueries';

import {
  adminCategoryOptionList,
  commentTableCategoryOptionList,
} from '@/constants';
import { useDialogContext, useFilterData, useHandlePostTable } from '@/hooks';
import { UserComment } from '@/types';
import { MyPostDto, UserPost } from '@/types/mypage/myPostDto';

import LoopLoading from '@/components/common/LoopLoading';
import Pagination from '@/components/common/Pagination';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import TableBody from '@/components/common/table/TableBody';
import TableContainer from '@/components/common/table/TableContainer';
import TableHeader from '@/components/common/table/TableHeader';
import MyCommentModal from '@/components/mypage/MyCommentModal';
import PostCollectionTabList from '@/components/post-collection/PostCollectionTabList';
import PostTableRow from '@/components/post-collection/PostTableRow';
import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import ScrapedPostCard from '@/components/user/ScrapedPostCard';

interface UserPostCollectionProps {
  userId: number;
  username: string;
}

export type UserCollection = '게시글' | '댓글' | '찜한 글';

export type Header =
  | '체크박스'
  | '작성일'
  | '분류'
  | '댓글 내용'
  | '게시글 제목'
  | '선택삭제';

export default function UserPostCollection({
  userId,
  username,
}: UserPostCollectionProps) {
  const [currCollection, setCurrCollection] =
    useState<UserCollection>('게시글');

  const { showDialog } = useDialogContext();

  const initialFilter: MyPostDto.GetPostListParams = {
    page: 1,
    size: 5,
    sort: 'updated_At,DESC',
  };

  const {
    currFilter: tableFilter,
    handleChangeFilter,
  } = //
    useFilterData({ initialFilter });

  const { data: postList, isLoading: isUserPostListLoading } =
    useGetUserPostList(userId, tableFilter, currCollection);

  const { data: commentList, isLoading: isUserCommentListLoading } =
    useGetUserCommentList(userId, tableFilter, currCollection);

  const { data: scrapList, isLoading: isUserScrapListLoading } =
    useGetUserScrapList(currCollection, tableFilter, userId);

  const contentList = {
    contentList: currCollection.includes('게시글') ? postList : commentList,
    categoryOptionList: currCollection.includes('게시글')
      ? adminCategoryOptionList
      : commentTableCategoryOptionList,
  };

  const {
    currPostList,
    page: { totalPage },
    order: { onChangeOrder },
    category: {
      checkedCategoryOptionList,
      onChangeCategory, //
    },
  } = useHandlePostTable<UserCollection>({
    currCollection,
    contentList,
    tableFilter,
    handleChangeFilter,
  });

  const handleShowDialog = async (
    type: 'MEAL' | 'STORE',
    postId: number,
    myComment: { comment: string; nickname: string },
  ) => {
    if (type === 'MEAL') {
      await showDialog({
        key: 'MEAL-RECRUIT-CARD-TYPE',
        element: <MealRecruitCardModal isOwner id={postId} isParticipant />,
      });
    } else {
      await showDialog({
        key: 'USER_STORE_MODAL',
        element: (
          <MyCommentModal
            postId={postId}
            comment={myComment.comment}
            nickname={myComment.nickname}
          />
        ),
      });
    }
  };

  const onCollectionTabClick = (collection: UserCollection) => {
    handleChangeFilter({ postTypes: [] });
    setCurrCollection(collection);
  };

  const headerCellList: Header[] = ['작성일', '분류', '게시글 제목'];

  return (
    <>
      <PostCollectionTabList<UserCollection>
        collectionList={['게시글', '댓글', '찜한 글']}
        currCollection={currCollection}
        onTabClick={(collection: UserCollection) => {
          handleChangeFilter({ postTypes: [], page: 1 });
          onCollectionTabClick(collection);
        }}
        user={{ userId, username }}
      />

      {currCollection !== '찜한 글' && (
        <div className="flex flex-col gap-y-6">
          <div className="flex !min-h-[270px] flex-1 flex-col rounded-[20px] border border-mainGray-hover bg-white px-4 py-5 pb-4">
            <TableContainer colWidthList={[18, 20, 55]}>
              <TableHeader<UserCollection>
                headerCellList={headerCellList}
                currCollection={currCollection}
                onChangeOrder={onChangeOrder}
                categoryOptionList={contentList.categoryOptionList}
                checkedCategoryOptionList={checkedCategoryOptionList}
                onChangeCategory={onChangeCategory}
              />

              <TableBody<UserPost | UserComment>
                colLength={3}
                paginationList={currPostList?.content || []}
                isLoading={isUserPostListLoading || isUserCommentListLoading}
              >
                {post => (
                  <PostTableRow
                    headerCellList={headerCellList}
                    handleShowDialog={handleShowDialog}
                    post={post}
                  />
                )}
              </TableBody>
            </TableContainer>
          </div>

          {currPostList?.content?.length !== 0 && totalPage && (
            <Pagination
              totalPages={totalPage || 1}
              currentPage={tableFilter.page}
              onPageChange={(page: number) => {
                handleChangeFilter({ page, size: tableFilter.size });
              }}
            />
          )}
        </div>
      )}

      {currCollection === '찜한 글' && (
        <>
          {!isUserScrapListLoading &&
            (scrapList?.content.length !== 0 ? (
              <ScrollContainer className="gap-6">
                {scrapList?.content
                  ?.slice(0, 3)
                  ?.map(card => (
                    <ScrapedPostCard
                      key={card.postId}
                      card={card}
                      className="!w-[270px] border border-mainGray-hover"
                      hasScrapBtn={false}
                    />
                  ))}
              </ScrollContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-[20px] border border-mainGray-hover bg-white p-3">
                <span className="text-mainGray">아직 찜한 글이 없어요!</span>
              </div>
            ))}

          {isUserScrapListLoading && (
            <div className="flex h-[200px] items-center justify-center rounded-[20px] border bg-white p-3">
              <LoopLoading size={90} />
            </div>
          )}
        </>
      )}
    </>
  );
}
