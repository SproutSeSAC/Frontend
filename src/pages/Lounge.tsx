import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

export default function Lounge() {
  return (
    <>
      <MainView>
        <Header
          title="나에게 딱 맞는 프로젝트를 만나보세요!"
          highlight="프로젝트"
        />
      </MainView>
      <SideView>사이드뷰</SideView>
    </>
  );
}
