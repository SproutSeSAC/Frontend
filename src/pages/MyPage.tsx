import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

export default function MyPage() {
  return (
    <MainView>
      <Header title="회원정보수정" />
      <div className="">회원정보수정페이지</div>
    </MainView>
  );
}
