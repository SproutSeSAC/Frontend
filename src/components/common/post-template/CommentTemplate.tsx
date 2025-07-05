import { useGetUserProfileCard } from '@/services/auth/authQueries';

import { rolesObj } from '@/constants';
import { useHandleComment } from '@/hooks';
import { formatDate } from '@/utils';
import { useForm } from 'react-hook-form';

import EditButton from '@/components/common/button/EditButton';
import SquareButton from '@/components/common/button/SquareButton';
import TrashButton from '@/components/common/button/TrashButton';
import Tag from '@/components/common/tag/Tag';
import UserImage from '@/components/user/UserImage';

interface CommentTemplateProps {
  postId: number;
}

export default function CommentTemplate({ postId }: CommentTemplateProps) {
  const { data: profileCard } = useGetUserProfileCard();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: '', editedContent: '' },
  });

  const {
    isEditingComment,
    toggleEditingComment,
    onSubmit,
    commentList,
    onEditSubmit,
    onDeleteCommentClick,
    isCommentListLoading,
    isPostCommentPending,
    isEditCommentPending,
    isDeleteCommentPending,
  } = useHandleComment({ postId, reset });

  return (
    <section className="mb-24 mt-10">
      <header className="flex gap-2 pl-2 text-xl font-semibold">
        <h4 className="">댓글</h4>
        <span className="text-mainGreen">{commentList.length}</span>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <textarea
          {...register('content')}
          className="mb-3 mt-2.5 w-full resize-none rounded-lg border border-solid border-mainGray p-[15px] outline-none"
          placeholder="댓글을 작성해 주세요."
          rows={5}
        />
        <SquareButton
          type="submit"
          name="등록하기"
          className="w-[35%] min-w-[200px] self-end py-2"
          disabled={isPostCommentPending}
        />
      </form>

      {!isCommentListLoading && (
        <ul className="mt-20 flex flex-col gap-y-10">
          {commentList.map(
            ({
              id,
              userInfo: { nickname, profileImg, role },
              content,
              createAt,
            }) => (
              <li key={id} className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <UserImage
                      className="size-[30px]"
                      imageNameSegment={profileImg ?? ''}
                    />
                    <span className="text-[15px] font-medium">
                      {nickname ? `@${nickname}` : '-'}
                    </span>
                    <Tag
                      text={rolesObj[role]}
                      roleKey={role}
                      className="!py-1"
                    />
                  </div>

                  {nickname === profileCard?.profile?.nickname &&
                    !isEditingComment.isEditing && (
                      <div className="ml-5 flex items-center gap-2">
                        <EditButton
                          label="댓글 수정하기"
                          onClick={() => {
                            toggleEditingComment(id);
                            reset({ editedContent: content });
                          }}
                          className="!size-5"
                        />
                        <TrashButton
                          className="!size-5 p-[1px]"
                          onConfirmClick={() => onDeleteCommentClick(id)}
                          disabled={isDeleteCommentPending}
                        />
                      </div>
                    )}
                </div>

                {isEditingComment.isEditing &&
                isEditingComment.commentId === id ? (
                  <form
                    onSubmit={handleSubmit(({ editedContent }) =>
                      onEditSubmit({ editedContent, commentId: id }),
                    )}
                    className="flex flex-col"
                  >
                    <textarea
                      {...register('editedContent')}
                      className="mb-2 w-full resize-none rounded-lg border border-mainGray p-[15px] focus:outline-none"
                      placeholder="댓글을 수정해 주세요."
                      rows={5}
                    />
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="pr-3 text-darkGray">
                          {formatDate(createAt, 'yyyy.MM.dd')}
                        </span>
                        <span className="text-darkGray">
                          {formatDate(createAt, 'HH:mm')}
                        </span>
                      </div>
                      <SquareButton
                        type="submit"
                        name="수정하기"
                        color="lightGreen"
                        className="w-[25%] min-w-[200px] self-end !py-2"
                        disabled={isEditCommentPending}
                      />
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="mb-3 mt-2">{content}</p>
                    <div>
                      <span className="pr-3 text-darkGray">
                        {formatDate(createAt, 'yyyy.MM.dd')}
                      </span>
                      <span className="text-darkGray">
                        {formatDate(createAt, 'HH:mm')}
                      </span>
                    </div>
                  </>
                )}
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
}
