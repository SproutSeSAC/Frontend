import { useState } from 'react';

import {
  useGetUserCommentList,
  useGetUserPostList,
  useGetUserScrapList,
} from '@/services/admin/userToManageQueries';

import { myCommentTypeOptionList, myPostTypeOptionList } from '@/constants';
import { useDialogContext, useFilterData, useHandlePostTable } from '@/hooks';
import { UserComment } from '@/types';
import { UserPost } from '@/types/mypage/myPostDto';

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

type Collection = '게시글' | '댓글' | '찜한 글';

export type Header =
  | '체크박스'
  | '작성일'
  | '분류'
  | '댓글 내용'
  | '게시글 제목'
  | '선택 삭제';

const initialFilter = { page: 1, size: 5 };

export default function UserPostCollection({
  userId,
  username,
}: UserPostCollectionProps) {
  const [currCollection, setCurrCollection] = useState<Collection>('게시글');

  const { showDialog } = useDialogContext();

  const { currFilter, handleChangeFilter } = useFilterData({ initialFilter });

  const { data: postList, isLoading: isUserPostListLoading } =
    useGetUserPostList(userId, currFilter);

  const { data: commentList, isLoading: isUserCommentListLoading } =
    useGetUserCommentList(userId, currFilter);

  const { data: scrapList, isLoading: isUserScrapListLoading } =
    useGetUserScrapList(userId, currFilter);

  const {
    page: { currentPage, totalPage },
    order: { onChangeOrder },
    category: {
      checkedCategoryOptionList,
      setCategoryOptionListByCollection,
      onCategoryOptionListChange,
    },
    filteredAndOrderedPostList,
  } = useHandlePostTable<Collection>({
    currCollection,
    postList,
    commentList,
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

  const categoryOptionList =
    currCollection === '댓글' ? myCommentTypeOptionList : myPostTypeOptionList;

  const onCollectionTabClick = (collection: Collection) => {
    setCategoryOptionListByCollection(collection);
    setCurrCollection(collection);
  };

  const headerCellList: Header[] = ['작성일', '분류', '게시글 제목'];

  return (
    <>
      <PostCollectionTabList<Collection>
        collectionList={['게시글', '댓글', '찜한 글']}
        currCollection={currCollection}
        onTabClick={onCollectionTabClick}
        user={{ userId, username }}
      />

      {currCollection !== '찜한 글' && (
        <>
          <div className="mb-4 flex !min-h-[270px] flex-1 flex-col rounded-[20px] border border-mainGray-hover bg-white px-4 py-5 pb-4">
            {!isUserPostListLoading && !isUserCommentListLoading && (
              <TableContainer colWidthList={[18, 20, 55]}>
                <TableHeader<Collection>
                  headerCellList={headerCellList}
                  currCollection={currCollection}
                  onChangeOrder={onChangeOrder}
                  categoryOptionList={categoryOptionList}
                  checkedCategoryOptionList={checkedCategoryOptionList}
                  onChangeCategory={onCategoryOptionListChange}
                />

                <TableBody<UserPost | UserComment>
                  colLength={3}
                  paginationList={filteredAndOrderedPostList}
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
            )}
          </div>

          {filteredAndOrderedPostList?.length !== 0 && (
            <Pagination
              totalPages={totalPage || 1}
              currentPage={currentPage || 1}
              onPageChange={(page: number) => {
                handleChangeFilter({ page, size: currFilter.size });
              }}
            />
          )}
        </>
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
