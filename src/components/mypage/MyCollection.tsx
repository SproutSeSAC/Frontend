import { useMemo, useState } from 'react';

import { Link } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  // useGetMyCommentList,
  useGetMyPostList,
  useGetMyScrapedPostList,
} from '@/services/post/myPostQueries';
import { useDeleteMyPost } from '@/services/post/postMutation';

import {
  myCollectionList,
  myPostType,
  myPostTypeOptionList,
} from '@/constants';
import { useDialogContext } from '@/hooks';
import { Collection, Option } from '@/types';
import { formatDate } from '@/utils';
import { BiChevronDown, BiExpandVertical } from 'react-icons/bi';

import Pagination from '@/components/common/Pagination';
import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';
import MealRecruitCardModal from '@/components/store/meal-recruit/MealRecruitCardModal';
import FavoritePostCard from '@/components/user/FavoritePostCard';

export const ITEMS_PER_PAGE = 6;

export default function MyCollection() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const [currCollection, setCurrCollection] =
    useState<Collection>('내가 쓴 게시글');

  const [isLatest, setIsLatest] = useState(true);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [selectedCategoryOptionList, setSelectedCategoryOptionList] =
    useState<Option[]>(myPostTypeOptionList);
  const [checkedPostIdList, setCheckedPostIdList] = useState<number[]>([]);

  const { data: myPostList, isLoading: isMyPostListLoading } =
    useGetMyPostList();

  const filteredAndOrderedPostList = useMemo(() => {
    const filteredList = myPostList?.filter(post => {
      return selectedCategoryOptionList.some(
        option => option.key === post.postType,
      );
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

  const paginationList = useMemo(() => {
    return filteredAndOrderedPostList?.slice(
      ITEMS_PER_PAGE * (currentPage - 1),
      ITEMS_PER_PAGE * currentPage,
    );
  }, [currentPage, filteredAndOrderedPostList]);

  const { mutateAsync: deletePost } = useDeleteMyPost({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['useGetMyPostList'] });
    },
  });

  // const { data: myCommentList } = useGetMyCommentList();

  const { data: myScrapedPostList } = useGetMyScrapedPostList();

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
    },
    {
      name: '작성일',
      icon: BiExpandVertical,
      onClick: () => setIsLatest(prev => !prev),
    },
    {
      name: '분류',
      icon: BiChevronDown,
      onClick: () => setIsCategoryOpen(prev => !prev),
    },
    { name: '글제목' },
    {
      name: '삭제',
      className: 'text-end pr-7',
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
    <div className="flex min-h-[500px] flex-col rounded-lg bg-white py-5 shadow-card">
      <header className="flex items-center justify-between gap-3 pl-4 pr-5">
        <ul className="flex flex-1 gap-2">
          {myCollectionList.map(collection => (
            <li key={collection}>
              <button
                type="button"
                aria-label={collection}
                onClick={() => changeCollection(collection)}
                className={`${currCollection === collection && 'rounded-lg bg-mainGreen font-semibold text-white underline'} cursor-pointer px-4 py-2`}
              >
                {collection}
              </button>
            </li>
          ))}
        </ul>
        <TrashButton className="px-1.5 py-2" />
      </header>

      {!isMyPostListLoading && (
        <table className="my-4 border-separate border-spacing-y-3">
          <colgroup>
            <col width="3%" />
            <col width="12%" />
            <col width="12%" />
            <col width="45%" />
            <col width="10%" />
          </colgroup>

          <thead>
            <tr className="text-left">
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
                        checked={checkedPostIdList.length === ITEMS_PER_PAGE}
                        onChange={onChange}
                      />
                    )}
                    {name === '분류' && isCategoryOpen && (
                      <ul className="absolute -left-2 top-8 flex flex-col gap-y-2 rounded-xl border border-mainGray bg-white px-4 py-3 shadow-card">
                        {myPostTypeOptionList.map(option => (
                          <li key={option.id} className="flex items-center">
                            <Checkbox
                              id={option.key || '분류'}
                              checked={selectedCategoryOptionList.some(
                                ({ key }) => key === option.key,
                              )}
                              onChange={() => {
                                setSelectedCategoryOptionList(prev => {
                                  if (
                                    prev.find(({ key }) => key === option.key)
                                  )
                                    return prev.filter(
                                      ({ key }) => key !== option.key,
                                    );
                                  return [...prev, option];
                                });
                              }}
                            />
                            <span className="pt-1">{option.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TableHeaderCell>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {currCollection === '내가 쓴 게시글' &&
              paginationList?.length !== 0 &&
              paginationList
                ?.slice(0, 6)
                ?.map(({ postId, postType, createdAt, title, linkedId }) => (
                  <tr key={postId} className="hover:bg-gray4 group">
                    <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                      <Checkbox
                        id={postType}
                        checked={!!checkedPostIdList.includes(postId)}
                        onChange={() => onCheckboxChange(postId)}
                      />
                    </TableDataCell>

                    <TableDataCell>
                      {formatDate(createdAt, 'yy.MM.dd')}
                    </TableDataCell>

                    <TableDataCell>{myPostType[postType]}</TableDataCell>

                    <TableDataCell className="max-w-[0px] overflow-hidden truncate">
                      {postType === 'PROJECT' && (
                        <Link
                          to={`/lounge/post/${postId}`}
                          className="text-blue-600 underline"
                        >
                          {title}
                        </Link>
                      )}
                      {postType === 'MEAL' && (
                        <button
                          type="button"
                          className="text-blue-600 underline"
                          onClick={() => {
                            handleShowDialog(linkedId);
                          }}
                        >
                          {title}
                        </button>
                      )}
                    </TableDataCell>

                    <TableDataCell className="pr-5 text-end [&>button]:px-2">
                      <TrashButton
                        className="px-1.5 py-2"
                        onConfirmClick={() => onDeleteConfirmClick([postId])}
                      />
                    </TableDataCell>
                  </tr>
                ))}

            {/* {currCollection === '내가 쓴 댓글' &&
              myCommentList?.length !== 0 &&
              myCommentList?.map(({ postId, content, commentId }) => (
                <tr key={commentId} className="hover:bg-gray4 group">
                  <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                    <Checkbox
                      id="체크박스"
                      checked={!!checkedPostIdList.includes(postId)}
                      onChange={() => onCheckboxChange(postId)}
                    />
                  </TableDataCell>

                  <TableDataCell>
                    {formatDate(new Date(), 'yy.MM.dd')}
                  </TableDataCell>

                  <TableDataCell className="text-center">
                    {postId}
                  </TableDataCell>

                  <TableDataCell>댓글</TableDataCell>

                  <TableDataCell className="max-w-[0px] overflow-hidden truncate">
                    {content}
                  </TableDataCell>

                  <TableDataCell className="pr-5 text-end [&>button]:px-2">
                    <TrashButton
                      className="px-1.5 py-2"
                      onConfirmClick={() => onDeleteConfirmClick([postId])}
                    />
                  </TableDataCell>
                </tr>
              ))} */}
          </tbody>
        </table>
      )}

      {currCollection === '내가 찜한 글' && (
        <ul className="flex gap-4 p-8">
          {myScrapedPostList?.map(card => (
            <FavoritePostCard key={card.postScrapId} />
          ))}
        </ul>
      )}

      {filteredAndOrderedPostList?.length !== 0 && (
        <Pagination
          totalPages={Math.ceil(
            (filteredAndOrderedPostList?.length || 0) / ITEMS_PER_PAGE,
          )}
          currentPage={currentPage}
          onPageChange={(pageNum: number) => setCurrentPage(pageNum)}
        />
      )}
    </div>
  );
}
