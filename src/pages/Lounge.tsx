import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';
import LoungeEditor from '@/components/lounge/LoungeEditor';
import LoungePostCard from '@/components/lounge/LoungePostCard';

export interface Card {
  id: number;
  tag: string;
  type: string;
  title: string;
  date: string;
  maximum: number;
  current: number;
  job: string[];
  category: string;
  like: boolean;
}

export const mockData: Card[] = [
  {
    id: 1,
    tag: '# 프로젝트',
    type: '건설',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱',
    date: '2024.09.24 ~ 2024.10.11',
    maximum: 5,
    current: 3,
    job: ['프론트엔드', '백엔드'],
    category: '온라인',
    like: false,
  },
  {
    id: 2,
    tag: '# 스터디',
    type: '건설2',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱2',
    date: '2024.09.24 ~ 2024.10.12',
    maximum: 5,
    current: 3,
    job: ['프론트엔드'],
    category: '온라인2',
    like: false,
  },
  {
    id: 3,
    tag: '# 프로젝트',
    type: '건설3',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱3',
    date: '2024.09.24 ~ 2024.10.13',
    maximum: 5,
    current: 2,
    job: ['프론트엔드', '백엔드'],
    category: '온라인3',
    like: true,
  },
  {
    id: 4,
    tag: '# 스터디',
    type: '건설4',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱4',
    date: '2024.09.24 ~ 2024.10.11',
    maximum: 5,
    current: 1,
    job: ['프론트엔드', '백엔드'],
    category: '온라인4',
    like: true,
  },
  {
    id: 5,
    tag: '# 스터디',
    type: '건설5',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱5',
    date: '2024.09.24 ~ 2024.10.11',
    maximum: 5,
    current: 4,
    job: ['프론트엔드', '백엔드'],
    category: '온라인5',
    like: false,
  },
  {
    id: 6,
    tag: '# 프로젝트',
    type: '건설6',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱6',
    date: '2024.09.24 ~ 2024.10.11',
    maximum: 5,
    current: 3,
    job: ['프론트엔드', '백엔드'],
    category: '온라인6',
    like: true,
  },
  {
    id: 7,
    tag: '# 프로젝트',
    type: '건설7',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱7',
    date: '2024.09.24 ~ 2024.10.11',
    maximum: 5,
    current: 3,
    job: ['프론트엔드', '백엔드'],
    category: '온라인7',
    like: false,
  },
  {
    id: 8,
    tag: '# 프로젝트',
    type: '건설',
    title: '[서울] 크리스찬들을 위한 챗 GPT 성경앱8',
    date: '2024.09.24 ~ 2024.10.11',
    maximum: 5,
    current: 3,
    job: ['프론트엔드', '백엔드'],
    category: '온라인8',
    like: false,
  },
];

export default function Lounge() {
  const location = useLocation();

  // 임시구현
  const filteredData = useMemo(() => {
    const state = location.state as
      | 'all'
      | 'project'
      | 'study'
      | 'like'
      | 'edit'
      | null;

    if (state === 'edit') return [];

    if (!state || state === 'all') return mockData;

    switch (state) {
      case 'project':
        return mockData.filter(item => item.tag === '# 프로젝트');
      case 'study':
        return mockData.filter(item => item.tag === '# 스터디');
      case 'like':
        return mockData.filter(item => item.like);
      default:
        return mockData;
    }
  }, [location.state]);

  if (location.state === 'edit') {
    return <LoungeEditor />;
  }

  return (
    <>
      <div className="flex items-center gap-10">
        <SearchInput
          name="search"
          placeholder="검색어를 입력해 주세요"
          width="w-full"
          height="h-12"
          onChange={() => {}}
        />
        <SquareButton
          name="검색하기"
          onClick={() => {}}
          className="w-20 whitespace-nowrap px-3.5 py-3 text-white"
        />
      </div>

      <div className="mb-9 mt-6">필터영역</div>

      <ul className="flex flex-wrap gap-6">
        {filteredData.map(card => (
          <li key={card.id} className="[&>div]:w-full">
            <LoungePostCard card={card} />
          </li>
        ))}
      </ul>
    </>
  );
}
