import {
  UserManagementFilter,
  useGetInfiniteTraineeList,
  useGetInfiniteUserList,
} from '@/services/admin/userToManageQueries';
import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useGetCourseListByCampus } from '@/services/campusCourse/campusCourseQueries';

import { campusIdAtom, courseIdAtom } from '@/atoms/userManagementFilterAtom';

import {
  traineeLabelList,
  userLabelList,
  userManagementTabList,
  userManagementTabListForHasSuperAdmin,
} from '@/constants';
import { useFilterData, useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { UserManagementTabType } from '@/types/admin';
import { hasSuperAdmin } from '@/utils';
import { useAtom } from 'jotai';

import UserManagementItem from '@/components/admin/UserManagementItem';
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
  size: 7,
  keyword: '',
};

export default function UserManagement() {
  const [selectedCampusId, setSelectedCampusId] = useAtom(campusIdAtom);

  const [selectedCourseId, setSelectedCourseId] = useAtom(courseIdAtom);

  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const currTab = (tabName ?? 'trainee-list') as UserManagementTabType;

  const {
    currFilter,
    handleChangeKeyword,
    handleChangeFilter,
    debouncedFilter,
    handleResetFilter,
  } = useFilterData<InitialFilter>({ initialFilter });

  const userFilter = {
    ...debouncedFilter,
    campusId: selectedCampusId!,
    courseId: selectedCourseId!,
    role: 'CAMPUS_LEADER',
  };

  const { data: { role, campusList, courseList } = initialUserProfile } =
    useGetUserProfile();

  const { data: userList } = useGetInfiniteUserList(currTab, userFilter);

  const { data: traineeList } = useGetInfiniteTraineeList(currTab, userFilter);

  /**
   * 캠퍼스 목록
   * - 매니저가 '갖고 있는' 캠퍼스만 나타낸다.
   * */
  const campusOptionList = campusList?.map(({ id, campusName }) => ({
    id,
    name: campusName,
  }));

  const currCampusId = selectedCampusId || campusList[0]?.id;

  const selectedCampusOption = campusOptionList?.find(
    ({ id }) => id === currCampusId,
  );

  const courseListByCampus = useGetCourseListByCampus([currCampusId]);

  if (!campusList || !courseListByCampus[0].data) return null;

  /**
   * 캠퍼스별 교육과정 목록
   * - 매니저가 '갖고 있는' 캠퍼스별 교육과정만 나타낸다.
   */
  const courseOptionList = courseListByCampus[0].data
    .map(({ id, title: name }) => ({ id, name }))
    .filter(({ id }) => !!courseList.find(({ courseId }) => courseId === id));

  const selectedCourseOption =
    courseOptionList.find(({ id }) => id === selectedCourseId) ||
    courseOptionList[0];

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

  const dataType = dataTypeObj[currTab];

  const { data, labelList, gridStyle } = dataType;

  return (
    <MainView className="mb-20">
      <Header title="사용자 관리" />

      <TabNavigation<UserManagementTabType>
        selectValue={tabName ?? 'trainee-list'}
        tabList={
          hasSuperAdmin(role)
            ? userManagementTabListForHasSuperAdmin
            : userManagementTabList
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
            onChangeValue={option => setSelectedCampusId(option[0].id)}
            selectBoxClassName="w-full rounded-xl border-0 justify-between items-center h-12"
            optionClassName="text-lg hover:bg-lightGray-active !py-2 pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
          />
        )}

        {courseListByCampus[0].data && (
          <SingleSelectDropdown
            defaultLabel="교육과정 선택"
            options={courseOptionList}
            selectedOption={selectedCourseOption}
            onChangeValue={option => setSelectedCourseId(option[0].id)}
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
