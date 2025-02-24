import { Outlet, useLocation } from 'react-router-dom';
import { isSuperAdmin } from '@/utils';
import { FormProvider, useForm } from 'react-hook-form';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { useGetUserProfile } from '@/services/auth/authQueries';

export default function SessionsLayout() {
  const methods = useForm();
  const { data: userProfile } = useGetUserProfile();
  const location = useLocation();
  const sessionInfo = location.state;

  return (
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
          {sessionInfo && (
              <div className="-mt-8 text-darkerGray text-sm flex space-x-2">
                <span className="text-mainGreen font-semibold">{sessionInfo.title}</span>
                <span className="ml-2 flex space-x-2">
                  <span>일자 {sessionInfo.date}</span> <span>시간 {sessionInfo.startTime} ~ {sessionInfo.endTime}</span>
                </span>
              </div>
            )}
          <Outlet />
        </div>
      </FormProvider>
    </MainView>
  );
}
