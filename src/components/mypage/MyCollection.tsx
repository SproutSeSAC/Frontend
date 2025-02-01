import { useState } from 'react';

import { Link } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  useGetMyCommentList,
  useGetMyPostList,
  useGetMyScrapedPostList,
} from '@/services/mypage/myPostQueries';
import { useDeleteMyPost } from '@/services/post/postMutation';

import { formatDate } from '@/utils';
import { BiChevronDown, BiExpandVertical } from 'react-icons/bi';

import Pagination from '@/components/common/Pagination';
import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';
import TableHeaderCell from '@/components/common/table/TableHeaderCell';
import FavoritePostCard from '@/components/user/FavoritePostCard';

type Collection = '내가 쓴 게시글' | '내가 쓴 댓글' | '내가 찜한 글';

const collectionList: Collection[] = [
  '내가 쓴 게시글',
  '내가 쓴 댓글',
  '내가 찜한 글',
];

export const ITEMS_PER_PAGE = 6;

export default function MyCollection() {
  const [checkedPostIdList, setCheckedPostIdList] = useState<number[]>([]);

  const [currCollection, setCurrCollection] =
    useState<Collection>('내가 쓴 게시글');

  const queryClient = useQueryClient();

  const { data: myPostList } = useGetMyPostList();

  const { mutateAsync: deletePost } = useDeleteMyPost({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['useGetMyPostList'] });
    },
  });

  const { data: myCommentList } = useGetMyCommentList();

  const { data: myScrapedPostList } = useGetMyScrapedPostList();

  const changeCollection = (contentType: Collection) => {
    setCurrCollection(contentType);
  };

  const headerCellList = [
    {
      name: '체크박스',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        console.log('체크박스 전체 클릭', event), //
    },
    {
      name: '작성일',
      icon: BiExpandVertical,
      onClick: () => console.log('최신순 오래된순'),
    },
    {
      name: '분류',
      icon: BiChevronDown,
      onClick: () => console.log('카테고리 분류'),
    },
    { name: '글제목' },
    {
      name: '삭제',
      className: 'text-end pr-7',
      onClick: () => console.log('삭제'),
    },
  ];

  const onCheckboxChange = (postId: number) => {
    setCheckedPostIdList(prev => {
      if (prev.includes(postId))
        return prev.filter(checkedPostId => !checkedPostId);
      return [...prev, postId];
    });
  };

  const onDeleteConfirmClick = (postId: number) => {
    deletePost({ postId });
  };

  const myPostType = {
    MEAL: '한끼팟',
    PROJECT: '프로젝트',
    STUDY: '스터디',
  } as const;

  return (
    <div className="flex min-h-96 flex-col rounded-lg bg-white py-5 shadow-card">
      <header className="flex items-center justify-between gap-3 pl-4 pr-5">
        <div className="flex flex-1 gap-2">
          {collectionList.map(collection => (
            <button
              key={collection}
              type="button"
              aria-label={collection}
              onClick={() => changeCollection(collection)}
              className={`${currCollection === collection && 'rounded-lg bg-mainGreen font-semibold text-white underline'} cursor-pointer px-4 py-2`}
            >
              {collection}
            </button>
          ))}
        </div>
        <TrashButton className="px-1.5 py-2" />
      </header>

      {currCollection === '내가 찜한 글' ? (
        <ul className="flex gap-4 p-8">
          {myScrapedPostList?.map(card => (
            <FavoritePostCard key={card.postScrapId} />
          ))}
        </ul>
      ) : (
        <table className="my-4 border-separate border-spacing-y-3">
          <colgroup>
            <col width="3%" />
            <col width="6%" />
            <col width="12%" />
            <col width="45%" />
            <col width="10%" />
          </colgroup>

          <thead>
            <tr className="text-left">
              {headerCellList.map(cell => (
                <TableHeaderCell
                  key={cell.name}
                  name={cell.name}
                  className={cell.className}
                  icon={cell.icon}
                  onClick={cell.onClick}
                  onChange={cell.onChange}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {currCollection === '내가 쓴 게시글' &&
              myPostList?.length !== 0 &&
              myPostList?.map(
                ({ postId, postType, createdAt, title, linkedId }) => (
                  <tr key={postId} className="hover:bg-gray4 group">
                    <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                      <Checkbox
                        id="체크박스"
                        checked={!!checkedPostIdList.includes(postId)}
                        onChange={() => onCheckboxChange(postId)}
                      />
                    </TableDataCell>

                    <TableDataCell>
                      {formatDate(createdAt, 'yy.MM.dd')} PostId: {postId}
                    </TableDataCell>

                    <TableDataCell>
                      {myPostType[postType]} LinkedId: {linkedId}
                    </TableDataCell>

                    <TableDataCell className="max-w-[0px] overflow-hidden truncate">
                      <Link
                        to={`/lounge/post/${postId}`}
                        className="text-blue-600 underline"
                      >
                        {title}
                      </Link>
                    </TableDataCell>

                    <TableDataCell className="pr-5 text-end [&>button]:px-2">
                      <TrashButton
                        className="px-1.5 py-2"
                        onConfirmClick={() => onDeleteConfirmClick(postId)}
                      />
                    </TableDataCell>
                  </tr>
                ),
              )}

            {currCollection === '내가 쓴 댓글' &&
              myCommentList?.length !== 0 &&
              myCommentList?.map(({ postId, content }) => (
                <tr key={postId} className="hover:bg-gray4 group">
                  <TableDataCell className="pl-6 [&>label>input]:mr-0 [&>label>input]:size-5">
                    <Checkbox
                      id="체크박스"
                      checked={!!checkedPostIdList.includes(postId)}
                      onChange={() => onCheckboxChange(postId)}
                    />
                  </TableDataCell>

                  <TableDataCell>
                    {formatDate(new Date(), 'yyyy.MM.dd')}
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
                      className="border border-red-500 px-1.5 py-2"
                      onConfirmClick={() => onDeleteConfirmClick(postId)}
                    />
                  </TableDataCell>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* 페이지네이션 */}
      <Pagination
        totalPages={myPostList?.length || 1}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
