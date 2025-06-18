import { Link } from 'react-router-dom';

import { postTypeObj } from '@/constants';
import { UserComment, UserPost } from '@/types/mypage/myPostDto';
import { formatDate } from '@/utils';

import { Header } from '@/pages/admin/UserPostCollection';

import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TableDataCell from '@/components/common/table/TableDataCell';

interface PostTableRowProps<T> {
  headerCellList: Header[];
  post: T;
  checkedIdList?: number[];
  onCheckboxChange?: (id: number) => void;
  handleShowDialog?: (
    postType: 'MEAL' | 'STORE',
    linkedId: number,
    data: { comment: string; nickname: string },
  ) => void;
  deleteDisabled?: boolean;
  onDeleteConfirmClick?: (id: number) => void;
}

export default function PostTableRow<T extends UserPost | UserComment>({
  headerCellList,
  post,
  checkedIdList,
  onCheckboxChange,
  handleShowDialog,
  deleteDisabled,
  onDeleteConfirmClick,
}: PostTableRowProps<T>) {
  const { createdAt, postId, postType } = post;

  const type = {
    NOTICE: 'notice',
    PROJECT: 'lounge',
    STUDY: 'lounge',
  };

  function isUserComment(data: UserPost | UserComment): data is UserComment {
    return 'commentId' in data;
  }

  const data = isUserComment(post)
    ? {
        id: post?.commentId,
        title: post.content,
        nickname: post.userNickname,
      }
    : {
        id: post.postId,
        title: post.title,
        nickname: post.createdNickName,
      };

  const { id, title, nickname } = data;

  return (
    <tr className="hover:bg-gray4 group">
      {headerCellList.includes('체크박스') &&
        checkedIdList &&
        onCheckboxChange && (
          <TableDataCell className="!p-0 [&>label>input]:mr-0 [&>label>input]:size-5">
            <Checkbox
              id={postType}
              checked={!!checkedIdList.includes(id)}
              onChange={() => onCheckboxChange(id)}
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

      {headerCellList.includes('선택삭제') && onDeleteConfirmClick && (
        <TableDataCell className="[&>button]:px-2">
          <TrashButton
            className="px-1.5 py-2"
            onConfirmClick={() => onDeleteConfirmClick(id)}
            disabled={deleteDisabled}
          />
        </TableDataCell>
      )}
    </tr>
  );
}
