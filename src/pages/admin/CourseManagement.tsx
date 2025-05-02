import { useGetUserProfile } from '@/services/auth/authQueries';

import {
  COURSE_MANAGEMENT_TAB_LIST,
  CourseManagementTabType,
  HAS_SUPER_ADMIN_COURSE_MANAGEMENT_TAB_LIST,
} from '@/constants';
import { useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { hasSuperAdmin } from '@/utils';

import CalendarAclTable from '@/components/calendar/CalendarAclTable';
import PreparingPage from '@/components/common/PreparingPage';
import TabNavigation from '@/components/common/TabNavigation';

export default function CourseManagement() {
  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const { data: userProfile } = useGetUserProfile();

  return (
    <MainView>
      <Header title="교육과정 관리" />
      {userProfile && (
        <TabNavigation<CourseManagementTabType>
          selectValue={tabName ?? 'calendar'}
          tabList={
            hasSuperAdmin(userProfile.role)
              ? HAS_SUPER_ADMIN_COURSE_MANAGEMENT_TAB_LIST
              : COURSE_MANAGEMENT_TAB_LIST
          }
          onChangeValue={handleChangeTab}
          tabClassName="!pb-3 !px-3"
        />
      )}
      {(tabName === null || tabName === 'calendar') && <CalendarAclTable />}

      {tabName === 'course' && <PreparingPage className="mt-5 !rounded-3xl" />}
    </MainView>
  );
}
