import {
  useGetMyCommentList,
  useGetMyPostList,
  useGetMyScrapedPostList,
} from '@/services/post/myPostQueries';

import { myCollectionAtom } from '@/atoms/tableCollectionAtom';

import {
  commentTableCategoryOptionList,
  myCollectionList,
  traineePostTableCategoryOptionList,
} from '@/constants';
import { useDialogContext, useFilterData, useHandlePostTable } from '@/hooks';
import {
  MyCollection as Collection,
  MyPostDto,
  UserComment,
  UserPost,
} from '@/types';
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

export default function MyCollection() {
  const { showDialog } = useDialogContext();

  const [currCollection, setCurrCollection] = useAtom(myCollectionAtom);

  const initialFilter: MyPostDto.GetPostListParams = {
    page: 1,
    size: 3,
    sort: 'updated_At,DESC',
  };

  const {
    currFilter: tableFilter,
    handleChangeFilter, //
  } = useFilterData({ initialFilter });

  const {
    data: postList,
    isLoading: isMyPostListLoading,
  } = //
    useGetMyPostList(currCollection, tableFilter);

  const { data: commentList, isLoading: isMyCommentListLoading } =
    useGetMyCommentList(currCollection, tableFilter);

  const { data: scrapedPostList, isLoading: isScrapedPostListLoading } =
    useGetMyScrapedPostList(currCollection, tableFilter);

  const contentList = {
    contentList: currCollection.includes('게시글') ? postList : commentList,
    categoryOptionList: currCollection.includes('게시글')
      ? traineePostTableCategoryOptionList
      : commentTableCategoryOptionList,
  };

  const {
    currPostList,
    page: { totalPage },
    postCheckbox: {
      currCheckedIdList,
      isCheckBoxChecked,
      onHeaderCheckBoxClick,
      onTableItemCheckboxChange,
      initializePostCheckedBoxList,
    },
    deletePost: {
      onDeleteConfirmClick,
      disabledDelete, //
    },
    order: { onChangeOrder },
    category: {
      checkedCategoryOptionList,
      onChangeCategory, //
    },
  } = useHandlePostTable<Collection>({
    currCollection,
    contentList,
    tableFilter,
    handleChangeFilter,
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

  const headerCellList: Header[] = [
    '체크박스',
    '작성일',
    '분류',
    '게시글 제목',
    '선택삭제',
  ];

  return (
    <>
      <PostCollectionTabList<Collection>
        collectionList={myCollectionList}
        currCollection={currCollection}
        onTabClick={(collection: Collection) => {
          initializePostCheckedBoxList();
          handleChangeFilter({ postTypes: [], page: 1 });
          setCurrCollection(collection);
        }}
      />

      {currCollection !== '내가 찜한 글' && (
        <>
          <div className="mb-8 flex min-h-[220px] flex-col rounded-[20px] bg-white px-6 pb-4 pt-6">
            <TableContainer colWidthList={[3, 10, 12, 64, 6]}>
              <TableHeader
                headerCellList={headerCellList}
                currCollection={currCollection}
                isCheckBoxChecked={isCheckBoxChecked}
                disabledCheckBox={false}
                onCheckboxClick={onHeaderCheckBoxClick}
                onChangeOrder={onChangeOrder}
                categoryOptionList={contentList.categoryOptionList}
                checkedCategoryOptionList={checkedCategoryOptionList}
                onChangeCategory={onChangeCategory}
                disabledDelete={disabledDelete}
                onDeleteConfirmClick={() =>
                  onDeleteConfirmClick(currCollection, currCheckedIdList)
                }
              />
              <TableBody<UserPost | UserComment>
                paginationList={currPostList?.content || []}
                colLength={5}
                isLoading={isMyCommentListLoading || isMyPostListLoading}
              >
                {post => (
                  <PostTableRow
                    headerCellList={headerCellList}
                    post={post}
                    handleShowDialog={handleShowDialog}
                    checkedIdList={currCheckedIdList}
                    onCheckboxChange={onTableItemCheckboxChange}
                    onDeleteConfirmClick={(postId: number) =>
                      onDeleteConfirmClick(currCollection, [postId])
                    }
                  />
                )}
              </TableBody>
            </TableContainer>
          </div>

          {!!totalPage && (
            <Pagination
              totalPages={totalPage}
              currentPage={tableFilter.page}
              onPageChange={(page: number) => {
                handleChangeFilter({ page, size: 3 });
                initializePostCheckedBoxList();
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
                {scrapedPostList?.content?.map(card => (
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
