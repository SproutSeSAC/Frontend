import { Link } from 'react-router-dom';

import { postTypeObj } from '@/constants';
import { UserComment, UserPost } from '@/types/mypage/myPostDto';
import { formatDate } from '@/utils';

import { Header } from '@/pages/admin/UserPostCollection';

import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';

interface PostTableRowProps {
  headerCellList: Header[];
  post: UserPost | UserComment;
  checkedPostIdList?: number[];
  onPostCheckboxChange?: (postId: number) => void;
  handleShowDialog?: (
    postType: 'MEAL' | 'STORE',
    linkedId: number,
    data: { comment: string; nickname: string },
  ) => void;
  deleteDisabled?: boolean;
  onDeleteConfirmClick?: (postId: number) => void;
}

export default function PostTableRow({
  headerCellList,
  post,
  checkedPostIdList,
  onPostCheckboxChange,
  handleShowDialog,
  deleteDisabled,
  onDeleteConfirmClick,
}: PostTableRowProps) {
  const { createdAt, postId, postType } = post;

  const type = {
    NOTICE: 'notice',
    PROJECT: 'lounge',
    STUDY: 'lounge',
  };

  const title = (post as UserPost)?.title || (post as UserComment)?.content;
  const nickname =
    (post as UserPost)?.createdNickName || (post as UserComment)?.userNickname;

  return (
    <tr className="hover:bg-gray4 group">
      {headerCellList.includes('체크박스') &&
        checkedPostIdList &&
        onPostCheckboxChange && (
          <TableDataCell className="[&>label>input]:mr-0 [&>label>input]:size-5">
            <Checkbox
              id={postType}
              checked={!!checkedPostIdList.includes(postId)}
              onChange={() => onPostCheckboxChange(postId)}
              inputClassName="!rounded-lg"
            />
          </TableDataCell>
        )}

      {headerCellList.includes('작성일') && (
        <TableDataCell>{formatDate(createdAt, 'yy.MM.dd')}</TableDataCell>
      )}

      {headerCellList.includes('분류') && (
        <TableDataCell>{postTypeObj[postType]}</TableDataCell>
      )}

      {(headerCellList.includes('댓글 내용') ||
        headerCellList.includes('게시글 제목')) && (
        <TableDataCell className="max-w-[0px] overflow-hidden truncate pl-2 text-start">
          {(postType === 'MEAL' || postType === 'STORE') && handleShowDialog ? (
            <button
              type="button"
              className="underline"
              onClick={() =>
                handleShowDialog(
                  postType,
                  (post as UserPost)?.linkedId || postId,
                  {
                    comment: title,
                    nickname,
                  },
                )
              }
            >
              {title}
            </button>
          ) : (
            <Link
              to={`/${type[postType as 'PROJECT' | 'STUDY' | 'NOTICE']}/post/${postId}`}
              className="underline"
            >
              {title}
            </Link>
          )}
        </TableDataCell>
      )}

      {headerCellList.includes('선택 삭제') && onDeleteConfirmClick && (
        <TableDataCell className="[&>button]:px-2">
          <TrashButton
            className="px-1.5 py-2"
            onConfirmClick={() => onDeleteConfirmClick(postId)}
            disabled={deleteDisabled}
          />
        </TableDataCell>
      )}
    </tr>
  );
}
