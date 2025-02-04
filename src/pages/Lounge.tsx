import { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetLoungeProjectList } from '@/services/post/loungeQueries';
import { useGetJobList } from '@/services/specifications/specificationsQueries';

import { progressList, sortList } from '@/constants';
import { useFilterData, useTechStackList } from '@/hooks';
import { LoungeProjectFilter, Progress, SortDisplayKey } from '@/types';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import Pagination from '@/components/common/Pagination';
import SquareButton from '@/components/common/button/SquareButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import LoungeForm from '@/components/lounge/form/LoungeForm';

const initialState: LoungeProjectFilter = {
  page: 1,
  size: 20,
};

const initialProjectList = {
  projects: [],
  totalPages: 0,
  currentPage: 0,
  pageSize: 0,
  nextPage: null,
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

  const {
    data: { projects = [], totalPages, currentPage } = initialProjectList,
    isLoading,
  } = useGetLoungeProjectList(currFilter);

  const { data: jobList } = useGetJobList();

  const { techStackList, isTechStackListLoading } = useTechStackList();

  const selectedPositionOption = useMemo(() => {
    const { position } = currFilter;
    const selectedPosition = jobList
      ?.filter(({ id }) => position?.includes(id))
      .map(({ id, job }) => ({ id, name: job }))?.[0];
    return selectedPosition;
  }, [currFilter, jobList]);

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
              onChangeValue={value => {
                const newValue = value.map(item => item.id);
                handleChangeFilter({ techStack: newValue });
              }}
              boxShape="buttonShape"
            />
          )}

          <SingleSelectDropdown
            defaultLabel="포지션"
            options={jobList?.map(({ id, job }) => ({ id, name: job })) || []}
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
              const newValue = value.map(item => item.key) as Progress[];
              handleChangeFilter({ meetingType: newValue[0] });
            }}
            boxShape="buttonShape"
            selectedOption={selectedProgressOption}
          />
        </div>

        <SingleSelectDropdown
          defaultLabel="정렬"
          options={sortList}
          onChangeValue={value => {
            const newValue = value.map(item => item.key) as SortDisplayKey[];
            handleChangeFilter({ sort: newValue[0] });
          }}
          boxShape="buttonShape"
          selectedOption={selectedSortOption}
        />
      </div>

      <ul className="mb-[90px] grid grid-cols-3 gap-6">
        {projects.map(project => (
          <li key={project.id} className="[&>a]:!w-full">
            <LoungePostCard card={project} />
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <EmptyContent message="모집중인 프로젝트가 없습니다." />
      )}

      {isLoading && (
        <div className="flex w-full justify-center py-10">
          <LoopLoading />
        </div>
      )}

      {projects.length !== 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(pageNumber: number) => {
            handleChangeFilter({ page: pageNumber });
          }}
        />
      )}
    </>
  );
}
