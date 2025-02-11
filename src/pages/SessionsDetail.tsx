import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { isPreTrainee, isTrainee } from '@/utils';

export default function SessionsDetail() {
  const { data: { role } = initialUserProfile } = useGetUserProfile();

  return (
    <MainView>
      <Header
        title={
          isTrainee(role) && isPreTrainee(role)
            ? '특강 신청 현황'
            : '내가 신청한 특강'
        }
      />
    </MainView>
  );
}
