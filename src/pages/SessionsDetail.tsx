import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { isTrainee } from '@/utils';

export default function SessionsDetail() {
  const { data: { role } = initialUserProfile } = useGetUserProfile();

  return (
    <MainView>
      <Header
        title={isTrainee(role) ? '내가 신청한 특강' : '특강 / 행사 신청 현황'}
      />
    </MainView>
  );
}
