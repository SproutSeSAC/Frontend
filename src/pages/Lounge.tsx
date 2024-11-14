import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useTechStackList } from '@/hooks/useTechStackList';

import {
  useGetLoungePositionsFilterList,
  useGetLoungeProjects,
} from '@/services/lounge/loungeQueries';

import { progressList, sortList } from '@/constants';
import { GetLoungeProjects } from '@/types/lounge/loungeDto';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import Pagination from '@/components/common/Pagination';
import SquareButton from '@/components/common/button/SquareButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';

export interface FilterDataType extends GetLoungeProjects {
  modify?: boolean;
}

const defaultFilterData = {
  page: 1,
  size: 21,
  modify: false,
};

export default function Lounge() {
  const [filterData, setFilterData] =
    useState<FilterDataType>(defaultFilterData);

  const searchRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading } = useGetLoungeProjects(filterData);
  const { data: positionsList } = useGetLoungePositionsFilterList();

  const { techStackList, isTechStackListLoading } = useTechStackList();

  const handleChangeFilterValue = useCallback(
    (value: { id: number; name: string }[], name: string) => {
      const ids = value.map(item => item.id);
      setFilterData(prev => ({ ...prev, [name]: ids, modify: true }));
    },
    [],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current.value = e.target.value;
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setFilterData(prev => ({
      ...prev,
      keyword: searchRef.current?.value,
      modify: true,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterData(defaultFilterData);
  }, []);

  const selectedPositionOption = useMemo(() => {
    const { position } = filterData;
    return positionsList?.filter(({ id }) => position?.includes(id))?.[0];
  }, [filterData, positionsList]);

  const selectedProgressOption = useMemo(() => {
    const { meetingType } = filterData;
    return progressList?.filter(({ key }) => meetingType?.includes(key))?.[0];
  }, [filterData]);

  const selectedSortOption = useMemo(() => {
    const { sort } = filterData;
    return sortList?.filter(({ key }) => sort?.includes(key))?.[0];
  }, [filterData]);

  return (
    <>
      <div className="mt-6 flex items-center gap-8">
        <SearchInput
          name="search"
          ref={searchRef}
          placeholder="검색어를 입력해 주세요"
          width="w-full"
          height="h-12"
          onEnter={handleSearchSubmit}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <SquareButton
            name="검색하기"
            onClick={handleSearchSubmit}
            className="w-[88px] whitespace-nowrap px-3.5 py-3 text-white"
          />
          <button
            onClick={handleReset}
            className="w-20 whitespace-nowrap rounded-lg bg-gray2 px-3.5 py-3 text-white"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="relative mb-9 mt-6 flex justify-between">
        <div className="flex gap-4">
          {!isTechStackListLoading && (
            <TechStackDropdown
              defaultLabel="기술스택"
              defaultTabValue="백엔드"
              options={techStackList}
              isReset={!filterData.modify}
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
            selectedOption={selectedPositionOption}
          />

          <SingleSelectDropdown
            defaultLabel="진행방식"
            options={progressList || []}
            onChangeValue={value => {
              const newValue = value.map(item => item.key);
              setFilterData(prev => ({
                ...prev,
                meetingType: newValue[0],
                modify: true,
              }));
            }}
            boxShape="buttonShape"
            selectedOption={selectedProgressOption}
          />
        </div>

        <SingleSelectDropdown
          defaultLabel="정렬"
          options={sortList}
          onChangeValue={value => {
            const newValue = value.map(item => item.key);
            setFilterData(prev => ({
              ...prev,
              sort: newValue[0],
              modify: true,
            }));
          }}
          boxShape="buttonShape"
          selectedOption={selectedSortOption}
        />
      </div>

      <ul className="mb-[90px] grid grid-cols-3 gap-6 lg:grid-cols-2">
        {(data?.projects || []).map(card => (
          <li key={card.id} className="[&>a]:!w-full">
            <LoungePostCard card={card} />
          </li>
        ))}
      </ul>
      {data?.projects.length === 0 && (
        <EmptyContent message="모집중인 프로젝트가 없습니다." />
      )}
      {isLoading && (
        <div className="flex w-full justify-center py-10">
          <LoopLoading />
        </div>
      )}

      {(data?.projects || []).length > 0 && (
        <Pagination
          totalPages={data?.totalPages || 0}
          currentPage={data?.currentPage || 0 || 1}
          onPageChange={(pageNumber: number) => {
            setFilterData(prev => ({
              ...prev,
              page: pageNumber,
              modify: true,
            }));
          }}
        />
      )}
    </>
  );
}
