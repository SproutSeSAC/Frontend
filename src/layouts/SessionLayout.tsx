import { Outlet, useLocation } from 'react-router-dom';
import { isSuperAdmin } from '@/utils';
import { FormProvider, useForm } from 'react-hook-form';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { useGetUserProfile } from '@/services/auth/authQueries';

export default function SessionsLayout() {
  const location = useLocation();
  const methods = useForm();
  const { data: userProfile } = useGetUserProfile();

  return (
    <>
      <MainView>
        <FormProvider {...methods}>
          <div className="relative flex-1">
            <Header
              title={
                isSuperAdmin(userProfile?.role) 
                  ? '이벤트 신청 현황'
                  : '내가 신청한 이벤트'
              }
            />
            <Outlet />
          </div>
        </FormProvider>
      </MainView>
    </>
  );
}
