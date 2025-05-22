import { useGetUserProfile } from '@/services/auth/authQueries';

import {
  courseManagementTabList,
  courseManagementTabListForHasSuperAdmin,
} from '@/constants';
import { useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { CourseManagementTabType } from '@/types/admin';
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
          selectValue={tabName ?? 'course'}
          tabList={
            hasSuperAdmin(userProfile.role)
              ? courseManagementTabListForHasSuperAdmin
              : courseManagementTabList
          }
          onChangeValue={handleChangeTab}
          tabClassName="!pb-3 !px-3"
        />
      )}
      {(tabName === null || tabName === 'course') && (
        <PreparingPage className="mt-5 !rounded-3xl" />
      )}
      {tabName === 'calendar' && hasSuperAdmin(userProfile?.role) && (
        <CalendarAclTable />
      )}
    </MainView>
  );
}
