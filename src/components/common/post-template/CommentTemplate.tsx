import { useForm } from 'react-hook-form';

import UserImage from '@/components/user/UserImage';

const mock = [
  {
    id: 1,
    name: '강민경',
    comment:
      '예전에 불편해서 만들었던 플러그인이었는데 생각보다 많은 분들이 사용해주시네요. 그래서 큰맘먹고 오랜만에 개발해서 업데이트 했습니다..! 댓글로 남겨주신 부분 반영했고, 파이어베이스를 통해 데이터를 불러와서 동적으로 표현하는 형식으로 다시 개발했습니다. 원하시는 데이터가 있다면 언제든지 제안해주세요.',
    regDate: '2024.06.07',
    regTime: '14:20',
    image: '',
  },
  {
    id: 2,
    name: '강민경1',
    comment: 'testetstestestest',
    regDate: '2024.06.08',
    regTime: '14:21',
    image: '',
  },
];

export default function CommentTemplate() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const handleSearch = (data: { comment: string }) => {
    console.log(data);
  };

  return (
    <div className="mb-24 ml-20 mt-10">
      <div className="flex gap-2 text-2xl font-semibold">
        <div className="">댓글</div>
        <div className="text-oliveGreen1">{mock.length}</div>
      </div>
      <form onSubmit={handleSubmit(handleSearch)}>
        <textarea
          {...register('comment')}
          className="mt-2.5 w-full resize-none rounded border border-solid border-gray5 p-[15px] text-lg"
          placeholder="댓글을 작성해 주세요."
          rows={5}
        />
        <input type="submit" />
      </form>

      <div className="mt-8 flex flex-col gap-8">
        {mock.map(commentItem => (
          <div
            key={commentItem.id}
            className="flex w-full flex-col gap-4 text-lg"
          >
            <div className="flex items-center gap-2">
              <UserImage className="size-[30px] p-0.5" />
              <div>{`@${commentItem.name}`}</div>
            </div>

            <div>{commentItem.comment}</div>
            <div className="flex gap-10 text-gray1">
              <div className="flex gap-4">
                <div>{commentItem.regDate}</div>
                <div>{commentItem.regTime}</div>
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
