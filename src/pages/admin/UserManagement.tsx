import { useSearchParams } from 'react-router-dom';

import { USER_MANAGEMENT_TAB_LIST, UserManagementTabType } from '@/constants';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';

const TAB = 'tab';

export default function UserManagement() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabName = searchParams.get(TAB);

  const handleChangeValue = (type: UserManagementTabType) => {
    updateQueryParams(searchParams, setSearchParams, TAB, type);
  };

  return (
    <MainView>
      <Header title="사용자 관리" />
      <TabNavigation<UserManagementTabType>
        selectValue={tabName ?? 'trainee-list'}
        tabList={USER_MANAGEMENT_TAB_LIST}
        onChangeValue={handleChangeValue}
        selectedStyle={{ point: 'dot', color: 'green' }}
        tabClassName="!p-0 mr-3 mt-0"
      />
    </MainView>
  );
}
