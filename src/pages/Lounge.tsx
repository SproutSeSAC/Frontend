import { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  useGetLoungePositionsFilterList,
  useGetLoungeProjects,
} from '@/services/lounge/loungeQueries';

import { progressList, sortList } from '@/constants';
import { useFilterData, useTechStackList } from '@/hooks';
import { LoungeProjectFilters } from '@/types';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import Pagination from '@/components/common/Pagination';
import SquareButton from '@/components/common/button/SquareButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import LoungeForm from '@/components/lounge/form/LoungeForm';

const initialState: LoungeProjectFilters = {
  page: 1,
  size: 21,
  modify: false,
};

export default function Lounge() {
  const {
    searchRef,
    currFilter,
    handleChangeKeyword,
    handleSearchSubmit,
    handleChangeFilter,
    handleResetFilter,
  } = useFilterData({ initialState });

  const [searchParams] = useSearchParams();
  const pType = searchParams.get('pType');

  const { data, isLoading } = useGetLoungeProjects(currFilter);
  const { data: positionsList } = useGetLoungePositionsFilterList();

  const { techStackList, isTechStackListLoading } = useTechStackList();

  const selectedPositionOption = useMemo(() => {
    const { position } = currFilter;
    return positionsList?.filter(({ id }) => position?.includes(id))?.[0];
  }, [currFilter, positionsList]);

  const selectedProgressOption = useMemo(() => {
    const { meetingType } = currFilter;
    return progressList?.filter(({ key }) => meetingType?.includes(key))?.[0];
  }, [currFilter]);

  const selectedSortOption = useMemo(() => {
    const { sort } = currFilter;
    return sortList?.filter(({ key }) => sort?.includes(key))?.[0];
  }, [currFilter]);

  if (pType === 'EDIT') return <LoungeForm />;

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
          onChange={handleChangeKeyword}
        />
        <div className="flex gap-2">
          <SquareButton
            name="검색하기"
            onClick={handleSearchSubmit}
            className="w-[88px] whitespace-nowrap px-3.5 py-3 text-white"
          />
          <button
            onClick={handleResetFilter}
            className="w-20 whitespace-nowrap rounded-lg bg-mainGray px-3.5 py-3 text-white"
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
              isReset={!currFilter.modify}
              onChangeValue={value => {
                const newValue = value.map(item => item.id);
                handleChangeFilter({ techStack: newValue });
              }}
              boxShape="buttonShape"
            />
          )}

          <SingleSelectDropdown
            defaultLabel="포지션"
            options={positionsList || []}
            onChangeValue={value => {
              const newValue = value.map(item => item.id);
              handleChangeFilter({ position: newValue });
            }}
            boxShape="buttonShape"
            selectedOption={selectedPositionOption}
          />

          <SingleSelectDropdown
            defaultLabel="진행방식"
            options={progressList || []}
            onChangeValue={value => {
              const newValue = value.map(item => item.key);
              handleChangeFilter({ meetingType: newValue[0], modify: true });
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
            handleChangeFilter({ sort: newValue[0], modify: true });
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
            handleChangeFilter({ page: pageNumber, modify: true });
          }}
        />
      )}
    </>
  );
}
