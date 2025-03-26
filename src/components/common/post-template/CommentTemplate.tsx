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
      <header className="flex gap-2 text-2xl font-semibold">
        <h4 className="">댓글</h4>
        <span className="text-mainGreen">{commentList.length}</span>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <textarea
          {...register('content')}
          className="my-2.5 w-full resize-none rounded border border-solid border-lightGray p-[15px] outline-none"
          placeholder="댓글을 작성해 주세요."
          rows={5}
        />
        <SquareButton
          type="submit"
          name="등록"
          className="self-end px-5"
          disabled={isPostCommentPending}
        />
      </form>

      {!isCommentListLoading && (
        <ul className="mt-8 flex flex-col gap-8">
          {commentList.map(
            ({
              id,
              userInfo: { nickname, profileImg, role },
              content,
              createAt,
            }) => (
              <li key={id} className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <UserImage
                      className="size-[30px]"
                      imageNameSegment={profileImg ?? ''}
                    />
                    <span className="text-[15px]">
                      {nickname ? `@${nickname}` : '-'}
                    </span>
                    <Tag
                      text={rolesObj[role]}
                      roleType={role}
                      className="!py-1"
                    />
                  </div>

                  {nickname === profileCard?.profile?.nickname &&
                    !isEditingComment.isEditing && (
                      <div className="flex items-center gap-3">
                        <EditButton
                          label="댓글 수정하기"
                          onClick={() => {
                            toggleEditingComment(id);
                            reset({ editedContent: content });
                          }}
                          className="!size-4 pb-0.5"
                        />
                        <TrashButton
                          className="!size-5 pt-0.5"
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
                      className="mb-2 w-full resize-none rounded border border-solid border-lightGray p-[15px] focus:outline-none"
                      placeholder="댓글을 수정해 주세요."
                      rows={5}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-darkGray">
                        {formatDate(createAt, 'yyyy.MM.dd HH:mm')}
                      </span>
                      <SquareButton
                        type="submit"
                        name="수정"
                        className="self-end px-5"
                        disabled={isEditCommentPending}
                      />
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="my-3">{content}</p>
                    <span className="text-darkGray">
                      {formatDate(createAt, 'yyyy.MM.dd HH:mm')}
                    </span>
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
