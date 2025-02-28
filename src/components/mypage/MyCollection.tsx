import { useMemo, useState } from 'react';

import { Link } from 'react-router-dom';

import {
  useGetMyPostList,
  useGetMyScrapedPostList,
} from '@/services/post/myPostQueries';
import { useDeleteMyPost } from '@/services/post/postMutation';

import {
  myCollectionList,
  myCommentTypeOptionList,
  myPostType,
  myPostTypeOptionList,
} from '@/constants';
import { useDialogContext } from '@/hooks';
import { Collection, Option } from '@/types';
import { formatDate } from '@/utils';
import { BiExpandVertical } from 'react-icons/bi';

import Pagination from '@/components/common/Pagination';
import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';
import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import ScrapedPostCard from '@/components/user/ScrapedPostCard';

export const ITEMS_PER_PAGE = 3;

export default function MyCollection() {
  const [currCollection, setCurrCollection] =
    useState<Collection>('내가 쓴 게시글');

  const [isLatest, setIsLatest] = useState(true);

  const [selectedCategoryOptionList, setSelectedCategoryOptionList] =
    useState<Option[]>(myPostTypeOptionList);

  const [checkedPostIdList, setCheckedPostIdList] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: myPostList,
    refetch,
    isLoading: isMyPostListLoading,
  } = useGetMyPostList();

  // const { data: myCommentList, isLoading: isMyCommentListLoading } =
  //   useGetMyCommentList();

  const filteredAndOrderedPostList = useMemo(() => {
    const filteredList = myPostList?.filter(post => {
      return selectedCategoryOptionList.some(({ key }) => {
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
  }, [myPostList, selectedCategoryOptionList, isLatest]);

  const totalPages = Math.ceil(
    (filteredAndOrderedPostList?.length || 0) / ITEMS_PER_PAGE,
  );

  const paginationList = useMemo(() => {
    return filteredAndOrderedPostList?.slice(
      ITEMS_PER_PAGE * (currentPage - 1),
      ITEMS_PER_PAGE * currentPage,
    );
  }, [currentPage, filteredAndOrderedPostList]);

  const { mutateAsync: deletePost } = useDeleteMyPost({
    onSuccess: async () => {
      await refetch();
    },
  });

  // 내가 찜한 글
  const { data: myScrapedPostList, isLoading: isMyScrapedPostListLoading } =
    useGetMyScrapedPostList();

  const changeCollection = (contentType: Collection) => {
    setCurrCollection(contentType);
  };

  const headerCellList = [
    {
      name: '체크박스',
      onChange: () => {
        const postList = paginationList.map(({ postId }) => postId);
        return setCheckedPostIdList(
          checkedPostIdList.length !== 0 ? [] : postList,
        );
      },
      className: 'pl-6',
    },
    {
      name: '작성일',
      icon: BiExpandVertical,
      onClick: () => setIsLatest(prev => !prev),
    },
    {
      name: '분류',
    },
    {
      name: '글제목',
      className: 'pl-10',
    },
    {
      name: '삭제',
      className: 'pr-6',
    },
  ];

  const onCheckboxChange = (postId: number) => {
    setCheckedPostIdList(prev => {
      if (prev.includes(postId))
        return prev.filter(checkedPostId => checkedPostId !== postId);
      return [...prev, postId];
    });
  };

  const onDeleteConfirmClick = (postIdList: number[]) => {
    return postIdList.map(async postId => {
      // NOTE: 지워졌을 때 맨 마지막 아이템이었다면 이전 페이지로 이동하기
      await deletePost({ postId });
    });
  };

  const { showDialog } = useDialogContext();

  const handleShowDialog = async (id: number) => {
    await showDialog({
      key: 'MEAL-RECRUIT-CARD-TYPE',
      element: <MealRecruitCardModal id={id} isParticipant />,
    });
  };

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
                  changeCollection(collection);
                }}
                className={`${currCollection === collection ? 'bg-mainGray-hover text-white underline' : 'bg-white text-darkGray-active'} cursor-pointer rounded-lg border border-mainGray-hover px-4 py-[10px] text-sm font-medium`}
              >
                {collection}
              </button>
            </li>
          ))}
        </ul>
        {currCollection === '내가 찜한 글' && (
          <Link to="/notice" className="mt-3 text-darkGray">
            더보기
          </Link>
        )}
      </div>

      {/* 내가 쓴 게시글, 내가 쓴 댓글 */}
      {currCollection !== '내가 찜한 글' && (
        <>
          <div className="mb-8 flex min-h-[230px] flex-col rounded-[20px] bg-white py-6 shadow-card">
            {!isMyPostListLoading && (
              <table>
                <colgroup>
                  <col width="3%" />
                  <col width="10%" />
                  <col width="15%" />
                  <col width="60%" />
                  <col width="8%" />
                </colgroup>

                <thead>
                  <tr className="text-center">
                    {headerCellList.map(
                      ({ name, icon, onClick, onChange, className }) => (
                        <TableHeaderCell
                          key={name}
                          name={name}
                          className={className}
                          icon={icon}
                          onClick={onClick}
                        >
                          {name === '체크박스' && onChange && (
                            <Checkbox
                              id={name}
                              checked={
                                checkedPostIdList.length === ITEMS_PER_PAGE
                              }
                              onChange={onChange}
                              inputClassName="!rounded-lg"
                            />
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
                                value={selectedCategoryOptionList.map(
                                  ({ id }) => id,
                                )}
                                onChangeValue={value => {
                                  setSelectedCategoryOptionList(value);
                                  setCurrentPage(1);
                                }}
                              />
                            </div>
                          )}
                        </TableHeaderCell>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {paginationList.length !== 0 &&
                  currCollection === '내가 쓴 게시글' ? (
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
                              onChange={() => onCheckboxChange(postId)}
                              inputClassName="!rounded-lg"
                            />
                          </TableDataCell>

                          <TableDataCell>
                            {formatDate(createdAt, 'yy.MM.dd')}
                          </TableDataCell>

                          <TableDataCell>
                            {
                              myPostType[
                                postType === 'PROJECT' ? ptype : postType
                              ]
                            }
                          </TableDataCell>

                          <TableDataCell className="max-w-[0px] overflow-hidden truncate pl-11 text-start">
                            {postType === 'PROJECT' && (
                              <Link
                                to={`/lounge/post/${postId}`}
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
                                onDeleteConfirmClick([postId])
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
                setCheckedPostIdList([]);
                setCurrentPage(pageNum);
              }}
            />
          )}
        </>
      )}

      {!isMyScrapedPostListLoading && currCollection === '내가 찜한 글' && (
        <ul className="flex gap-5">
          {myScrapedPostList?.content?.map(card => (
            <ScrapedPostCard key={card.postId} card={card} />
          ))}
        </ul>
      )}
    </>
  );
}
