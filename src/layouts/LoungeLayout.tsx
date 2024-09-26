import { Outlet, useLocation } from 'react-router-dom';

import Header from './Header';

import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import LoungeSideView from '@/components/lounge/layout/LoungeSideView';
import LoungeTabNavigation from '@/components/lounge/layout/LoungeTabNavigation';

export default function LoungeLayout() {
  const location = useLocation();

  return (
    <>
      <MainView>
        <Header
          title="나에게 딱 맞는 프로젝트를 만나보세요!"
          highlight="프로젝트"
        />
        {!location.pathname.includes('/lounge/post') && <LoungeTabNavigation />}
        <Outlet />
      </MainView>
      <SideView>
        <LoungeSideView />
      </SideView>
    </>
  );
}
