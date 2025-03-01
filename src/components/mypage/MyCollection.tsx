import { useMemo } from 'react';

import { Link } from 'react-router-dom';

import {
  useGetMyCommentList,
  useGetMyPostList,
  useGetMyScrapedPostList,
} from '@/services/post/myPostQueries';

import { collectionAtom } from '@/atoms/tableCollectionAtom';

import {
  myCollectionList,
  myCommentTypeOptionList,
  myPostTypeOptionList,
} from '@/constants';
import { postTypeObj } from '@/constants/serviceConstant';
import { useDialogContext, useHandlePostTable } from '@/hooks';
import { formatDate } from '@/utils';
import { useAtom } from 'jotai';
import { BiExpandVertical } from 'react-icons/bi';

import Pagination from '@/components/common/Pagination';
import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import TableDataCell from '@/components/common/table/TableDataCell';
import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import ScrapedPostCard from '@/components/user/ScrapedPostCard';

export const ITEMS_PER_PAGE = 3;

export default function MyCollection() {
  const { showDialog } = useDialogContext();

  const [currCollection, setCurrCollection] = useAtom(collectionAtom);

  const {
    page: { currentPage, onChangePage },
    sort: { isLatest, onChangeSort },
    category: {
      checkedCategoryOptionList,
      onSetCategoryOptionList,
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
  } = useHandlePostTable();

  const { data: myPostList, isLoading: isMyPostListLoading } =
    useGetMyPostList(currCollection);

  const { data: myCommentList, isLoading: isMyCommentListLoading } =
    useGetMyCommentList(currCollection);

  const { data: myScrapedPostList, isLoading: isMyScrapedPostListLoading } =
    useGetMyScrapedPostList(currCollection);

  const filteredAndOrderedPostList = useMemo(() => {
    const postList =
      currCollection === '내가 쓴 게시글' ? myPostList : myCommentList;

    const filteredList = postList?.filter(post => {
      return checkedCategoryOptionList.some(({ key }) => {
        const postType =
          post.postType === 'PROJECT' ? post?.ptype : post.postType;
        return key === postType;
      });
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
    myPostList,
    myCommentList,
    checkedCategoryOptionList,
    isLatest,
  ]);

  const paginationList = useMemo(() => {
    return filteredAndOrderedPostList?.slice(
      ITEMS_PER_PAGE * (currentPage - 1),
      ITEMS_PER_PAGE * currentPage,
    );
  }, [currentPage, filteredAndOrderedPostList]);

  const totalPages = Math.ceil(
    (filteredAndOrderedPostList?.length || 0) / ITEMS_PER_PAGE,
  );

  const handleShowDialog = async (id: number) => {
    await showDialog({
      key: 'MEAL-RECRUIT-CARD-TYPE',
      element: <MealRecruitCardModal isOwner id={id} isParticipant />,
    });
  };

  const headerCellList = ['체크박스', '작성일', '분류', '글제목', '선택삭제'];

  return (
    <>
      <div className="flex items-center justify-between">
        <ul className="mb-4 mt-6 flex items-center gap-3">
          {myCollectionList.map(collection => (
            <li key={collection}>
              <button
                type="button"
                aria-label={collection}
                onClick={() => {
                  initializePostCheckedBoxList();
                  onChangePage(1);
                  onSetCategoryOptionList(collection);
                  setCurrCollection(collection);
                }}
                className={`${currCollection === collection ? 'bg-mainGray-hover text-white underline' : 'bg-white text-darkGray-active'} cursor-pointer rounded-lg border border-mainGray-hover px-4 py-[10px] text-sm font-medium`}
              >
                {collection}
              </button>
            </li>
          ))}
        </ul>
        {currCollection === '내가 찜한 글' &&
          myScrapedPostList?.content.length !== 0 && (
            <Link to="/mypage/scraped-posts" className="mt-3 text-darkGray">
              더보기
            </Link>
          )}
      </div>

      {/* 내가 쓴 게시글, 내가 쓴 댓글 */}
      {currCollection !== '내가 찜한 글' && (
        <>
          <div className="flex min-h-[230px] flex-col rounded-[20px] bg-white py-6 shadow-card">
            {!isMyPostListLoading && !isMyCommentListLoading && (
              <table>
                <colgroup>
                  <col width="3%" />
                  <col width="10%" />
                  <col width="15%" />
                  <col width="60%" />
                  <col width="10%" />
                </colgroup>

                <thead>
                  <tr className="text-center">
                    {headerCellList.map(name => (
                      <th key={name} className="relative pb-4 font-normal">
                        {name === '체크박스' && (
                          <Checkbox
                            id={name}
                            checked={
                              paginationList.length !== 0 &&
                              checkedPostIdList.length === paginationList.length
                            }
                            disabled={paginationList.length === 0}
                            onChange={() => {
                              const postList = paginationList.map(
                                ({ postId }) => postId,
                              );
                              return onPostCheckboxListChange(
                                checkedPostIdList.length !== 0 ? [] : postList,
                              );
                            }}
                            inputClassName="!rounded-lg ml-6 size-5"
                          />
                        )}
                        {name === '작성일' && (
                          <button
                            type="button"
                            onClick={onChangeSort}
                            className="flex w-full items-center justify-center pl-3"
                          >
                            <span>{name}</span>
                            <BiExpandVertical className="inline size-5 cursor-pointer px-0.5 text-darkGray-hover" />
                          </button>
                        )}
                        {name === '분류' && (
                          <div className="flex items-center justify-center">
                            <MultiSelectDropdown
                              isDefaultLabelSelectBox
                              selectBoxClassName="border-none pl-1.5 !gap-0"
                              options={
                                currCollection === '내가 쓴 게시글'
                                  ? myPostTypeOptionList
                                  : myCommentTypeOptionList
                              }
                              optionClassName="w-32"
                              defaultLabel="분류"
                              value={checkedCategoryOptionList.map(
                                ({ id }) => id,
                              )}
                              onChangeValue={value => {
                                onCategoryOptionListChange(value);
                                onChangePage(1);
                              }}
                            />
                          </div>
                        )}
                        {name === '글제목' && (
                          <div className="flex w-full pl-11">
                            <span className="block">{name}</span>
                          </div>
                        )}
                        {name === '선택삭제' && (
                          <TrashButton
                            text="선택삭제"
                            onConfirmClick={() =>
                              onDeleteConfirmClick(
                                currCollection,
                                checkedPostIdList,
                              )
                            }
                            disabled={
                              paginationList.length === 0 ||
                              checkedPostIdList.length === 0
                            }
                            className="mr-4 !text-black disabled:!text-mainGray"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginationList.length !== 0 ? (
                    paginationList.map(
                      ({
                        postId,
                        postType,
                        ptype,
                        createdAt,
                        title,
                        linkedId,
                      }) => (
                        <tr key={createdAt} className="hover:bg-gray4 group">
                          <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                            <Checkbox
                              id={postType}
                              checked={!!checkedPostIdList.includes(postId)}
                              onChange={() => onPostCheckboxChange(postId)}
                              inputClassName="!rounded-lg"
                            />
                          </TableDataCell>

                          <TableDataCell>
                            {formatDate(createdAt, 'yy.MM.dd')}
                          </TableDataCell>

                          <TableDataCell>
                            {
                              postTypeObj[
                                postType === 'PROJECT' ? ptype : postType
                              ]
                            }
                          </TableDataCell>

                          <TableDataCell className="max-w-[0px] overflow-hidden truncate pl-11 text-start">
                            {postType !== 'MEAL' && (
                              <Link
                                to={`/${postType === 'PROJECT' ? 'lounge' : 'notice'}/post/${postId}`}
                                className="underline"
                              >
                                {title}
                              </Link>
                            )}
                            {postType === 'MEAL' && (
                              <button
                                type="button"
                                className="underline"
                                onClick={() => {
                                  handleShowDialog(linkedId);
                                }}
                              >
                                {title}
                              </button>
                            )}
                          </TableDataCell>

                          <TableDataCell className="pr-6 [&>button]:px-2">
                            <TrashButton
                              className="px-1.5 py-2"
                              onConfirmClick={() =>
                                onDeleteConfirmClick(currCollection, [postId])
                              }
                              disabled={
                                isDeletePostPending || isDeleteCommentPending
                              }
                            />
                          </TableDataCell>
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="w-full">
                        <span className="my-12 flex justify-center text-mainGray">
                          {`아직 ${currCollection}이 없어요`}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

      {!isMyScrapedPostListLoading &&
        currCollection === '내가 찜한 글' &&
        (myScrapedPostList?.content.length !== 0 ? (
          <ul className="grid min-h-[230px] grid-cols-3 gap-5">
            {myScrapedPostList?.content
              ?.slice(0, 3)
              ?.map(card => <ScrapedPostCard key={card.postId} card={card} />)}
          </ul>
        ) : (
          <div className="flex h-[230px] items-center justify-center rounded-[20px] border bg-white p-3">
            <span className="text-mainGray">아직 찜한 글이 없어요!</span>
          </div>
        ))}
    </>
  );
}
