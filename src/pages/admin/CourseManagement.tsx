import { useSearchParams } from 'react-router-dom';

import {
  COURSE_MANAGEMENT_TAB_LIST,
  CourseManagementTabType,
} from '@/constants';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { updateQueryParams } from '@/utils';

import CalendarAclTable from '@/components/calendar/CalendarAclTable';
import PreparingPage from '@/components/common/PreparingPage';
import TabNavigation from '@/components/common/TabNavigation';

const TAB = 'tab';

export default function CourseManagement() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabName = searchParams.get(TAB);

  const handleChangeValue = (type: CourseManagementTabType) => {
    updateQueryParams(searchParams, setSearchParams, TAB, type);
  };

  return (
    <MainView>
      <Header title="교육과정 관리" />
      <TabNavigation
        selectValue={tabName ?? 'calendar'}
        tabList={COURSE_MANAGEMENT_TAB_LIST}
        onChangeValue={handleChangeValue}
        selectedStyle={{ point: 'dot', color: 'green' }}
        tabClassName="!p-0 mr-3 mt-0"
      />
      {(tabName === null || tabName === 'calendar') && <CalendarAclTable />}

      {tabName === 'course' && <PreparingPage className="mt-5 !rounded-3xl" />}
    </MainView>
  );
}
