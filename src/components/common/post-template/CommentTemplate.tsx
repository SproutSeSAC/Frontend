import { formatDate } from '@/utils';
import { useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import UserImage from '@/components/user/UserImage';

export interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  writer: string;
  imgUrl: string | null;
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
    <section className="mb-24 mt-10">
      <header className="flex gap-2 text-2xl font-semibold">
        <div className="">댓글</div>
        <div className="text-oliveGreen1">{commentList.length}</div>
      </header>

      <form onSubmit={handleSubmit(handleSearch)} className="flex flex-col">
        <textarea
          {...register('content')}
          className="my-2.5 w-full resize-none rounded border border-solid border-gray5 p-[15px] text-lg"
          placeholder="댓글을 작성해 주세요."
          rows={5}
        />
        <SquareButton type="submit" name="등록" className="self-end" />
      </form>

      <ul className="mt-8 flex flex-col gap-8">
        {commentList.map(({ id, writer, content, createdAt, imgUrl }) => (
          <li key={id} className="flex w-full flex-col gap-4 text-lg">
            <header className="flex items-center gap-2">
              <UserImage
                className="size-[30px]"
                imageNameSegment={imgUrl ?? ''}
              />
              <div>{writer ? `@${writer}` : '-'}</div>
            </header>
            <p>{content}</p>
            <footer className="flex gap-10 text-gray1">
              <div className="flex gap-4">
                <div>{formatDate(createdAt, 'yyyy.MM.dd HH:mm')}</div>
              </div>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
