import { dateFormat, timeFormat } from '@/utils/dateFormat';

import SquareButton from '../button/SquareButton';

import { useForm } from 'react-hook-form';

import UserImage from '@/components/user/UserImage';

interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  writer: string;
}

interface CommentTemplateProps {
  commentList: CommentItem[];
  onSubmit: (data: { content: string }) => void;
}

export default function CommentTemplate({
  commentList,
  onSubmit,
}: CommentTemplateProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: '',
    },
  });

  const handleSearch = (data: { content: string }) => {
    if (data.content) {
      onSubmit(data);
      reset();
    } else {
      console.log('값없음');
    }
  };

  return (
    <div className="mb-24 ml-20 mt-10">
      <div className="flex gap-2 text-2xl font-semibold">
        <div className="">댓글</div>
        <div className="text-oliveGreen1">{commentList.length}</div>
      </div>
      <form onSubmit={handleSubmit(handleSearch)}>
        <textarea
          {...register('content')}
          className="mt-2.5 w-full resize-none rounded border border-solid border-gray5 p-[15px] text-lg"
          placeholder="댓글을 작성해 주세요."
          rows={5}
        />
        <div className="flex w-full justify-end">
          <SquareButton type="submit" name="등록" />
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-8">
        {commentList.map(commentItem => (
          <div
            key={commentItem.id}
            className="flex w-full flex-col gap-4 text-lg"
          >
            <div className="flex items-center gap-2">
              <UserImage className="size-[30px] p-0.5" />
              <div>{`@${commentItem.writer}`}</div>
            </div>

            <div>{commentItem.content}</div>
            <div className="flex gap-10 text-gray1">
              <div className="flex gap-4">
                <div>{dateFormat(commentItem.createdAt)}</div>
                <div>{timeFormat(commentItem.createdAt, 'HH:mm')}</div>
              </div>
              <button type="button" className="font-medium">
                신고
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
