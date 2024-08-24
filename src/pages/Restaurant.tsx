import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

export default function Restaurant() {
  return (
    <>
      <MainView>
        <Header title="새싹에서 맛집을 소개해드려요!" highlight="새싹" />
        <div className="">맛집페이지</div>
      </MainView>

      <SideView>
        <div>사이드뷰</div>
      </SideView>
    </>
  );
}
