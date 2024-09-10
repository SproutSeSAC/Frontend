import { Link } from 'react-router-dom';

import { Card } from '@/pages/Lounge';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';

// TODO: 임시 type 지정한거라 나중에 수정 필요
interface LoungePostCardProps {
  card: Card;
}

export default function LoungePostCard({ card }: LoungePostCardProps) {
  const dataList = [
    { type: '기간', value: '2024.09.24 ~ 2024.10.11' },
    { type: '모집', value: '3/5' },
    { type: '직무', value: ['프론트엔드', '백엔드'] },
    { type: '유형', value: '온라인' },
  ];
  return (
    <Link
      to="/lounge/post/1" // 변경
      className="flex h-[280px] w-[275px] flex-col items-start justify-between rounded-xl bg-white p-4 shadow-card"
    >
      <div className="flex w-full items-center justify-between">
        <Tag color="green" size="medium" text={card.tag} />
        <FavoriteButton isFavorite={card.like} onClick={() => {}} size={20} />
      </div>

      <span className="mt-3 text-sm text-gray2">{card.type}</span>
      <h4 className="font-medium">{card.title}</h4>

      <ul className="my-4 flex gap-2">
        <li className="size-5 rounded bg-vividGreen2" />
        <li className="size-5 rounded bg-vividGreen2" />
      </ul>

      <ul className="flex flex-col gap-2">
        {dataList.map(data => (
          <li key={data.type} className="flex text-xs">
            <span className="mr-2 border-r border-gray3 pr-2 leading-4 text-gray2">
              {data.type}
            </span>

            {typeof data.value === 'string' ? (
              <span>{data.value}</span>
            ) : (
              <ul className="flex gap-1">
                {data.value.map(tag => (
                  <Tag key={tag} text={tag} color="black" size="small" />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Link>
  );
}
