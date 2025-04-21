import { useEffect } from 'react';

import { Link } from 'react-router-dom';

import {
  UserManagementFilter,
  useGetInfiniteTraineeList,
  useGetInfiniteUserList,
} from '@/services/admin/userToManageQueries';
import { useGetUserProfile } from '@/services/auth/authQueries';

import {
  USER_MANAGEMENT_TAB_LIST,
  UserManagementTabType,
  traineeLabelList,
  userLabelList,
} from '@/constants';
import { useFilterData, useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

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

type UserManagementTabName = 'user-list' | 'trainee-list';

export default function UserManagement() {
  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const {
    currFilter,
    handleChangeKeyword,
    handleChangeFilter,
    debouncedFilter,
    handleResetFilter,
  } = useFilterData<UserManagementFilter>({ initialFilter });

  const { data: userList } = useGetInfiniteUserList(debouncedFilter);

  const { data: traineeList } = useGetInfiniteTraineeList(debouncedFilter);

  const dataTypeObj = {
    'user-list': {
      labelList: userLabelList,
      data: userList,
      gridStyle:
        'grid grid-cols-[80px_0.8fr_1.5fr_1fr_0.8fr_2.4fr_50px] gap-x-3',
    },
    'trainee-list': {
      labelList: traineeLabelList,
      data: traineeList,
      gridStyle: 'grid grid-cols-[80px_0.8fr_1.5fr_1fr_2fr_50px] gap-x-3',
    },
  };

  const dataType =
    dataTypeObj[(tabName ?? 'trainee-list') as UserManagementTabName];

  const { data, labelList, gridStyle } = dataType;

  const { data: userProfile } = useGetUserProfile();

  useEffect(() => {
    if (userProfile) {
      const { courseList, campusList } = userProfile;

      handleChangeFilter({
        courseId: courseList[0].courseId,
        campusId: campusList[0].id,
      });
    }
  }, [handleChangeFilter, userProfile]);

  if (!userProfile) return null;
  const { campusList, courseList } = userProfile;

  const courseOptionList = courseList.map(course => ({
    id: course.courseId,
    name: course.courseTitle,
  }));

  const campusOptionList = campusList.map(campus => ({
    id: campus.id,
    name: campus.campusName,
  }));

  const selectedCampusOption = campusOptionList.find(
    ({ id }) => id === currFilter.campusId,
  ) || {
    id: campusOptionList[0].id,
    name: campusOptionList[0].name,
  };

  const selectedCourseOption = courseOptionList.find(
    ({ id }) => id === currFilter.courseId,
  ) || {
    id: courseOptionList[0].id,
    name: courseOptionList[0].name,
  };

  return (
    <MainView className="mb-20">
      <Header title="사용자 관리" />

      <TabNavigation<UserManagementTabType>
        selectValue={tabName ?? 'trainee-list'}
        tabList={USER_MANAGEMENT_TAB_LIST}
        onChangeValue={handleChangeTab}
        tabClassName="!p-3"
      />

      {userProfile && (
        <div className="my-4 flex items-center justify-between gap-4">
          <SingleSelectDropdown
            defaultLabel={campusList[0].campusName || '캠퍼스 선택'}
            options={campusOptionList}
            selectedOption={selectedCampusOption}
            onChangeValue={option =>
              handleChangeFilter({ campusId: option[0].id })
            }
            selectBoxClassName="w-full rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />

          <SingleSelectDropdown
            defaultLabel={courseList[0].courseTitle || '교육과정 선택'}
            options={courseOptionList}
            selectedOption={selectedCourseOption}
            onChangeValue={option =>
              handleChangeFilter({ courseId: option[0].id })
            }
            selectBoxClassName="w-[400px] rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />

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
      )}

      <header className={`${gridStyle} mb-2 mt-5 px-6`}>
        {[...labelList, `총 ${data?.totalCounts || 0}명`].map(label => (
          <span key={label} className="text-darkGray-active">
            {label}
          </span>
        ))}
      </header>

      {data && data?.userList.length !== 0 ? (
        <ul className="mb-16 mt-4 flex w-full flex-col gap-4">
          {data.userList.map(user => (
            <Link key={user.userId} to={`/admin/user/${user.userId}`}>
              <UserManagementItem
                user={user}
                type={tabName as 'trainee-list' | 'user-list'}
                className={`${gridStyle}`}
              />
            </Link>
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
