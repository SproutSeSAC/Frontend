import { useMemo } from 'react';

import {
  UserManagementFilter,
  useGetInfiniteTraineeList,
  useGetInfiniteUserList,
} from '@/services/admin/userToManageQueries';
import { useGetUserProfile } from '@/services/auth/authQueries';

import { campusIdAtom, courseIdAtom } from '@/atoms/userManagementFilterAtom';

import {
  traineeLabelList,
  userLabelList,
  userManagementTabList,
  userManagementTabListForHasSuperAdmin,
} from '@/constants';
import {
  useFilterCampusCourse,
  useFilterData,
  useHandleTabNavigation,
} from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { UserManagementTabType } from '@/types/admin';
import { hasSuperAdmin } from '@/utils';
import { useAtom } from 'jotai';

import UserManagementList from '@/components/admin/UserManagementList';
import EmptyContent from '@/components/common/EmptyContent';
import Pagination from '@/components/common/Pagination';
import TabNavigation from '@/components/common/TabNavigation';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import SearchInput from '@/components/common/input/SearchInput';

type InitialFilter = Pick<
  UserManagementFilter,
  'page' | 'size' | 'offset' | 'keyword'
>;

const initialFilter: InitialFilter = {
  page: 1,
  size: 10,
  keyword: '',
};

export default function UserManagement() {
  const [selectedCampusId, setSelectedCampusId] = useAtom(campusIdAtom);

  const [selectedCourseId, setSelectedCourseId] = useAtom(courseIdAtom);

  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const { data: userProfile } = useGetUserProfile();

  const {
    currFilter,
    handleChangeKeyword,
    handleChangeFilter,
    debouncedFilter,
    handleResetFilter,
  } = useFilterData<InitialFilter>({ initialFilter });

  const {
    campusOptionList,
    selectedCampusOption,
    courseOptionList,
    selectedCourseOption,
    courseListByCampusData,
  } = useFilterCampusCourse({ selectedCampusId, selectedCourseId });

  const campusAndCourseId = useMemo(() => {
    const selectAllCourseOption =
      !selectedCampusId ||
      selectedCampusId === 0 ||
      !selectedCourseId ||
      selectedCourseId === 0;

    const courseId = !selectAllCourseOption
      ? { courseId: selectedCourseId }
      : {};

    return selectedCampusId && selectedCampusId !== 0
      ? { campusId: selectedCampusId, ...courseId }
      : {};
  }, [selectedCampusId, selectedCourseId]);

  const currTab = (tabName ?? 'trainee-list') as UserManagementTabType;

  const userFilter = { ...debouncedFilter, ...campusAndCourseId };

  const { data: userList } = useGetInfiniteUserList(currTab, userFilter);

  const { data: traineeList } = useGetInfiniteTraineeList(currTab, userFilter);

  const dataTypeObj = {
    'user-list': {
      labelList: userLabelList,
      data: userList,
      gridStyle: 'grid-cols-[80px_0.8fr_1.5fr_1fr_0.8fr_2.4fr_60px]',
    },
    'trainee-list': {
      labelList: traineeLabelList,
      data: traineeList,
      gridStyle: 'grid-cols-[80px_0.8fr_1.5fr_1fr_2fr_60px]',
    },
  };

  const { data, labelList, gridStyle } = dataTypeObj[currTab];

  return (
    <MainView className="mb-20">
      <Header title="사용자 관리" />

      <TabNavigation<UserManagementTabType>
        selectValue={tabName ?? 'trainee-list'}
        tabList={
          hasSuperAdmin(userProfile?.role)
            ? userManagementTabListForHasSuperAdmin
            : userManagementTabList
        }
        onChangeValue={(type: string) => {
          if (currTab !== type) {
            setSelectedCampusId(campusOptionList[0].id);
            setSelectedCourseId(courseOptionList[0].id);
          }
          handleChangeTab(type);
        }}
        tabClassName="!p-3"
      />

      <div className="my-4 flex items-center justify-between gap-4">
        {campusOptionList && (
          <SingleSelectDropdown
            defaultLabel="캠퍼스 선택"
            options={campusOptionList}
            selectedOption={selectedCampusOption}
            onChangeValue={option => {
              if (selectedCampusId !== option[0].id) {
                handleChangeFilter({ page: initialFilter.page });
              }
              setSelectedCampusId(option[0].id);
            }}
            selectBoxClassName="w-full rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />
        )}

        {courseListByCampusData[0]?.data?.length !== 0 && (
          <SingleSelectDropdown
            defaultLabel="교육과정 선택"
            options={courseOptionList}
            selectedOption={selectedCourseOption}
            onChangeValue={option => {
              if (selectedCourseId !== option[0].id) {
                setSelectedCourseId(courseOptionList[0].id);
                handleChangeFilter({ page: initialFilter.page });
              }
              setSelectedCourseId(option[0].id);
            }}
            selectBoxClassName="!max-w-[450px] rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />
        )}

        <SearchInput
          name="search"
          value={currFilter.keyword}
          placeholder="이름을 입력해주세요."
          onChange={event => {
            handleChangeFilter({ page: initialFilter.page });
            handleChangeKeyword(event);
          }}
          className="ml-auto text-lg"
          inputStyle="square"
          resetChange={handleResetFilter}
        />
      </div>

      <header className={`grid gap-x-3 pl-6 pr-2 ${gridStyle} mb-2 mt-5`}>
        {[...labelList, `총 ${data?.totalCounts || 0}명`].map(label => (
          <span key={label} className="text-darkGray-active">
            {label}
          </span>
        ))}
      </header>

      {data && data?.userList.length !== 0 ? (
        <UserManagementList
          type={tabName as 'trainee-list' | 'user-list'}
          className={`grid gap-x-3 pl-6 pr-2 ${gridStyle}`}
          userList={data.userList}
        />
      ) : (
        <EmptyContent
          message="사용자가 없습니다."
          className="mb-16 mt-4 h-full min-h-[500px] rounded-[20px] border bg-lightGray py-20"
        />
      )}

      {data && data?.userList.length !== 0 && (
        <Pagination
          totalPages={data.totalPages}
          currentPage={currFilter.page}
          onPageChange={(pageNumber: number) =>
            handleChangeFilter({ page: pageNumber })
          }
        />
      )}
    </MainView>
  );
}
