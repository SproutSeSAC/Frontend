import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';

export default function LoungePostCard() {
  const dataList = [
    { type: '기간', value: '2024.09.24 ~ 2024.10.11' },
    { type: '모집', value: '3/5' },
    { type: '직무', value: ['프론트엔드', '백엔드'] },
    { type: '유형', value: '온라인' },
  ];

  return (
    <div className="flex h-[280px] w-[275px] flex-col items-start justify-between rounded-xl bg-white p-4 shadow-card">
      <div className="flex w-full items-center justify-between">
        <Tag color="green" size="medium" text="# 프로젝트" />
        <FavoriteButton isFavorite={false} onClick={() => {}} size={20} />
      </div>

      <span className="mt-3 text-sm text-gray2">건설</span>
      <h4 className="font-medium">[서울] 크리스찬들을 위한 챗 GPT 성경 앱</h4>

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
    </div>
  );
}
