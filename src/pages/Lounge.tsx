import React, { useCallback, useRef, useState } from 'react';

import { useTechStackList } from '@/hooks/useTechStackList';

import {
  useGetLoungePositionsFilterList,
  useGetLoungeProjects,
} from '@/services/lounge/loungeQueries';

import { progressList, sortList } from '@/constants';
import { GetLoungeProjects } from '@/types/lounge/loungeDto';

import Pagination from '@/components/common/Pagination';
import SquareButton from '@/components/common/button/SquareButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';

export default function Lounge() {
  const [filterData, setFilterData] = useState<GetLoungeProjects>({
    page: 1,
    size: 20,
  });

  const searchRef = useRef<HTMLInputElement | null>(null);
  // 로딩 추가
  const { data } = useGetLoungeProjects(filterData);
  const { data: positionsList } = useGetLoungePositionsFilterList();

  const { techStackList, isTechStackListLoading } = useTechStackList();

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

  return (
    <>
      <div className="mt-6 flex items-center gap-10">
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
          {!isTechStackListLoading && (
            <TechStackDropdown
              defaultLabel="기술스택"
              defaultTabValue="백엔드"
              options={techStackList}
              onChangeValue={value =>
                handleChangeFilterValue(value, 'techStack')
              }
              boxShape="buttonShape"
            />
          )}

          <SingleSelectDropdown
            defaultLabel="포지션"
            options={positionsList || []}
            onChangeValue={value => handleChangeFilterValue(value, 'position')}
            boxShape="buttonShape"
          />

          <SingleSelectDropdown
            defaultLabel="진행방식"
            options={progressList || []}
            onChangeValue={value => {
              const newValue = value.map(item => item.key);
              setFilterData(prev => ({ ...prev, meetingType: newValue[0] }));
            }}
            boxShape="buttonShape"
          />
        </div>

        <SingleSelectDropdown
          defaultLabel="정렬"
          options={sortList}
          onChangeValue={value => {
            const newValue = value.map(item => item.key);
            setFilterData(prev => ({ ...prev, sort: newValue[0] }));
          }}
          boxShape="buttonShape"
        />
      </div>

      <ul className="mb-[90px] grid grid-cols-3 gap-6 lg:grid-cols-2">
        {(data?.projects || []).map(card => (
          <li key={card.id} className="[&>a]:!w-full">
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
