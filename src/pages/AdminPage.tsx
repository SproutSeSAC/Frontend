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
    { text: '캘린더 관리', type: 'calendar-acl' },
  ];

  const tabName = searchParams.get(TAB) as TabType;

  const handleChangeValue = (type: TabType) => {
    updateQueryParams(searchParams, setSearchParams, TAB, type);
  };

  const navigate = useNavigate();

  const { data } = useGetUserProfile();

  useEffect(() => {
    if (data?.role && !hasSuperAdmin(data.role)) {
      navigate(-1);
    }
  }, [navigate, data?.role]);

  return (
    data?.role &&
    hasSuperAdmin(data.role) && (
      <MainView>
        <Header title="관리자 페이지" />
        <TabNavigation<TabType>
          selectValue={tabName ?? 'calendar-acl'}
          tabList={tabList}
          onChangeValue={handleChangeValue}
        />

        {(tabName === 'calendar-acl' || tabName === null) && (
          <CalendarAclTable />
        )}
      </MainView>
    )
  );
}
