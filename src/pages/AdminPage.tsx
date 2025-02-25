import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { hasSuperAdmin, updateQueryParams } from '@/utils';

import CalendarAclTable from '@/components/calendar/CalendarAclTable';
import TabNavigation from '@/components/common/TabNavigation';

const TAB = 'tab';

type TabType = 'calendar-acl' | 'course-management';

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabList: { text: string; type: TabType }[] = [
    { text: '일정관리 권한', type: 'calendar-acl' },
  ];

  const tabName = searchParams.get(TAB) as TabType;

  const handleChangeValue = (type: TabType) => {
    updateQueryParams(searchParams, setSearchParams, TAB, type);
  };

  const navigate = useNavigate();

  const { data, isLoading } = useGetUserProfile();

  useEffect(() => {
    if (!hasSuperAdmin(data?.role) && !isLoading) {
      navigate(-1);
    }
  }, [navigate, data?.role, isLoading]);

  return (
    <MainView>
      <Header title="관리자 페이지" />
      <TabNavigation<TabType>
        selectValue={tabName ?? 'calendar-acl'}
        tabList={tabList}
        onChangeValue={handleChangeValue}
      />

      {(tabName === 'calendar-acl' || tabName === null) && <CalendarAclTable />}
    </MainView>
  );
}
