import {
  useGetMyCommentList,
  useGetMyPostList,
  useGetMyScrapedPostList,
} from '@/services/post/myPostQueries';

import { myCollectionAtom } from '@/atoms/tableCollectionAtom';

import {
  myCollectionList,
  myCommentTypeOptionList,
  myPostTypeOptionList,
} from '@/constants';
import { useDialogContext, useHandlePostTable } from '@/hooks';
import { MyCollection as Collection, UserComment } from '@/types';
import { UserPost } from '@/types/mypage/myPostDto';
import { useAtom } from 'jotai';

import { Header } from '@/pages/admin/UserPostCollection';

import LoopLoading from '@/components/common/LoopLoading';
import Pagination from '@/components/common/Pagination';
import TableBody from '@/components/common/table/TableBody';
import TableContainer from '@/components/common/table/TableContainer';
import TableHeader from '@/components/common/table/TableHeader';
import MyCommentModal from '@/components/mypage/MyCommentModal';
import PostCollectionTabList from '@/components/post-collection/PostCollectionTabList';
import PostTableRow from '@/components/post-collection/PostTableRow';
import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import ScrapedPostCard from '@/components/user/ScrapedPostCard';

export const ITEMS_PER_PAGE = 3;

export default function MyCollection() {
  const { showDialog } = useDialogContext();

  const [currCollection, setCurrCollection] = useAtom(myCollectionAtom);

  const { data: postList, isLoading: isMyPostListLoading } =
    useGetMyPostList(currCollection);

  const { data: commentList, isLoading: isMyCommentListLoading } =
    useGetMyCommentList(currCollection);

  const { data: scrapedPostList, isLoading: isScrapedPostListLoading } =
    useGetMyScrapedPostList(currCollection);

  const {
    page: { currentPage, onChangePage, totalPages },
    sort: { onChangeSort },
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
    paginationList,
    filteredAndOrderedPostList,
  } = useHandlePostTable<Collection>({
    currCollection,
    postList,
    commentList,
    itemListPerPage: 3,
  });

  const handleShowDialog = async (
    type: 'MEAL' | 'STORE',
    id: number,
    myComment: { comment: string; nickname: string },
  ) => {
    if (type === 'MEAL') {
      await showDialog({
        key: 'MEAL-RECRUIT-CARD-TYPE',
        element: <MealRecruitCardModal isOwner id={id} isParticipant />,
      });
    } else {
      await showDialog({
        key: 'STORE_MODAL',
        element: (
          <MyCommentModal
            postId={id}
            comment={myComment.comment}
            nickname={myComment.nickname}
          />
        ),
      });
    }
  };

  const isChecked =
    paginationList.length !== 0 &&
    checkedPostIdList.length === paginationList.length;

  const disabledDelete =
    paginationList.length === 0 || checkedPostIdList.length === 0;

  const sortOptionList =
    currCollection === '내가 쓴 댓글'
      ? myCommentTypeOptionList
      : myPostTypeOptionList;

  const headerCellList: Header[] = [
    '체크박스',
    '작성일',
    '분류',
    '게시글 제목',
    '선택 삭제',
  ];

  return (
    <>
      <PostCollectionTabList<Collection>
        collectionList={myCollectionList}
        currCollection={currCollection}
        onTabClick={(collection: Collection) => {
          initializePostCheckedBoxList();
          onChangePage(1);
          setCategoryOptionListByCollection(collection);
          setCurrCollection(collection);
        }}
      />

      {currCollection !== '내가 찜한 글' && (
        <>
          <div className="mb-8 flex min-h-[230px] flex-col rounded-[20px] bg-white p-6">
            {!isMyPostListLoading && !isMyCommentListLoading && (
              <TableContainer colWidthList={[3, 10, 12, 70, 5]}>
                <TableHeader
                  headerCellList={headerCellList}
                  currCollection={currCollection}
                  isChecked={isChecked}
                  disabledCheck={false}
                  onCheckboxClick={() => {
                    const idList = paginationList.map(({ postId }) => postId);
                    return onPostCheckboxListChange(
                      checkedPostIdList.length !== 0 ? [] : idList,
                    );
                  }}
                  sortOptionList={sortOptionList}
                  onChangeSort={onChangeSort}
                  checkedCategoryOptionList={checkedCategoryOptionList}
                  onChangeCategory={onCategoryOptionListChange}
                  disabledDelete={disabledDelete}
                  onDeleteConfirmClick={() => {}}
                />
                <TableBody<UserPost | UserComment>
                  paginationList={paginationList}
                  colLength={5}
                >
                  {post => (
                    <PostTableRow
                      headerCellList={headerCellList}
                      post={post}
                      handleShowDialog={handleShowDialog}
                      checkedPostIdList={checkedPostIdList}
                      onPostCheckboxChange={onPostCheckboxChange}
                      onDeleteConfirmClick={(postId: number) =>
                        onDeleteConfirmClick(currCollection, [postId])
                      }
                    />
                  )}
                </TableBody>
              </TableContainer>
            )}
          </div>

          {filteredAndOrderedPostList?.length !== 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(pageNum: number) => {
                initializePostCheckedBoxList();
                onChangePage(pageNum);
              }}
            />
          )}
        </>
      )}

      {currCollection === '내가 찜한 글' && (
        <>
          {!isScrapedPostListLoading &&
            (scrapedPostList?.content.length !== 0 ? (
              <ul className="grid min-h-[230px] grid-cols-3 gap-5">
                {scrapedPostList?.content
                  ?.slice(0, 3)
                  ?.map(card => (
                    <ScrapedPostCard key={card.postId} card={card} />
                  ))}
              </ul>
            ) : (
              <div className="flex h-[230px] items-center justify-center rounded-[20px] border bg-white p-3">
                <span className="text-mainGray">아직 찜한 글이 없어요!</span>
              </div>
            ))}

          {isScrapedPostListLoading && (
            <div className="flex h-[230px] items-center justify-center rounded-[20px] border bg-white p-3">
              <LoopLoading size={90} />
            </div>
          )}
        </>
      )}
    </>
  );
}
