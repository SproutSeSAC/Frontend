import { useCallback, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  useGetLoungePositionsFilterList,
  useGetLoungeProjects, // useGetLoungeTechStackFilterList,
} from '@/services/lounge/loungeQueries';

import { progressList, sortList, stackList } from '@/constants';
import { LoungeDto } from '@/types/lounge/loungeDto';

import Pagination from '@/components/common/Pagination';
import SquareButton from '@/components/common/button/SquareButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SelectableDropdown from '@/components/common/dropdown/SelectableDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import LoungeEditor from '@/components/lounge/editor/LoungeEditor';

const TAB_LIST = [
  { text: '프론트엔드', type: 'frontend' },
  { text: '백엔드', type: 'backend' },
  { text: '모바일', type: 'mobile' },
  { text: '컴퓨터', type: 'computer' },
  { text: 'pm/ui/ux', type: 'pm' },
  { text: '데이터', type: 'data' },
  { text: '모두보기', type: 'all' },
];

const commonSelectBoxClass =
  'rounded-2xl border border-solid border-gray2 bg-bg px-3 py-1';
const commonOptionBoxClass = 'px-1.5 py-2.5';
const commonOptionClass = 'hover:rounded-sm hover:bg-gray3 pl-1';

export default function Lounge() {
  const [searchParams] = useSearchParams();
  const pType = searchParams.get('pType');

  const [filterData, setFilterData] =
    useState<LoungeDto.Request.GetLoungeProjects>({ page: 1, size: 20 });

  const searchRef = useRef<HTMLInputElement | null>(null);
  // 로딩 추가
  const { data } = useGetLoungeProjects(filterData);
  // const { data: techStackList } = useGetLoungeTechStackFilterList();
  const { data: positionsList } = useGetLoungePositionsFilterList();

  const handleChangeFilterValue = useCallback(
    (value: { id: number; name: string }[], name: string) => {
      const ids = value.map(item => item.id);
      setFilterData(prev => ({ ...prev, [name]: ids }));
    },
    [],
  );
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current.value = e.target.value;
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setFilterData(prev => ({ ...prev, keyword: searchRef.current?.value }));
  }, []);

  if (pType === 'EDIT') {
    return <LoungeEditor />;
  }

  return (
    <>
      <div className="flex items-center gap-10">
        <SearchInput
          name="search"
          ref={searchRef}
          placeholder="검색어를 입력해 주세요"
          width="w-full"
          height="h-12"
          onEnter={handleSearchSubmit}
          onChange={handleChange}
        />
        <SquareButton
          name="검색하기"
          onClick={handleSearchSubmit}
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
            onChangeValue={value => handleChangeFilterValue(value, 'techStack')}
          />

          <SelectableDropdown
            label="포지션"
            selectOptionBoxClassName={commonOptionBoxClass}
            selectOptionClassName={commonOptionClass}
            options={positionsList || []}
            selectBoxClassName={commonSelectBoxClass}
            onChangeValue={value => handleChangeFilterValue(value, 'position')}
          />
          <SelectableDropdown
            label="진행방식"
            options={progressList}
            selectBoxClassName={commonSelectBoxClass}
            selectOptionBoxClassName={commonOptionBoxClass}
            selectOptionClassName={commonOptionClass}
            onChangeValue={value => {
              const newValue = value.map(item => item.key);
              setFilterData(prev => ({ ...prev, meetingType: newValue[0] }));
            }}
          />
        </div>
        <SelectableDropdown
          label="정렬"
          options={sortList}
          selectBoxClassName={commonSelectBoxClass}
          selectOptionBoxClassName={commonOptionBoxClass}
          selectOptionClassName={commonOptionClass}
          onChangeValue={value => {
            const newValue = value.map(item => item.key);
            setFilterData(prev => ({ ...prev, sort: newValue[0] }));
          }}
        />
      </div>
      <ul className="mb-[90px] flex flex-wrap gap-6">
        {(data?.projects || []).map(card => (
          <li key={card.id} className="[&>div]:w-full">
            <LoungePostCard card={card} />
          </li>
        ))}
      </ul>
      {(data?.projects || []).length > 0 && (
        <Pagination
          totalPages={data?.totalPages || 0}
          currentPage={(data?.currentPage || 0) - 1 || 1}
          onPageChange={(pageNumber: number) => {
            setFilterData(prev => ({ ...prev, page: pageNumber }));
          }}
        />
      )}
    </>
  );
}
