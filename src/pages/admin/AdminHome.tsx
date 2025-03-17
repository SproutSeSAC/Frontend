import { useGetUserProfile } from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import RoleSwitchButton from '@/components/common/button/RoleSwitchButton';

export default function AdminHome() {
  const { data } = useGetUserProfile();

  return (
    <MainView>
      <Header title={`${data?.name || ''} 관리자님, 환영합니다!`}>
        <RoleSwitchButton title="학생으로 전환" />
      </Header>
    </MainView>
  );
}
