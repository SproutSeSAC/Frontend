import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

export default function Home() {
  return (
    <>
      <MainView>
        <Header title="김철수 스프님 환영합니다!" />
        <div className="">메인페이지</div>
      </MainView>

      <SideView>
        <div>사이드뷰</div>
      </SideView>
    </>
  );
}
