// import { formatDate } from '@/utils';
import { useGetUserProfileCard } from '@/services/auth/authQueries';

import { myPostDto } from '@/types/mypage/myPostDto';
import { useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';

// import UserImage from '@/components/user/UserImage';

interface CommentTemplateProps {
  commentList: myPostDto.GetMyCommentList;
  onSubmit: (data: { imgUrl: string; content: string }) => void;
}

export default function CommentTemplate({
  commentList,
  onSubmit,
}: CommentTemplateProps) {
  const { data } = useGetUserProfileCard();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: '' },
  });

  const onCommentSubmit = ({ content }: { content: string }) => {
    if (content === '') return;
    onSubmit({ imgUrl: data?.profile.profileUrl || '', content });
    reset();
  };

  return (
    <section className="mb-24 mt-10">
      <header className="flex gap-2 text-2xl font-semibold">
        <div className="">댓글</div>
        <div className="text-mainGreen">{commentList.length}</div>
      </header>

      <form onSubmit={handleSubmit(onCommentSubmit)} className="flex flex-col">
        <textarea
          {...register('content')}
          className="border-lightGrey my-2.5 w-full resize-none rounded border border-solid p-[15px] text-lg"
          placeholder="댓글을 작성해 주세요."
          rows={5}
        />
        <SquareButton type="submit" name="등록" className="self-end" />
      </form>

      <ul className="mt-8 flex flex-col gap-8">
        {commentList.map(({ commentId, userId, content }) => (
          <li key={commentId} className="flex w-full flex-col gap-4 text-lg">
            <header className="flex items-center gap-2">
              {/* <UserImage
                className="size-[30px]"
                imageNameSegment={imgUrl ?? ''}
              /> */}
              <div>{userId ? `@${userId}` : '-'}</div>
            </header>
            <p>{content}</p>
            <footer className="flex gap-10 text-darkGray-active">
              <div className="flex gap-4">
                {/* <div>{formatDate(createdAt, 'yyyy.MM.dd HH:mm')}</div> */}
              </div>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
