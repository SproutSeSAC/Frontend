import { useEffect } from 'react';

import {
  UserManagementFilter,
  useGetInfiniteTraineeList,
  useGetInfiniteUserList,
} from '@/services/admin/userToManageQueries';
import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetCampusList,
  useGetCourseListByCampus,
} from '@/services/campusCourse/campusCourseQueries';

import {
  HAS_SUPER_ADMIN_USER_MANAGEMENT_TAB_LIST,
  USER_MANAGEMENT_TAB_LIST,
  UserManagementTabType,
  traineeLabelList,
  userLabelList,
} from '@/constants';
import { useFilterData, useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { hasSuperAdmin } from '@/utils';

import EmptyContent from '@/components/common/EmptyContent';
import Pagination from '@/components/common/Pagination';
import TabNavigation from '@/components/common/TabNavigation';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import SearchInput from '@/components/common/input/SearchInput';
import UserManagementItem from '@/components/user/UserManagementItem';

const initialFilter: UserManagementFilter = {
  page: 1,
  size: 7,
  keyword: '',
};

export default function UserManagement() {
  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const {
    currFilter,
    handleChangeKeyword,
    handleChangeFilter,
    debouncedFilter,
    handleResetFilter,
  } = useFilterData<UserManagementFilter>({ initialFilter });

  const { data: userProfile } = useGetUserProfile();

  const { data: userList } = useGetInfiniteUserList(debouncedFilter);

  const { data: traineeList } = useGetInfiniteTraineeList(debouncedFilter);

  const { data: campusList } = useGetCampusList();

  useEffect(() => {
    if (userProfile) {
      handleChangeFilter({
        courseId: userProfile?.courseList[0].courseId,
        campusId: userProfile?.campusList[0].id,
      });
    }
  }, [handleChangeFilter, userProfile]);

  const campusOptionList = campusList?.map(({ id, name }) => ({ id, name }));

  const selectedCampusOption =
    campusOptionList?.find(({ id }) => id === currFilter.campusId) ||
    campusOptionList?.[0];

  const courseListByCampusData = useGetCourseListByCampus(
    selectedCampusOption?.id ? [selectedCampusOption?.id] : [],
  );

  if (!userProfile || !campusList || !courseListByCampusData[0].data)
    return null;

  const courseOptionList = courseListByCampusData[0].data.map(
    ({ id, title: name }) => ({ id, name }),
  );

  const selectedCourseOption =
    courseOptionList.find(({ id }) => id === currFilter.courseId) ||
    courseOptionList[0];

  const dataTypeObj = {
    'user-list': {
      labelList: userLabelList,
      data: userList,
      gridStyle: 'grid-cols-[80px_0.8fr_1.5fr_1fr_0.8fr_2.4fr_50px]',
    },
    'trainee-list': {
      labelList: traineeLabelList,
      data: traineeList,
      gridStyle: 'grid-cols-[80px_0.8fr_1.5fr_1fr_2fr_50px]',
    },
  };

  const dataType =
    dataTypeObj[(tabName ?? 'trainee-list') as UserManagementTabType];

  const { data, labelList, gridStyle } = dataType;

  return (
    <MainView className="mb-20">
      <Header title="사용자 관리" />

      <TabNavigation<UserManagementTabType>
        selectValue={tabName ?? 'trainee-list'}
        tabList={
          hasSuperAdmin(userProfile.role)
            ? HAS_SUPER_ADMIN_USER_MANAGEMENT_TAB_LIST
            : USER_MANAGEMENT_TAB_LIST
        }
        onChangeValue={handleChangeTab}
        tabClassName="!p-3"
      />

      <div className="my-4 flex items-center justify-between gap-4">
        {campusOptionList && (
          <SingleSelectDropdown
            defaultLabel="캠퍼스 선택"
            options={campusOptionList}
            selectedOption={selectedCampusOption}
            onChangeValue={option =>
              handleChangeFilter({ campusId: option[0].id })
            }
            selectBoxClassName="w-full rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />
        )}

        {courseListByCampusData[0].data && (
          <SingleSelectDropdown
            defaultLabel="교육과정 선택"
            options={courseOptionList}
            selectedOption={selectedCourseOption}
            onChangeValue={option =>
              handleChangeFilter({ courseId: option[0].id })
            }
            selectBoxClassName="!max-w-[450px] rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />
        )}

        <SearchInput
          name="search"
          value={currFilter.keyword}
          placeholder="이름을 입력해주세요."
          onChange={handleChangeKeyword}
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
        <ul className="mb-16 mt-4 flex w-full flex-col gap-4">
          {data.userList.map(user => (
            <UserManagementItem
              key={user.userId}
              user={user}
              type={tabName as 'trainee-list' | 'user-list'}
              className={`grid gap-x-3 pl-6 pr-2 ${gridStyle}`}
            />
          ))}
        </ul>
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
