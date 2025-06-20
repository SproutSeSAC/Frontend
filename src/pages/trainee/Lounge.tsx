import { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetLoungeProjectList } from '@/services/post/loungeQueries';
import { useGetJobList } from '@/services/specifications/specificationsQueries';

import { progressList, sortList } from '@/constants';
import { useFilterData, useTechStackList } from '@/hooks';
import { LoungeProjectFilter, Progress, SortDisplayKey } from '@/types';
import { BsArrowCounterclockwise } from 'react-icons/bs';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import Pagination from '@/components/common/Pagination';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import LoungeForm from '@/components/lounge/form/LoungeForm';

const initialFilter: LoungeProjectFilter = {
  page: 1,
  size: 20,
  keyword: '',
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
    currFilter,
    debouncedFilter,
    handleChangeKeyword,
    handleChangeFilter,
    handleResetFilter,
    handleResetKeyword,
  } = useFilterData({ initialFilter });

  const [searchParams] = useSearchParams();
  const pType = searchParams.get('pType');

  const {
    data: { projects = [], totalPages } = initialProjectList,
    isLoading,
  } = useGetLoungeProjectList(debouncedFilter);

  const { data: jobList } = useGetJobList();

  const { techStackList, isTechStackListLoading } = useTechStackList();

  const selectedTechStackOption = useMemo(() => {
    const { techStack } = debouncedFilter;
    return techStackList?.filter(({ id }) => techStack?.includes(id));
  }, [debouncedFilter, techStackList]);

  const selectedPositionOption = useMemo(() => {
    const { position } = debouncedFilter;
    const selectedPosition = jobList
      ?.filter(({ id }) => position?.includes(id))
      .map(({ id, job }) => ({ id, name: job }))?.[0];
    return selectedPosition;
  }, [debouncedFilter, jobList]);

  const selectedProgressOption = useMemo(() => {
    const { meetingType } = debouncedFilter;
    return progressList?.filter(({ key }) => meetingType?.includes(key))?.[0];
  }, [debouncedFilter]);

  const selectedSortOption = useMemo(() => {
    const { sort } = debouncedFilter;
    return sortList?.filter(({ key }) => sort?.includes(key))?.[0];
  }, [debouncedFilter]);

  if (pType === 'EDIT') return <LoungeForm />;

  return (
    <>
      <SearchInput
        name="search"
        value={currFilter.keyword}
        placeholder="검색어를 입력해 주세요"
        onChange={handleChangeKeyword}
        resetChange={handleResetKeyword}
        inputStyle="square"
        className="mt-6 w-full"
      />

      <div className="relative mb-9 mt-6 flex justify-between">
        <div className="mr-auto flex gap-4">
          {!isTechStackListLoading && (
            <TechStackDropdown
              defaultLabel="기술 스택"
              defaultTabValue="백엔드"
              options={techStackList}
              value={selectedTechStackOption.map(({ id }) => id)}
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
        <button
          onClick={handleResetFilter}
          className="ml-4 flex items-center rounded-full border border-mainGray bg-mainGreen px-4 py-1"
        >
          <span className="whitespace-nowrap pr-2 text-white">초기화</span>
          <BsArrowCounterclockwise className="text-white" />
        </button>
      </div>

      <ul className="mb-[90px] grid grid-cols-3 gap-6">
        {projects.map(project => (
          <li key={project.id} className="[&>a]:!w-full">
            <LoungePostCard card={project} />
          </li>
        ))}
      </ul>

      {projects.length === 0 && !isLoading && (
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
          currentPage={currFilter.page}
          onPageChange={(pageNumber: number) => {
            handleChangeFilter({ page: pageNumber });
          }}
        />
      )}
    </>
  );
}
