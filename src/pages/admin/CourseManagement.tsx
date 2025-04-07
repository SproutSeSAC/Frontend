import {
  COURSE_MANAGEMENT_TAB_LIST,
  CourseManagementTabType,
} from '@/constants';
import { useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import CalendarAclTable from '@/components/calendar/CalendarAclTable';
import PreparingPage from '@/components/common/PreparingPage';
import TabNavigation from '@/components/common/TabNavigation';

export default function CourseManagement() {
  const { tabName, handleChangeTab } = useHandleTabNavigation();

  return (
    <MainView>
      <Header title="교육과정 관리" />
      <TabNavigation<CourseManagementTabType>
        selectValue={tabName ?? 'calendar'}
        tabList={COURSE_MANAGEMENT_TAB_LIST}
        onChangeValue={handleChangeTab}
        tabClassName="!pb-3 !px-3"
      />
      {(tabName === null || tabName === 'calendar') && <CalendarAclTable />}

      {tabName === 'course' && <PreparingPage className="mt-5 !rounded-3xl" />}
    </MainView>
  );
}
