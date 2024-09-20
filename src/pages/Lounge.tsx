import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import {
  positionList,
  progressList,
  stackList,
} from '@/constant/\bfilterConstant';

import MultiSelectDropdown from '@/components/common/MultiSelectDropdown';
import SelectableDropdown from '@/components/common/SelectableDropdown';
import SubmitButton from '@/components/common/button/SubmitButton';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import LoungeEditor from '@/components/lounge/editor/LoungeEditor';

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

const TAB_LIST = [
  { text: '프론트엔드', type: 'frontend' },
  { text: '백엔드', type: 'backend' },
  { text: '모바일', type: 'mobile' },
  { text: '컴퓨터', type: 'computer' },
  { text: 'pm/ui/ux', type: 'pm' },
  { text: '데이터', type: 'data' },
  { text: '모두보기', type: 'all' },
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
  // console.log(stackList);
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
        <SubmitButton
          name="검색하기"
          onClick={() => {}}
          className="w-20 whitespace-nowrap px-3.5 py-3 text-white"
        />
      </div>

      <div className="relative mb-9 mt-6 flex justify-between">
        <div className="flex gap-4">
          <MultiSelectDropdown
            label="기술스택"
            tabList={TAB_LIST}
            defaultValue="frontend"
            className="rounded-2xl border border-solid border-gray2 bg-bg px-3 py-1"
            options={stackList}
            onChangeValue={value => console.log('value>>', value)}
          />
          <SelectableDropdown
            label="기술스택"
            options={stackList}
            className="rounded-2xl border border-solid border-gray2 bg-bg px-3 py-1"
            onChangeValue={value => console.log('value>>', value)}
          />

          <SelectableDropdown
            label="포지션"
            options={positionList}
            className="rounded-2xl border border-solid border-gray2 bg-bg px-3 py-1"
            onChangeValue={value => console.log('value11>>', value)}
          />
          <SelectableDropdown
            label="진행방식"
            options={progressList}
            className="rounded-2xl border border-solid border-gray2 bg-bg px-3 py-1"
            onChangeValue={value => console.log('value22>>', value)}
          />
        </div>
        <SelectableDropdown
          label="정렬"
          options={[
            { key: '최신순', value: '최신순' },
            { key: '인기순', value: '인기순' },
          ]}
          className="rounded-2xl border border-solid border-gray2 bg-bg px-3 py-1"
          onChangeValue={value => console.log('value22>>', value)}
        />
      </div>

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
