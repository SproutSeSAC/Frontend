import { useState } from 'react';

import SquareButton from '../common/button/SquareButton';
import UserImage from '../user/UserImage';
import StoreStarRating from './StoreStarRating';

import StoreCard from '@/components/store/StoreCard';
import StoreModalHeader from '@/components/store/StoreModalHeader';
import StoreModalMenuList from '@/components/store/StoreModalMenuList';
import StoreModalTabList from '@/components/store/StoreModalTabList';

interface StoreModalProps {
  onClose: () => void;
}

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

export default function StoreModal({ onClose }: StoreModalProps) {
  const [tab, setTab] = useState('menu');

  const [score, setScore] = useState<number>(0);

  return (
    <div className="absolute top-0 z-20 m-[15px] h-[calc(100%-30px)] w-[420px] overflow-y-auto rounded bg-white px-5 pt-[15px] shadow-modal scrollbar-hide">
      <StoreModalHeader onClose={onClose} />

      <StoreCard
        showFavoriteButton={false}
        width="w-full"
        height="h-[269px]"
        phoneNumber="02-111-2222"
      />

      <StoreModalTabList tab={tab} setTab={setTab} />

      {tab === 'menu' && <StoreModalMenuList />}
      {tab === 'review' && (
        <div className="pb-14">
          <div className="flex items-center gap-2">
            <UserImage className="size-[30px] p-0.5" />
            <div>
              <div>강민경</div>
              <StoreStarRating score={score} onChange={setScore} isEditable />
            </div>
          </div>
          <textarea
            className="mt-2.5 w-full resize-none rounded border border-solid border-gray5 p-[15px] text-lg"
            placeholder="댓글을 작성해 주세요."
            rows={5}
          />
          <div className="flex justify-end gap-2">
            <SquareButton onClick={() => {}} name="등록하기" />
            <button
              onClick={() => {}}
              type="button"
              className="rounded-lg bg-gray5 px-4 py-2 tracking-tight text-white"
            >
              취소하기
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-8">
            {mock.map(commentItem => (
              <div
                key={commentItem.id}
                className="flex w-full flex-col gap-4 text-lg"
              >
                <div className="flex items-center gap-2">
                  <UserImage className="size-[30px] p-0.5" />

                  <div>
                    <div>{`@${commentItem.name}`}</div>
                    <StoreStarRating score={4} />
                  </div>
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
      )}
    </div>
  );
}
