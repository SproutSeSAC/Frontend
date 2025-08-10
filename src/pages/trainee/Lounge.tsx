import { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetLoungeProjectList } from '@/services/post/loungeQueries';
import { useGetJobList } from '@/services/specifications/specificationsQueries';

import { progressList, sortList } from '@/constants';
import { useDialogContext, useFilterData, useTechStackList } from '@/hooks';
import { LoungeProjectFilter, Option, Progress, SortDisplayKey } from '@/types';
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
  size: 21,
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

  const jobOptionList = [{ id: 0, job: '제한 없음' }, ...(jobList || [])]?.map(
    ({ id, job }) => ({ id, name: job }),
  );

  const { isTechStackListLoading, techStackOptionList } = useTechStackList();

  const selectedTechStackOption = useMemo(() => {
    const { techStack } = debouncedFilter;
    return techStackOptionList?.filter(({ id }) => techStack?.includes(id));
  }, [debouncedFilter, techStackOptionList]);

  const selectedPositionOption = useMemo(() => {
    const { position } = debouncedFilter;
    const selectedPosition = jobOptionList
      ?.filter(({ id }) => position?.includes(id))
      .map(({ id, name }) => ({ id, name }))?.[0];
    return selectedPosition;
  }, [debouncedFilter, jobOptionList]);

  const selectedProgressOption = useMemo(() => {
    const { meetingType } = debouncedFilter;
    return progressList?.filter(({ key }) => meetingType?.includes(key))?.[0];
  }, [debouncedFilter]);

  const selectedSortOption = useMemo(() => {
    const { sort } = debouncedFilter;
    return sortList?.filter(({ key }) => sort?.includes(key))?.[0];
  }, [debouncedFilter]);

  const { showToast } = useDialogContext();

  if (pType === 'EDIT') return <LoungeForm />;

  const onChangeOptionList = (
    type: '직무' | '기술 스택',
    data: Option[],
    onChange: (optionList: {
      techStack?: number[];
      position?: number[];
    }) => void,
  ) => {
    const selectedIds = data.map(item => item.id);

    if (selectedIds.includes(0) && selectedIds.length > 1) {
      showToast(
        data[0].id === 0
          ? '먼저 "제한 없음" 옵션을 해제해주세요.'
          : `선택한 ${type} 옵션을 해제했습니다.`,
      );
      const filteredUnlimitOption = selectedIds.filter(id => id === 0);

      const optionByType = {
        직무: { position: filteredUnlimitOption },
        '기술 스택': { techStack: filteredUnlimitOption },
      };

      return onChange(optionByType[type]);
    }

    const dataByType = {
      직무: { position: selectedIds },
      '기술 스택': { techStack: selectedIds },
    };

    return onChange(dataByType[type]);
  };

  return (
    <>
      <SearchInput
        name="search"
        value={currFilter.keyword}
        placeholder="찾으시는 프로젝트를 검색해 주세요"
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
              options={techStackOptionList}
              value={selectedTechStackOption.map(({ id }) => id)}
              onChangeValue={value => {
                onChangeOptionList('기술 스택', value, handleChangeFilter);
              }}
              boxShape="buttonShape"
              hasUnlimitOption
            />
          )}

          <SingleSelectDropdown
            defaultLabel="직무"
            options={jobOptionList}
            onChangeValue={value => {
              onChangeOptionList('직무', value, handleChangeFilter);
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

      {!isLoading &&
        (projects.length === 0 ? (
          <EmptyContent
            message="모집중인 프로젝트가 없습니다."
            className="mt-16"
          />
        ) : (
          <ul className="mb-16 grid grid-cols-3 gap-6">
            {projects.map(project => (
              <li key={project.id} className="[&>a]:!w-full">
                <LoungePostCard card={project} />
              </li>
            ))}
          </ul>
        ))}

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
